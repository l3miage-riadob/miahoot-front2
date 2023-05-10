import {ChangeDetectionStrategy, Component, Input, OnInit, OnChanges} from '@angular/core';
import {DataService, MiahootUser} from '../data.service';
import {BehaviorSubject, Observable, filter, lastValueFrom, map, shareReplay, switchMap} from 'rxjs';
import {Qcm} from "../model/qcm";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from '@angular/router';
import {RequestService} from '../request.service';
import {Question} from "../model/question";
import {Response} from "../model/response";
import {environment} from 'src/environments/environment.development';
import {MiahootsService} from '../miahoots.service';
import {FirestoreService} from "../firestore.service";

interface STATE {
    user: MiahootUser;
    qcm: Qcm;
}

@Component({
    selector: 'app-detail-concepteur',
    templateUrl: './detail-concepteur.component.html',
    styleUrls: ['./detail-concepteur.component.scss']
})
export class DetailConcepteurComponent {

    public stateObs: Observable<STATE>;
    public miahootForm: FormGroup = new FormGroup({});

    url: string = `${environment.springServer}${RequestService.PATH}`
    idMetier = this.route.snapshot.paramMap.get('id') as string;

    private _isDeleted: boolean = false;
    private _isDisabled: boolean = true;

    constructor(private formBuilder: FormBuilder, private data: DataService, private MS: MiahootsService,
                private route: ActivatedRoute, private FS: FirestoreService) {

        this.stateObs = MS.stateObs.pipe(
            switchMap(async state => {
                const s: STATE = {
                    user: state.user,
                    qcm: await MS.getQcmByIdMetier(this.idMetier)
                };
                this.miahootForm = this.formBuilder.group({
                    nom: new FormControl(s.qcm.nom, Validators.required),
                    idEnseignant: new FormControl(s.qcm.idEnseignant, Validators.required),
                    idMetier: new FormControl(this.idMetier, Validators.required),
                    questions: this.formBuilder.array([]) // r.questions.map( q => this.generateQuestion(q))
                });
                const q = s.qcm.questions;
                for (let i = 0; i < q.length; i++) {
                    this.addExistingQuestion(q[i])
                    const r = q[i].reponses;
                    for (let j = 0; j < r.length; j++) {
                        this.addQuestionExistingReponse(i, q[i].reponses[j])
                    }
                }
                return s;
            }),
            shareReplay(1)
        );
    }

    get isDeleted(): boolean {return this._isDeleted;}
    set isDeleted(value: boolean) {this._isDeleted = value;}

    get isDisabled(): boolean { return this._isDisabled;}
    set isDisabled(value: boolean) { this._isDisabled = value;}

    existingQuestion(question: Question): FormGroup {
        return this.formBuilder.group({
            label: new FormControl(question.label, Validators.required),
            reponses: this.formBuilder.array([])
        });
    }

    existingResponse(response: Response): FormGroup {
        return this.formBuilder.group({
            label: new FormControl(response.label, Validators.required),
            estValide: new FormControl(response.estValide),
        });
    }

    // ajoute une question existante dans la liste des questions
    addExistingQuestion(question: Question) {
        this.questions().push(this.existingQuestion(question));
    }

    // ajoute une reponse existante dans la liste des reponses
    addQuestionExistingReponse(index: number, response: Response) {
        this.questionReponses(index).push(this.existingResponse(response));
    }

    // retourne les questions
    questions(): FormArray {
        return this.miahootForm.get('questions') as FormArray;
    }

    newQuestion(): FormGroup {
        return this.formBuilder.group({
            label: new FormControl('name', Validators.required),
            reponses: this.formBuilder.array([])
        });
    }

    // ajoute une nouvelle question
    addNewQuestion() {
        this.questions().push(this.newQuestion());
    }

    // supprime une question
    removeQuestion(index: number) {
        this.questions().removeAt(index);
    }

    // récupère les reponses d'une question
    questionReponses(index: number): FormArray {
        return this.questions()
            .at(index)
            .get('reponses') as FormArray;
    }

    // crée une nouvelle reponse
    newReponse(): FormGroup {
        return this.formBuilder.group({
            label: new FormControl('reponse', Validators.required),
            estValide: new FormControl(false),
        });
    }

    // ajoute une nouvelle reponse
    addQuestionReponse(index: number) {
        this.questionReponses(index).push(this.newReponse());
    }

    removeQuestionReponse(qIndex: number, rIndex: number) {
        this.questionReponses(qIndex).removeAt(rIndex);
    }


    async onSubmit() {
        try {
            const update = await this.MS.update(this.idMetier, this.miahootForm.value)
        } catch (err) {
            console.log(`Une erreur est survenue lors de la tentative d'update: ${err}`)
        }
    }


    async delete() {
        try {
            const del = await this.MS.deleteQcm(this.idMetier);
            this._isDeleted = true;
        } catch (err) {
            console.log(`ERROR DELETE dans detail: ${err}`);
        }
    }
    

    enableEditing(): void {
        this._isDisabled = !this._isDisabled;
    }

    presenterUnMiahoot(miahoot: Qcm) {
        this.data.updateMiahootUser({projectedMiahoot: miahoot.idMetier})
        this.FS.addProjectedMiahoot(miahoot)
    }
}