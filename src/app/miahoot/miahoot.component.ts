import {Component, OnChanges, OnInit} from '@angular/core';
import {QCMProjected, Question, MiahootService, ProjectedMiahoot} from "./miahoot.service";
import {MiahootModule} from "./miahoot.module";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {set} from "@angular/fire/database";
import {DataService, MiahootUser} from "../data.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { FormsModule } from '@angular/forms';

@Component({

    selector: 'app-miahoot',
    templateUrl: './miahoot.component.html',
    styleUrls: ['./miahoot.component.scss'],
    standalone : true,
    imports: [MiahootModule, CommonModule, RouterLink, RouterLinkActive, MatCardModule, MatButtonModule, FormsModule],
})
export class MiahootComponent {
  questionObs: Observable<undefined|QCMProjected>;
  //miahootObs: Observable<undefined|ProjectedMiahoot>;
  miahootObs : BehaviorSubject<undefined|ProjectedMiahoot> = new BehaviorSubject<undefined|ProjectedMiahoot>(undefined);
  miahooUserObs: Observable<undefined|MiahootUser>;
  miahootQCMs : string[] = [];  responses: boolean[] = [];

  constructor(private miahootService:MiahootService, dataService: DataService) {
    this.miahootObs = miahootService.obsProjectedMiahoot;
    this.questionObs = miahootService.obsProjectedQCM;
    this.miahootQCMs = miahootService.ProjectedQCMsIDs;
    this.miahooUserObs = dataService.miahootUser;
  }



    updateCurrentQCM(id : string){
        this.miahootService.updateCurrentQCM(id);
    }

    setNextQuestion(miahootObs : BehaviorSubject<undefined|ProjectedMiahoot>){
    this.miahootService.setNextQuestion(miahootObs);
  }

  protected readonly HTMLDocument = HTMLDocument;

  responseChange(event: any, index: number) {
    const checked = event.target.checked;
    this.responses[index] = checked;
    console.log(this.responses); 
    this.miahootService.updateReponses(this.responses);
  }
  
}

