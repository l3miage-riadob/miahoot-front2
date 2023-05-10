import { HttpClient } from '@angular/common/http';
import {Component, OnChanges, OnInit} from '@angular/core';
import { lastValueFrom, BehaviorSubject, Observable, map, tap, filter, switchMap, shareReplay} from 'rxjs';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Qcm} from "../model/qcm";
import {DataService, MiahootUser} from "../data.service";
import { RequestService } from '../request.service';
import { environment } from 'src/environments/environment';
import {MiahootsService} from "../miahoots.service";
import {ToasterService} from "../toaster.service";



interface STATE {
    user: MiahootUser;
}

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.scss']
})
export class CreationComponent {

    /**
     * @var qcm Variable qui sert à récupérer la valeur du qcm qui a été construit dans la variable miahootForm pour 
     * envoyer la requête de création sur le serveur
     */
    public obsState: Observable<STATE>;
    public miahootForm: FormGroup = new FormGroup({});
    url: string = `${environment.springServer}${RequestService.PATH}`
    creationSucces: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private formBuilder : FormBuilder, private data: DataService, private MS: MiahootsService, private toaster: ToasterService) {
  
        this.obsState = data.miahootUserObs.pipe( 
            filter( U => U !== undefined ),
            map( U => U as MiahootUser ),
            switchMap( async U => {
                const state: STATE = {
                    user: U,
                };
                this.miahootForm = this.formBuilder.group({
                    idEnseignant: new FormControl(U.id, Validators.required),
                    nom: new FormControl('name', Validators.required),
                    questions: this.formBuilder.array([])
                });
                return state;
            }),
            shareReplay(1)
        )
    }

    questions(): FormArray {
        return this.miahootForm.get('questions') as FormArray;
    }

    newQuestion(): FormGroup {
        this.creationSucces.next(false);
        return this.formBuilder.group({
            label: new FormControl('name', Validators.required),
            reponses: this.formBuilder.array([])
        });
    }

    addQuestion() {
        this.creationSucces.next(false);
        this.questions().push(this.newQuestion());
    }

    removeQuestion(index: number) {
        this.creationSucces.next(false);
        this.questions().removeAt(index);
    }

    questionReponses(index: number): FormArray {
        this.creationSucces.next(false);
        return this.questions()
            .at(index)
            .get('reponses') as FormArray;
    }

    newReponse(): FormGroup {
        this.creationSucces.next(false);
        return this.formBuilder.group({
            label: new FormControl('reponse', Validators.required),
            estValide: new FormControl(false),
        });
    }

    addQuestionReponse(index: number) {
        this.creationSucces.next(false);
        this.questionReponses(index).push(this.newReponse());
    }

    removeQuestionReponse(qIndex: number, rIndex: number) {
        this.creationSucces.next(false);
        this.questionReponses(qIndex).removeAt(rIndex);
    }

    async onSubmit() {
        try {
            const created = await this.MS.createQcm(this.miahootForm.value)
            this.toaster.success("CRÉATION REUSSIE : LE MIAHOOT A BIEN ÉTÉ CRÉÉ 😀")
        } catch (err) {
            this.toaster.error("CRÉATION ÉCHOUÉE : LE MIAHOOT N'A PAS PU ÊTRE CRÉÉ")
        }
    }
}
