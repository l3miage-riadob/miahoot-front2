import { ChangeDetectionStrategy, Component, Input, OnInit, OnChanges } from '@angular/core';
import { DataService, MiahootUser, Role } from '../data.service';
import { BehaviorSubject, Observable, lastValueFrom, map } from 'rxjs';
import {Qcm} from "../model/qcm";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RequestService } from '../request.service';
import {Question} from "../model/question";
import {Response} from "../model/response";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Principe de construction du composant:
 * Il y a une page avec des boutons (nom + id métier) des miahoots que cet enseignant à créer
 * Lorsque l'enseignant clique sur l'un des boutons, celà redirige vers ce composant detail en lui fournissant en
 * entrée l'id métier du bouton.
 * 
 * A l'initiation, ce composant va appeler la méthode getMiahootViaIdMetier() qui va récupérer dans la base de
 * donnée le miahoot en question et l'afficher
 * 
 * ATTENTION: Pour le moment le bouton présenté n'est relié à rien. Il faudra utiliser le qcm courant avec firebase
 * Il faudra change le type du qcmCourant quand on fera le branchement avec la page de l'enseignant ou il y a tous les miahoot
 */

export class DetailComponent {
  protected readonly Role = Role;
  miahootUserSubjectDansDetail: BehaviorSubject<MiahootUser | undefined> = new BehaviorSubject<MiahootUser | undefined>(undefined);
  qcmInDetail: Observable<Qcm | undefined> = new Observable(undefined);
  qcmForUpdateAndInit: Qcm = new Qcm('', []);
  idMetierMiahoot: string | null;
  miahootForm: FormGroup = new FormGroup({});
  isDelete: boolean = false;
  private disabled: boolean = true;
  url: string = 'http://129.88.210.80:8080/api/v0/miahoots/';

  constructor(private http: HttpClient, private data: DataService,
              private formBuilder : FormBuilder, private route: ActivatedRoute,
              private RS: RequestService) {
    this.miahootUserSubjectDansDetail = this.data.miahootUserBS;
    this.idMetierMiahoot = this.route.snapshot.paramMap.get('id');
    const TmpObs = this.get(this.url + this.idMetierMiahoot)
    this.get(this.url + this.idMetierMiahoot).subscribe( res => {
      if (res != undefined) {
        const r = res as Qcm
        this.miahootForm = this.formBuilder.group({
          idEnseignant: new FormControl(r.idEnseignant, Validators.required),
          nom: new FormControl(r.nom, Validators.required),
          questions: this.formBuilder.array([]) // r.questions.map( q => this.generateQuestion(q))
        });
        for(let i = 0; i < r.questions.length; i++) {
          this.addExistingQuestion(r.questions[i])
          for (let j = 0; j < r.questions[i].reponses.length; j++){
            this.addQuestionExistingReponse(i, r.questions[i].reponses[j])
          }
        }
      }
    })
    this.qcmInDetail = TmpObs;
  }

  existingQuestion(question : Question): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(question.label, Validators.required),
      reponses: this.formBuilder.array([])
    });
  }

  existingResponse(response : Response): FormGroup {
    return this.formBuilder.group({
      label: new FormControl(response.label, Validators.required),
      estValide: new FormControl(response.estValide),
    });
  }

  // ajoute une question existante dans la liste des questions
  addExistingQuestion(question : Question) {
    this.questions().push(this.existingQuestion(question));
  }

  // ajoute une reponse existante dans la liste des reponses
  addQuestionExistingReponse(index: number, response : Response) {
    this.questionReponses(index).push(this.existingResponse(response));
  }

  // requete pour récupérer un miahoot
  get(url: string): Observable<any | undefined> {
    return this.RS.get(url);
  }

  // requete pour supprimer un miahoot
  delete(): Observable<any | undefined> {
    return this.RS.delete(this.url + "/" + this.idMetierMiahoot);
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

  onSubmit() {
    console.log(this.miahootForm.value);
    this.qcmForUpdateAndInit = this.miahootForm.value;
    console.log(this.qcmForUpdateAndInit);
    this.RS.update(this.url + this.qcmForUpdateAndInit.idMetier, this.qcmForUpdateAndInit);
  }

  refreshPage() {
    window.location.reload();
  }

  isDisabled(): boolean {
    return this.disabled;
  }

  enableEditing(): void {
    this.disabled = !this.disabled;
  }

}