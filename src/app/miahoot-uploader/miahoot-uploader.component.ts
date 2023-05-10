import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImportExportJSONService } from '../import-export-json.service';
import { Qcm } from '../model/qcm';
import { RequestService } from '../request.service';
import {ToasterService} from "../toaster.service";

@Component({
  selector: 'miahoot-uploader',
  templateUrl: './miahoot-uploader.component.html',
  styleUrls: ['./miahoot-uploader.component.scss']
})
export class MiahootUploaderComponent {

  constructor(private IO : ImportExportJSONService, private RS : RequestService, private toaster : ToasterService) {}

  public jsonImport($event : any) {
      this.IO.jsonImport($event)
  }

  saveImportedMiahoot() {
    if (this.IO.targetBuffer) {
      try {
        const jsonObj = JSON.parse(this.IO.targetBuffer)
        //const jsonObj = JSON.parse(this.miahootExample)
        
        //POST 
        const url  = `${environment.springServer}${RequestService.PATH}`
        this.RS.create(url, jsonObj)
        .then((miahoout) => {
          this.toaster.success("VOTRE MIAHOOT A BIEN ÉTÉ CRÉÉ 😀")
        })
        .catch((reason : HttpErrorResponse) => {
          //console.log(reason.status)
          //console.log(reason.error['errorMessage'])
          this.toaster.error("VÉRIFIEZ QUE VOTRE JSON EST BIEN UN MIAHOOT ET QUE VOUS NE POSSÉDEZ PAS DE MIAHOOT AYANT LE MÊME NOM.")
        })
      }catch(e) {
        this.toaster.error("VÉRIFIEZ QUE VOTRE JSON EST BIEN UN MIAHOOT")
      }
    } else {
      this.toaster.error("VEUILLEZ DÉJÀ SÉLECTIONNER UN FICHIER")
    }
  }
}