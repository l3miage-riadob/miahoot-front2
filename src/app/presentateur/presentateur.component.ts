import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {Qcm} from "../model/qcm";
import {DataService, MiahootUser} from "../data.service";
import {PresentateurService} from "./presentateur.service";
import {FirestoreService} from "../firestore.service";

interface STATE {
    user: MiahootUser;
    qcms: Qcm[];

}
@Component({
  selector: 'app-presentateur',
  templateUrl: './presentateur.component.html',
  styleUrls: ['./presentateur.component.scss']
})
export class PresentateurComponent {
    readonly obsState: Observable<STATE>;
    constructor(presentateurService : PresentateurService, private FS: FirestoreService, private data: DataService) {
        this.obsState = presentateurService.obsState;
    }

    presenterUnMiahoot(miahoot: Qcm) {
        this.data.updateMiahootUser({projectedMiahoot: miahoot.idMetier})
        this.FS.addProjectedMiahoot(miahoot)
    }
}
