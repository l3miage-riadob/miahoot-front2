import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Qcm} from "../model/qcm";


// voir pour le rajouter dans les routes

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent {
    private qcm : Qcm = new Qcm('',[]);
    miahootForm: FormGroup;

    constructor(private http: HttpClient, private formBuilder : FormBuilder) {
        this.miahootForm = this.formBuilder.group({
            name: new FormControl('name', Validators.required),
            questions: this.formBuilder.array([])
        });
    }

    ngOnInit() {
        this.miahootForm = this.formBuilder.group({
            name: new FormControl('name', Validators.required),
            questions: this.formBuilder.array([])
        });
    }

    questions(): FormArray {
        return this.miahootForm.get('questions') as FormArray;
    }

    newQuestion(): FormGroup {
        return this.formBuilder.group({
            label: new FormControl('name', Validators.required),
            reponses: this.formBuilder.array([])
        });
    }

    addQuestion() {
        this.questions().push(this.newQuestion());
    }

    removeQuestion(index: number) {
        this.questions().removeAt(index);
    }

    questionReponses(index: number): FormArray {
        return this.questions()
            .at(index)
            .get('reponses') as FormArray;
    }

    newReponse(): FormGroup {
        return this.formBuilder.group({
            reponse: new FormControl('reponse', Validators.required),
            isCorrect: new FormControl(false),
        });
    }

    addQuestionReponse(index: number) {
        this.questionReponses(index).push(this.newReponse());
    }

    removeQuestionReponse(qIndex: number, rIndex: number) {
        this.questionReponses(qIndex).removeAt(rIndex);
    }

    onSubmit() {
        console.log(this.miahootForm.value);
        this.qcm = this.miahootForm.value;
        console.log(this.qcm);

    }


    /*
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

   creationMiahootForm: FormGroup = new FormGroup({
     name: new FormControl('', Validators.required),
     qcms: this.qcmFormArray,
   });

   constructor(private http: HttpClient, private formBuilder : FormBuilder) {}

     getqcms(): FormArray {
       return this.creationMiahootForm.get("qcms") as FormArray
     }

     newqcm(): FormGroup {
         return this.formBuilder.group({
             question: '',
             responses: this.formBuilder.array([])
         })
     }

     addqcm() {
         this.getqcms().push(this.newqcm());
     }

     removeqcm(i:number) {
         this.getqcms().removeAt(i);
     }

     getqcmQuestions(index:number): FormArray {
       return this.getqcms().at(index).get("questions") as FormArray
     }

   public addResponse(index : number): void {
     this.responseFormArray.push(
       new FormGroup({
         response: new FormControl('', Validators.required),
         isCorrect: new FormControl(false),
       })
     );
   }

   public addQuestion(): void {
     this.qcmFormArray.push(
       new FormGroup({
         question: new FormControl('', Validators.required),
         responses: this.responseFormArray,
       })
     );
   }
   async createMiahoot(data: any): Promise<any> {
     const url = 'localhost:8080';
     return await lastValueFrom(this.http.post(url, data));
   }

     */
}
