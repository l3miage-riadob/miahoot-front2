import { Injectable } from '@angular/core';
import {Observable,of } from "rxjs";
import {Question,Student} from "../questionnaire.service";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor() { }
  question:Observable<Question> =  of ({
    id:"Q1",
    question: "question test",
    choir: ['Choix 1','Choix 2' ,'Choix 3', 'Choix 4']
  })

  student: Observable<Student> = of({
    id: 'etu1',
    name:'studentTest'
  })

  submitResponse(student: Student, question:Question, L: readonly number[]) : void {
    console.log("réponse pour", student, question, L)
  }
}
