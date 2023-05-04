import {Component, OnChanges, OnInit} from '@angular/core';
import {QCMProjected, Question, PresentationService, ProjectedMiahoot} from "./presentation.service";
import {PresentationModule} from "./presentation.module";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {set} from "@angular/fire/database";
import {DataService, MiahootUser} from "../data.service";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import { FormsModule } from '@angular/forms';

@Component({

    selector: 'app-presentation',
    templateUrl: './presentation.component.html',
    styleUrls: ['./presentation.component.scss'],
    standalone : true,
    imports: [PresentationModule, CommonModule, RouterLink, RouterLinkActive, MatCardModule, MatButtonModule, FormsModule],
})
export class PresentationComponent {
  questionObs: Observable<undefined|QCMProjected>;
  //miahootObs: Observable<undefined|ProjectedMiahoot>;
  miahootObs : BehaviorSubject<undefined|ProjectedMiahoot> = new BehaviorSubject<undefined|ProjectedMiahoot>(undefined);
  miahooUserObs: Observable<undefined|MiahootUser>;
  miahootQCMs : string[] = [];  responses: boolean[] = [];

  constructor(private miahootService:PresentationService, dataService: DataService) {
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

