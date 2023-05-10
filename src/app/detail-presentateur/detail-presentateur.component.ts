import {Component} from '@angular/core';
import {DataService, MiahootUser} from '../data.service';
import {Observable, switchMap, filter, map, shareReplay} from 'rxjs';
import {Qcm} from "../model/qcm";
import {FirestoreService} from "../firestore.service";
import {environment} from "../../environments/environment";
import {RequestService} from "../request.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Question} from "../model/question";
import {Response} from "../model/response";

interface STATE {
  user: MiahootUser;
  qcm: Qcm;
}

@Component({
    selector: 'app-detail-presentateur',
    templateUrl: './detail-presentateur.component.html',
    styleUrls: ['./detail-presentateur.component.scss']
})
export class DetailPresentateurComponent {
    public obsState: Observable<STATE>;
    public miahootForm: FormGroup = new FormGroup({});
    url: string = `${environment.springServer}${RequestService.PATH}`

    constructor(private formBuilder: FormBuilder, private data: DataService, private RS: RequestService, private route: ActivatedRoute, private FS: FirestoreService) {

        this.obsState = data.miahootUserObs.pipe(
            filter(U => U !== undefined),
            map(U => U as MiahootUser),
            switchMap(async U => {
                const state: STATE = {
                    user: U,
                    qcm: await RS.get(`${this.url}/${this.route.snapshot.paramMap.get('id')}`)
                };
                this.miahootForm = this.formBuilder.group({
                    idEnseignant: new FormControl(state.qcm.idEnseignant, Validators.required),
                    nom: new FormControl(state.qcm.nom, Validators.required),
                    questions: this.formBuilder.array([]) // r.questions.map( q => this.generateQuestion(q))
                });
                const q = state.qcm.questions;
                for (let i = 0; i < q.length; i++) {
                    this.addExistingQuestion(q[i])
                    const r = q[i].reponses;
                    for (let j = 0; j < r.length; j++) {
                        this.addQuestionExistingReponse(i, q[i].reponses[j])
                    }
                }
                return state;
            }),
            shareReplay(1)
        )
    }

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

    // récupère les reponses d'une question
    questionReponses(index: number): FormArray {
        return this.questions()
            .at(index)
            .get('reponses') as FormArray;
    }

    presenterUnMiahoot(miahoot: Qcm) {
        this.data.updateMiahootUser({projectedMiahoot: miahoot.idMetier})
        this.FS.addProjectedMiahoot(miahoot)
    }
}
