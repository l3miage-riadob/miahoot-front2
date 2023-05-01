import { Injectable } from '@angular/core';
import {Observable,map,of } from "rxjs";
import {Question,MiahootService,Student} from "../miahoot.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  question:Observable<undefined|Question> 

  // OK on peut aller dans QuestionnaireService ?
  constructor(private qstSrv:MiahootService) {
    this.question = qstSrv.obsProjectedQCM.pipe(
      map( qcm => qcm == undefined ? undefined : {
        id: qcm.id,
        question: qcm.question,
        choix : ["choix1","choix2","choix3"]
      })
    )
   }

  student: Observable<Student> = of({
    id: 'etu1',
    name:'studentTest'
  })

  submitResponse(student: Student, question:undefined|Question, L: readonly number[]) : void {
    console.log("réponse pour", student, question, L)
  }
}
