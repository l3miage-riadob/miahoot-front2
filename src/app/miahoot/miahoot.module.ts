import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {QuestionComponent} from "./question/question.component";
import { environment } from 'src/environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


@NgModule({
  providers: [],
  imports: [
    CommonModule, FormsModule, provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  declarations: [
    QuestionComponent
  ],
  exports: [
    QuestionComponent
  ]
})
export class MiahootModule { }
