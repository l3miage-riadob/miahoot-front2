import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { Qcm } from './model/qcm';
import {ToasterService} from "./toaster.service";
@Injectable({
  providedIn: 'root'
})
export class ImportExportJSONService {
  public targetBuffer : string = "" 

  constructor(private toaster : ToasterService) {}

  public jsonImport($event : any) {
    const files = $event.target.files
    const readFile : Blob  = files[0]
    const reader = new FileReader()

    reader.readAsText(readFile)

    reader.onload = () => {
    
      if (typeof(reader.result) === "string") {
        this.targetBuffer = reader.result

      }
    };
  
    reader.onerror = function() {
      console.error(reader.error);
      throw "jsonImport() : Erreur lors de la lecture du fichier" + files[0].name
    };

  }

  exportMiahootToJSON(miahoot : Qcm) : void {
    const data = JSON.stringify(miahoot)
    const blobito = new Blob([data], {type: "application/json"})
    saveAs(blobito, miahoot.nom + '.json')
    this.toaster.success("MIAHOOT TÉLÉCHARGÉ AU FORMAT JSON")
  }
}
