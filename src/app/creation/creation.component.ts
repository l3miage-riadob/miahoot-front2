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
export class CreationComponent implements OnInit{
    private qcm : Qcm = new Qcm('',[]);
    private idEnseignant: string = '';
    miahootForm: FormGroup = new FormGroup({});
    // readonly miahootUserObs: Observable<MiahootUser | undefined>;
    miahootUserSubject: BehaviorSubject<MiahootUser | undefined> = new BehaviorSubject<MiahootUser | undefined>(undefined);
    protected readonly Role = Role;

    constructor(private http: HttpClient, private formBuilder : FormBuilder, private data : DataService) {}

    ngOnInit() {
        this.data.miahootUser.subscribe(this.miahootUserSubject);
        this.idEnseignant = this.miahootUserSubject.value?.id ?? '';
        this.miahootForm = this.formBuilder.group({
            idEnseignant: new FormControl(this.idEnseignant, Validators.required),
            nom: new FormControl('name', Validators.required),
            questions: this.formBuilder.array([])
        });

        this.data.miahootUser.subscribe((miahootUser) => {
            this.miahootForm.patchValue({
                idEnseignant: miahootUser?.id,
            });
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
            label: new FormControl('reponse', Validators.required),
            estValide: new FormControl(false),
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
        const url = 'http://129.88.210.80:8080/api/v0/miahoots';
        try {
            this.http.post(url, miahoot, {responseType: 'text'})
                .subscribe({
                    next: data  => {
                        console.log(data);
                    }
            });
        } catch (error) {
            console.error(error);
        }
    }
}
