import { Injectable } from '@angular/core';
import { FirestoreDataConverter } from '@angular/fire/firestore';
import {Observable, of} from 'rxjs'

export interface Student {
  readonly id : string;
  readonly name : string;
}

export interface Question {
  readonly id : string;
  readonly question : string;
  readonly choir : readonly string []
}

export interface Response {
  readonly student: Student
  readonly question: Question;
  readonly responses : readonly string []
}

export interface Miahoot {
  readonly id : string;
  creator : string;
  presentator : string;
  currentQCM : string;
}

export const FsMiahootProjectedConverter: FirestoreDataConverter<Miahoot> = { 
  toFirestore: M => M, 
  fromFirestore: snap => ({ 
    id: snap.id,
    creator: snap.get("creator"), 
    presentator: snap.get("presentator"), 
    currentQCM: snap.get("currentQCM"), 
  }) 
  } 
@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  constructor() { }



  async getStudentsResponses (): Promise<readonly Response[]> {
    const [students,questions] = await  Promise.all(
        [
            Promise.all( ( await  this.getStudentsID () ).map( id => this.getStudent (id) ) ),
            Promise.all( ( await  this.getQuestionsID() ).map( id => this.getQuestion(id) ) )
        ]
    );
    const L:Promise<Response>[] = students.map(
        student => questions.map( question => this.getStudentResponse(student,question) )
    ).reduce(
        (L, responses) => [...L,...responses],[]
    );

    return Promise.all(L)
  }

  async getStudentResponse(student: Student, question: Question): Promise<Response> {
    return {student, question, responses:[]}
  }

  async getStudentsID(): Promise<readonly string[]> {
    return  [];
  }

  async getStudent(id: string) : Promise<Student> {
    return {id: "1", name : "studentTest"};
  }

  async getQuestion(id:String): Promise<Question> {
    return {id: "1",question: "", choir :[]};
  }

  async getQuestionsID(): Promise<readonly string[]>{
    return []
  }
}
