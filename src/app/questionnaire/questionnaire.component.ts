import { Component } from '@angular/core';
import {QCMProjected, Question, QuestionnaireService, Student} from "./questionnaire.service";
import {QuestionnaireModule} from "./questionnaire.module";
import {CommonModule} from "@angular/common";
import {QuestionService} from "./question/question.service";
import {combineLatest, map, Observable} from "rxjs";



interface STATE{
  student: Student;
  question: undefined|Question;
}
@Component({

    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss'],
    standalone : true,
    imports : [QuestionnaireModule,CommonModule],
    providers : [QuestionService,QuestionnaireService]
})
export class QuestionnaireComponent {
  stateObs: Observable<STATE>;
  questionObs: Observable<undefined|QCMProjected>;
  
  constructor(private qstSrv:QuestionService, private qstSrv2:QuestionnaireService) {
    this.stateObs = combineLatest(
        [
            qstSrv.student,
            qstSrv.question
        ]
    ).pipe(
        map( ([student,question]) => ({student,question}) )
        )
    this.questionObs = qstSrv2.obsQCMProjectedMiahoot;
  }

  repondre (student:Student, question:  undefined|Question, L : readonly number[]): void {
    this.qstSrv.submitResponse(student, question, L) ;
  }
}
