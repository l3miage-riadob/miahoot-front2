import { Component } from '@angular/core';
import { Observable, map, shareReplay, switchMap } from 'rxjs';
import { Qcm } from '../model/qcm';
import { MiahootsService } from '../miahoots.service';
import { environment } from 'src/environments/environment';
import { RequestService } from '../request.service';
import {DataService, MiahootUser} from '../data.service';
import {FirestoreService} from "../firestore.service";
import {ImportExportJSONService} from "../import-export-json.service";


interface STATE {
  user: MiahootUser;
  qcms: Qcm[];
}


@Component({
  selector: 'app-concepteur',
  templateUrl: './concepteur.component.html',
  styleUrls: ['./concepteur.component.scss']
})
export class ConcepteurComponent {

  public stateObs: Observable<STATE>;
  
  constructor(private MS: MiahootsService, private FS: FirestoreService, private data: DataService, private IO : ImportExportJSONService) {
    
    this.stateObs = MS.stateObs.pipe(
      shareReplay(1)
    )

  }

  async delete(idMetier: string | undefined) {
    if (idMetier !== undefined) {
      const del = await this.MS.deleteQcm(idMetier);
    }
  }

  presenterUnMiahoot(miahoot: Qcm) {
    this.data.updateMiahootUser({projectedMiahoot: miahoot.idMetier})
    this.FS.addProjectedMiahoot(miahoot)
  }

  public exportMiahootToJSON(miahoot: Qcm) {
    this.IO.exportMiahootToJSON(miahoot)
  }


}
