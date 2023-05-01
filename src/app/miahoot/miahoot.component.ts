import { Component } from '@angular/core';
import {QCMProjected, Question, MiahootService, ProjectedMiahoot} from "./miahoot.service";
import {MiahootModule} from "./miahoot.module";
import {CommonModule} from "@angular/common";
import {BehaviorSubject, combineLatest, map, Observable} from "rxjs";

@Component({

    selector: 'app-miahoot',
    templateUrl: './miahoot.component.html',
    styleUrls: ['./miahoot.component.scss'],
    standalone : true,
    imports : [MiahootModule,CommonModule],
})
export class MiahootComponent {
  questionObs: Observable<undefined|QCMProjected>;
  miahootObs: Observable<undefined|ProjectedMiahoot>;

  constructor(private miahootService:MiahootService) {
    this.miahootObs = miahootService.obsProjectedMiahoot;
    this.questionObs = miahootService.obsProjectedQCM;
  }
}
