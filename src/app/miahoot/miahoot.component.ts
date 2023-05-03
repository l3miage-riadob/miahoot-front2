import {Component, OnChanges, OnInit} from '@angular/core';
import {QCMProjected, Question, MiahootService, ProjectedMiahoot} from "./miahoot.service";
import {MiahootModule} from "./miahoot.module";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {set} from "@angular/fire/database";
import {DataService, MiahootUser} from "../data.service";

@Component({

    selector: 'app-miahoot',
    templateUrl: './miahoot.component.html',
    styleUrls: ['./miahoot.component.scss'],
    standalone : true,
    imports : [MiahootModule,CommonModule],
})
export class MiahootComponent {
  questionObs: Observable<undefined|QCMProjected>;
  //miahootObs: Observable<undefined|ProjectedMiahoot>;
  miahootObs : BehaviorSubject<undefined|ProjectedMiahoot> = new BehaviorSubject<undefined|ProjectedMiahoot>(undefined);
  miahooUserObs: Observable<undefined|MiahootUser>;
  miahootQCMs : string[] = [];
  constructor(private miahootService:MiahootService, dataService: DataService) {
    this.miahootObs = miahootService.obsProjectedMiahoot;
    console.log(miahootService.obsProjectedMiahoot)
    this.questionObs = miahootService.obsProjectedQCM;
    this.miahootQCMs = miahootService.ProjectedQCMsIDs;
    this.miahooUserObs = dataService.miahootUser;

  }

    setNextQuestion(){
    this.miahootService.setNextQuestion();
  }

}

