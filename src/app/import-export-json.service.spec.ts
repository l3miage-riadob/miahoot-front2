import { TestBed } from '@angular/core/testing';

import { ImportExportJSONService } from './import-export-json.service';

describe('ImportExportJSONService', () => {
  let service: ImportExportJSONService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportExportJSONService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
