import { Component } from '@angular/core';
import {Question, Student} from "./questionnaire.service";
import {QuestionnaireModule} from "./questionnaire.module";
import {CommonModule} from "@angular/common";
import {QuestionService} from "./question/question.service";
import {combineLatest, map, Observable} from "rxjs";



interface STATE{
  student: Student;
  question:Question;
}
@Component({

    selector: 'app-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss'],
    standalone : true,
    imports : [QuestionnaireModule,CommonModule],
    providers : [QuestionService]
})
export class QuestionnaireComponent {
  stateObs: Observable<STATE>;

  constructor(private qstSrv:QuestionService) {
    this.stateObs = combineLatest(
        [
            qstSrv.student,
            qstSrv.question
        ]
    ).pipe(
        map( ([student,question]) => ({student,question}) )
        )
  }

  repondre (student:Student, question: Question, L : readonly number[]): void {
    this.qstSrv.submitResponse(student, question, L) ;
  }
}
