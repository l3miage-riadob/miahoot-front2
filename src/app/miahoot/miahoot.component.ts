import { Component } from '@angular/core';
import {QCMProjected, Question, MiahootService, Student, ProjectedMiahoot} from "./miahoot.service";
import {MiahootModule} from "./miahoot.module";
import {CommonModule} from "@angular/common";
import {QuestionService} from "./question/question.service";
import {combineLatest, map, Observable} from "rxjs";



interface STATE{
  student: Student;
  question: undefined|Question;
}
@Component({

    selector: 'app-miahoot',
    templateUrl: './miahoot.component.html',
    styleUrls: ['./miahoot.component.scss'],
    standalone : true,
    imports : [MiahootModule,CommonModule],
    providers : [QuestionService,MiahootService]
})
export class MiahootComponent {
  stateObs: Observable<STATE>;
  questionObs: Observable<undefined|QCMProjected>;
  miahootObs: Observable<undefined|ProjectedMiahoot>;
  // Note aux devs qui passeraient par ici, mettez des noms descriptifs aux variables, c'est plus facile à comprendre, qsrsrv et qsrsrvc2  c'est pas très parlant
  constructor(private questionService:QuestionService, private miahootService:MiahootService) {
    this.stateObs = combineLatest(
        [
            questionService.student,
            questionService.question
        ]
    ).pipe(
        map( ([student,question]) => ({student,question}) )
        )
    this.miahootObs = miahootService.obsProjectedMiahoot;
    this.questionObs = miahootService.obsProjectedQCM;
  }

  repondre (student:Student, question:  undefined|Question, L : readonly number[]): void {
    this.questionService.submitResponse(student, question, L) ;
  }
}
