import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";


// voir pour le rajouter dans les routes

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent {
  question !: string;
  responses ! : string[];

  responseFormArray: FormArray = new FormArray([
        new FormGroup({
          response: new FormControl('', Validators.required),
          isCorrect: new FormControl(false),
        }),
    ]);

  qcmFormArray: FormArray = new FormArray([
       new FormGroup({
        question: new FormControl('', Validators.required),
        responses: this.responseFormArray,
      }),
  ]);

  creationForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    qcms: this.qcmFormArray,
  });

  constructor(private http: HttpClient) {}

  public addResponse(): void {
    this.responseFormArray.push(
      new FormGroup({
        response: new FormControl('', Validators.required),
        isCorrect: new FormControl(false),
      })
    );
  }

  async createMiahoot(data: any): Promise<any> {
    const url = 'localhost:8080';
    return await lastValueFrom(this.http.post(url, data));
  }
}
