import { Component} from '@angular/core';
import {QCMProjected, Question, MiahootService, ProjectedMiahoot} from "./miahoot.service";
import {MiahootModule} from "./miahoot.module";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";
import {set} from "@angular/fire/database";
import { FormsModule } from '@angular/forms';

@Component({

    selector: 'app-miahoot',
    templateUrl: './miahoot.component.html',
    styleUrls: ['./miahoot.component.scss'],
    standalone : true,
    imports : [MiahootModule,CommonModule, FormsModule],
})
export class MiahootComponent {
  questionObs: Observable<undefined|QCMProjected>;
  miahootObs: Observable<undefined|ProjectedMiahoot>;
  responses: boolean[] = [];

  constructor(private miahootService:MiahootService) {
    this.miahootObs = miahootService.obsProjectedMiahoot;
    this.questionObs = miahootService.obsProjectedQCM;
  }

  setNextQuestion(){
    this.miahootService.setNextQuestion();
  }

  protected readonly set = set;

  responseChange(event: any, index: number) {
    const checked = event.target.checked;
    this.responses[index] = checked;
    console.log(this.responses);  
  }
  
}

