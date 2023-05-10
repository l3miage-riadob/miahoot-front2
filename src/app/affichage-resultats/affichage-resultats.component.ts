import { Component } from '@angular/core';
import {BehaviorSubject, map, Observable, of, switchAll} from "rxjs";
import {HistoriqueProjectedMiahoot} from "../firestore.service";
import {HistoRepQcm, PresentationService} from "../presentation.service";
import {collection, Firestore, getDocs} from "@angular/fire/firestore";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'app-affichage-resultats',
  templateUrl: './affichage-resultats.component.html',
  styleUrls: ['./affichage-resultats.component.scss']
})
export class AffichageResultatsComponent {

    idMiahootProjete = this.route.snapshot.paramMap.get('id') as string;
    BShisto: BehaviorSubject<HistoRepQcm[] | undefined> = new BehaviorSubject<HistoRepQcm[] | undefined>(undefined)
    historiqueRepQcmObs: Observable<HistoRepQcm[] | undefined>;

    constructor(private firestore: Firestore, private route: ActivatedRoute ) {
        this.historiqueRepQcmObs = this.BShisto.asObservable();
        this.rien()

    }

    async rien() {
        const querySnapshot = await getDocs(collection(this.firestore, `historiqueProjectedMiahoots/${this.idMiahootProjete}/allReponses`))
        let tabRepQcm: HistoRepQcm[] = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data() as HistoRepQcm
            tabRepQcm.push(data)
        })
        console.log("Dans endQcm le tableau de tous les tableaux de réponses")

        of(tabRepQcm).pipe(
            map( value => {return value })).subscribe(this.BShisto)
    }

}
