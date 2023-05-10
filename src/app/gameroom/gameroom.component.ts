import {Component, OnChanges, OnInit} from '@angular/core';
import {ProjectedQCM, Question, PresentationService} from "../presentation.service";
import {BehaviorSubject, combineLatest, filter, map, Observable, of, shareReplay, switchMap} from "rxjs";
import {set} from "@angular/fire/database";
import {DataService, MiahootUser} from "../data.service";
import {ActivatedRoute, RouterLink, RouterLinkActive} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from '@angular/forms';
import {user} from "@angular/fire/auth";
import {HistoriqueProjectedMiahoot, ProjectedMiahoot} from "../firestore.service";

interface STATE {
    user: MiahootUser;
    projectedMiahoot: ProjectedMiahoot;
    projectedQCM: ProjectedQCM;
    miahootQCMs: string[]
}

interface LesParticipants {
    nombre: number
}


@Component({
    selector: 'app-gameroom',
    templateUrl: './gameroom.component.html',
    styleUrls: ['./gameroom.component.scss'],
})
export class GameroomComponent {
    obsState!: Observable<STATE>;
    responses: boolean[] = [];
    idMetier = this.route.snapshot.paramMap.get('id') as string;

    observeHistorique: Observable<HistoriqueProjectedMiahoot | undefined>;

    constructor(private presentationService: PresentationService, private dataService: DataService, private route: ActivatedRoute) {

        this.observeHistorique = this.presentationService.ObsHistorique;

        this.obsState = combineLatest([dataService.miahootUserObs, presentationService.ObsProjectedMiahoot,
            presentationService.ObsProjectedQCM]).pipe(
            filter(([user, projectedMiahoot, projectedQCM]) =>
                user !== undefined && projectedMiahoot !== undefined && projectedQCM !== undefined),
            map(([user, projectedMiahoot, projectedQCM ]) => {
                return {
                    user: user as MiahootUser,
                    projectedMiahoot: projectedMiahoot as ProjectedMiahoot,
                    projectedQCM: projectedQCM as ProjectedQCM,
                }
            }),
            switchMap(async (M) => {
                const state: STATE = {
                    user: M.user,
                    projectedMiahoot: M.projectedMiahoot,
                    projectedQCM: M.projectedQCM,
                    miahootQCMs: await this.presentationService.getQCMsIDs(),
                }
                return state;
            }),
            shareReplay(1)
        );

        this.obsState.subscribe((state) => {
            if (state.projectedQCM) {
                this.responses = state.projectedQCM.reponses.map(() => false);
            }
        });
    }

    //get isStarted(): boolean {return this._isStarted;}
    //set isStarted(value: boolean) {this._isStarted = value;}

    getIdMetier(): string {
        return this.idMetier;
    }

    updateCurrentQCM(id: string) {
        this.presentationService.updateCurrentQCM(id);
    }

    setNextQuestion() {
        // changer la valeur du projectedMihaoot dans l'observable obsState
        this.presentationService.setNextQuestion();
    }

    responseChange(event: any, index: number) {
        const checked = event.target.checked;
        this.responses[index] = checked;
        this.presentationService.updateReponses(this.responses);
    }

    startQcm(): void {
        this.presentationService.startQcm();
    }

    endQcm(): void {
        this.presentationService.endQcm();
    }

}

