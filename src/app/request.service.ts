import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable, of, shareReplay } from "rxjs";


/**
 * Ce service contient les méthodes permettant d'interroger un serveur
 *  
 */

@Injectable({
    providedIn: 'root'
})
export class RequestService {

  private requestBS: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  requestObs: Observable<any>;

  constructor(ngz: NgZone, private http: HttpClient) {
      this.requestObs = this.requestBS
  }

  /**
   * Requête GET
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête
   * @returns Un observable du type de l'objet renvoyé par le serveur suite à cette requête ou undefined si erreur
   */
  get(url: string): Observable<any | undefined> {
    try {
      const request = this.http.get<any>(url)
      request.subscribe()
      return request;
    } catch (err) {
      const error: HttpErrorResponse = err as HttpErrorResponse;
      if (error.status === 404) {
        // Erreur coté serveur
        // Pour le get celà arrive si la requête ne trouve aucun miahoot associé à cette enseignant.
        console.error(`${error.status} NOT FOUND, BODY ERROR: `, error.error); 
      } else {
        // Erreur coté client.
        console.error("Erreur lors la tentative de récupération de l'entité:", error.error);
      }
      return of(undefined);
    }
  } 

  /**
   * Requête CREATE
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête 
   * @param body L'entité à créer
   * @returns Un observable du type de l'objet renvoyé par le serveur suite à cette requête ou undefined si erreur
   */

  create(url: string, body: Object): Observable<any | undefined> {
    try {
      const request = this.http.post(url, body, {responseType: 'text'}); 
      request.subscribe()
      return request;
    } catch (err) {
      const error: HttpErrorResponse = err as HttpErrorResponse;
      console.error("Erreur lors la tentative de surpression de l'entité:", error.error);
      return of(undefined);
    }
  }
  
  /**
   * Requête UPDATE
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête 
   * @param body L'entité à update
   * @returns Un observable du type de l'objet renvoyé par le serveur suite à cette requête ou undefined si erreur
   */

  update(url: string, body: Object): Observable<any | undefined> {
    try {
      const request = this.http.patch(url, body)
      request.subscribe()
      return request;
    } catch (err) { 
      const error: HttpErrorResponse = err as HttpErrorResponse;
      if (error.status === 404) {
        // Erreur coté serveur
        // Pour le get celà arrive si la requête ne trouve aucun miahoot associé à cette enseignant.
        console.error(`${error.status} NOT FOUND, BODY ERROR: `, error.error);  
      } else {
        // Erreur coté client.
        console.error("Erreur lors la tentative de mise à jour de l'entité:", error.error);
      }
      return of(undefined);
    }
  }


  /**
   * Requête DELETE
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête
   * @param option Par simplicité il a le type any mais ce paramètre doit être du même type que le paramètre 
   * optionnel de la méthode delete de HttpClient
   * @returns Un observable du type de l'objet renvoyé par le serveur suite à cette requête ou undefined si erreur
   */
  delete(url: string, option?: any): Observable<any | undefined> {
    try {
      let request;
      if (option != undefined) {
        request = this.http.delete<any>(url, option);
      } else {
        request = this.http.delete<any>(url);
      }
      request.subscribe()
      return request;

    } catch (err) {
      const error: HttpErrorResponse = err as HttpErrorResponse;
      console.error("Erreur lors la tentative de surpression de l'entité:", error.error);
      return of(undefined);
    }
  }
    

}



