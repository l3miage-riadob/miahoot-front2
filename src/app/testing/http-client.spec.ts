// HTTP testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// Other imports
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Data } from '@angular/router';

//add the HttpClientTestingModule to the TestBed and continue with the setup of the service-under-test. 
describe('HttpClient testing', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        // Inject the http service and test controller for each test
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    //Now requests made in the course of your tests will hit the testing backend instead of the normal backend.
    //This setup also calls TestBed.inject() to inject the HttpClient service, and the mocking controller, 
    //so they can be referenced during the tests. 

    /// ----------------- Tests begin --------------------- ///

    // test that expect a GET request to occur and provides a mock response
    it('can test HttpClient.get', () => {
        const testData: Data = {name : 'Test Data'};
        
        // Make an HTTP GET request
        httpClient.get<Data>('/data') //testURL
        .subscribe(data =>
            // When observable resolves, result should match test data
            expect(data).toEqual(testData)
        );

        // The following "expectOne()" will match the request's URL.
        // If no requests or multiple requests matched that URL
        // "expectOne()" would throw.
        const req = httpTestingController.expectOne('/data');


        /* 
        if matching by URL isn't sufficient, it's possible to implement your own matching function. For example, 
        you could look for an outgoing request that has an authorization header.*

        const req2 = httpTestingController.expectOne(req => req.headers.has('Authorization'));
        
        handle more than one request : match() instead of expectOne()
        */

        // Assert that the request is a GET.
        expect(req.request.method).toEqual('GET');

        // Respond with mock data, causing Observable to resolve.
        // Subscribe callback asserts that correct data was returned.
        req.flush(testData);

        // Finally, assert that there are no outstanding requests.
        afterEach(() => {
            httpTestingController.verify();
        });
    });

    // test app's defenses against HTTP requests that fail 
    it('can test for 404 error', () => {
        const emsg = 'deliberate 404 error';

        httpClient.get<Data[]>('/data')
        .subscribe({
            next: () => fail('should have failed with the 404 error'),
            error: (error: HttpErrorResponse) => {
                expect(error.status).withContext('status').toEqual(404);
                expect(error.error).withContext('message').toEqual(emsg);
            },
        });

        const req = httpTestingController.expectOne('/data');

        // Respond with mock error
        req.flush(emsg, { status: 404, statusText: 'Not Found' });
        
    });

    // test network error
    it('can test for network error', done => {
        // create mock ProgressEvent with a type "error", raised when something goes wrong at the network level 
        // ex Connection timeout, DNS error, offline, etc
        const mockError = new ProgressEvent('error');

        httpClient.get<Data[]>('/data')
        .subscribe({
            next: () => fail('should have failed with the network error'),
            error: (error: HttpErrorResponse) => { 
                expect(error.error).toBe(mockError);
                done();
            },
        });

        const req = httpTestingController.expectOne('/data');

        // Respond with mock error
        req.error(mockError);

    });
});