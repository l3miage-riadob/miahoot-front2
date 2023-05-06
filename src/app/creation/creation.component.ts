import { HttpClient } from '@angular/common/http';
import {Component, OnChanges, OnInit} from '@angular/core';
import { lastValueFrom, BehaviorSubject, Observable, map, tap} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Qcm} from "../model/qcm";
import {DataService, MiahootUser, Role} from "../data.service";
import { RequestService } from '../request.service';


// voir pour le rajouter dans les routes

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent implements OnInit {

    protected readonly Role = Role;

    miahootUserObs: Observable<MiahootUser | undefined> = new Observable(undefined);

    private qcm : Qcm = new Qcm('',[]);
    private idEnseignant: string | undefined = '';

    bob: MiahootUser | undefined;

    miahootForm: FormGroup = new FormGroup({});

    url: string = 'http://129.88.210.80:8080/api/v0/miahoots';

    constructor(private http: HttpClient, private formBuilder : FormBuilder, private data : DataService, private RS: RequestService) {

        this.miahootUserObs = this.data.miahootUserBS;

        this.data.miahootUserBS.subscribe( miahoot =>
            this.idEnseignant = miahoot?.id
        )

        console.log("ALORS = ", this.idEnseignant)

        this.idEnseignant = this.data.miahootUserBS.value?.id


        this.miahootForm = this.formBuilder.group({
            idEnseignant: new FormControl(this.idEnseignant, Validators.required),
            nom: new FormControl('name', Validators.required),
            questions: this.formBuilder.array([])
        });
    }

    ngOnInit(): void {

    }

    questions(): FormArray {
        console.log("questions AAA = ", this.miahootForm.get('questions')?.value)
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
        this.qcm.idEnseignant = this.idEnseignant;
        console.log(this.qcm);
        this.RS.create(this.url, this.qcm);
    }

}
