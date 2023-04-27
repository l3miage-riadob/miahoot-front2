import { HttpClient } from '@angular/common/http';
import {Component, OnChanges, OnInit} from '@angular/core';
import { lastValueFrom, BehaviorSubject} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Qcm} from "../model/qcm";
import {DataService, MiahootUser, Role} from "../data.service";


// voir pour le rajouter dans les routes

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent implements OnInit, OnChanges{
    private qcm : Qcm = new Qcm('',[]);
    private idEnseignant: string = '';

    miahootForm: FormGroup = new FormGroup({});
    // readonly miahootUserObs: Observable<MiahootUser | undefined>;
    miahootUserSubject: BehaviorSubject<MiahootUser | undefined> = new BehaviorSubject<MiahootUser | undefined>(undefined);

    constructor(private http: HttpClient, private formBuilder : FormBuilder, private data : DataService) {}
    ngOnInit() {
        this.data.miahootUser.subscribe(this.miahootUserSubject);
        this.idEnseignant = this.miahootUserSubject.value?.id ?? '';
        this.miahootForm = this.formBuilder.group({
            idEnseignant: new FormControl(this.idEnseignant, Validators.required),
            name: new FormControl('name', Validators.required),
            questions: this.formBuilder.array([])
        });

        this.data.miahootUser.subscribe((miahootUser) => {
            this.miahootForm.patchValue({
                idEnseignant: miahootUser?.id,
            });
        });

    }

    ngOnChanges() {
        this.idEnseignant = this.miahootUserSubject.value?.id ?? '';
        this.miahootForm = this.formBuilder.group({
            idEnseignant: new FormControl(this.idEnseignant, Validators.required),
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
        this.qcm.idEnseignant = this.miahootForm.value.idEnseignant;
        console.log(this.qcm);
        this.createMiahoot(this.qcm);
    }

    async createMiahoot(miahoot: Qcm ): Promise<any> {
        const url = 'localhost:8080/api/v0/miahoots';
        try {
            const response = await lastValueFrom(this.http.post(url, miahoot));
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    createMiahoot2(miahoot: Qcm ): void {
        const url = 'localhost:8080/';
        let lesMiahoots: Qcm[] = [];
        this.http.get<Qcm[]>(url).subscribe({
                next: data => {
                    lesMiahoots = data;
                },
                error: error => {
                    console.error('There was an error!', error);
                },
            }
        )
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
    protected readonly Role = Role;
}
