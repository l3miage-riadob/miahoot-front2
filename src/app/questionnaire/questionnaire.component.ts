import { Component } from '@angular/core';
import {Question, Student} from "./questionnaire.service";
import {QuestionnaireModule} from "./questionnaire.module";
import {CommonModule} from "@angular/common";
import {QuestionService} from "./question/question.service";
import {combineLatest, map, Observable, of, switchMap} from "rxjs";
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';



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
  readonly obsProjectedMiahootID: Observable<string | undefined>;
  constructor(private qstSrv:QuestionService, private fs: Firestore, private auth : Auth) {
    this.obsProjectedMiahootID = authState(auth).pipe(
      switchMap( user => {
       if (user == null) {
        return of (undefined);
      } else {
        const docUser = doc(fs, `QCM_Current/${user.uid}`).withConverter(  FsUserConverter );
        return docData(docUser).pipe(
          map( user => user?.['QCM_Current'] )
        )
      }
    })
    );

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
