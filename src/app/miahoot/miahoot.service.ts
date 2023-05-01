import { Inject, Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { FirestoreDataConverter, doc } from 'firebase/firestore';
import {Observable, of, map, switchMap} from 'rxjs' ;
import { DataService } from '../data.service';

export interface Student {
  readonly id : string;
  readonly name : string;
}

export interface Question {
  readonly id : string;
  readonly question : string;
  readonly choix : readonly string []
}

export interface Response {
  readonly student: Student
  readonly question: Question;
  readonly responses : readonly string []
}

export interface QCMProjected{
  readonly id : string;
  readonly createur : string;
  readonly question : string;
  readonly choix : string[];
}

// Définir ici ce qu'est un Miahoot en cours de projection 
export interface ProjectedMiahoot {
  readonly title: string;
  readonly currentQCM: string; // Identifiant du QCM courant dans la sous collection QCM
}
//convertiseur de projectedMiahoot
export const ProjectedMiahootConverter: FirestoreDataConverter<ProjectedMiahoot> = {
  toFirestore: M => M,
  fromFirestore: snap =>({
    title: snap.get("title")           ?? "Error pas de titre ????",
    currentQCM: snap.get("currentQCM") ?? "Error pas de currentQCM ????"
  })
}

//convertiseur de QCMProjected
export const FsQCMProjectedConverter: FirestoreDataConverter<QCMProjected> = {
  toFirestore: M => M,
  fromFirestore: snap =>({
    id: snap.id,
    createur: snap.get("Createur"),
    question: snap.get("Question"),
    choix: snap.get("Choix")
  })
}

@Injectable({
  providedIn: 'root'
})
export class MiahootService {
  readonly obsProjectedMiahootID: Observable<undefined|string>;
  readonly obsProjectedQCM: Observable<undefined|QCMProjected>;
  readonly obsProjectedMiahoot: Observable<undefined|ProjectedMiahoot>;
  miahootID: string = "";
  constructor(private dataService: DataService, private firestore : Firestore, auth: Auth) { // Pas besoin du @Inject(Auth) normalement a pourtant quand je le met pas le compilateur rale ^^
    /**
     * 1) Faire un observable qui dérive l'observable de l'utilisateur courant : ds.miahootUser
     *    et qui renvoie un observable de projectedMiahoot, ce dernier étant une string
     *    identifiant un document dans la collection Firestore des Miahoot.
     *    => Vos utilisateurs doivent avoir un attribut optionnel projectedMiahoot de type string.
     *    Il faut donc mettre à jour la définition d'un utilisateur.
     * pourquoi?
     *    Ca permet de savoir si un présentateur est en train de projeté un Miahoot et lequel
     *    On imagine que plusieurs présentateur présenteront des Miahoot en même temps
     *    à travers le monde.
     * 
     *   
     * 
     * Je dois vous laisser, essayer de voir comment faire avec ça
     * Modélisez petit à petit et essayez de synchroniser entre plusieurs clients déjà
     * en affichant par exemple juste le titre du Miahoot projetté et l'identifiant de QCM courant
     * VOus pourrez remplir ensuite les collections petit à petit pour voir ce que ça donne
     * Puis on pourra refaire un point pour voir comment gérer les votes.
     * 
     * 
     * on pourra voir plus tard pour réexpliquer les map dans les réponses (ce que vous avez montré en TD IHM cette semaine)
     * le type map dans firebase j'ai pas trop compris comment ça marche  oui ah ok c'était pas pour stocker les réponses des participants ?
     * Ha oui les map dans Firestore ok, on devrait pouvoir faire sans ça au pire.
     * je file, bon courage.
     *  
     * 
     * ok bonne soirée 
     * 
     * 2) Faire un observable qui dérive l'observable de projectedMiahoot et qui renvoie
     *    un observable du document Firestore encodant le projectedMiahoot.
     */ 
    this.obsProjectedMiahootID = dataService.miahootUser.pipe(
      map( U => U?.projectedMiahoot ) 
    );

    this.obsProjectedMiahoot = this.obsProjectedMiahootID.pipe(
        switchMap( id => {
        if (id == undefined){
          return of(undefined);
        } else {
          const docProjectedMiahoot = doc(firestore, `projectedMiahoots/${id}`).withConverter(ProjectedMiahootConverter);
          return docData(docProjectedMiahoot);
        }
      })
    );
    this.obsProjectedQCM = this.obsProjectedMiahoot.pipe(
        map( M => M?.currentQCM ),
        switchMap( id => {
          if (id == undefined){
            return of(undefined);
          } else {
            const docQCM = doc(firestore, `projectedMiahoots/${this.miahootID}/QCMs/${id}`).withConverter(FsQCMProjectedConverter);
            return docData(docQCM);
          }
        })
    )
  }



  async getStudentsResponses (): Promise<readonly Response[]> {
    const [students,questions] = await  Promise.all(
        [
            Promise.all( ( await  this.getStudentsID () ).map( id => this.getStudent (id) ) ),
            Promise.all( ( await  this.getQuestionsID() ).map( id => this.getQuestion(id) ) )
        ]
    );
    const L:Promise<Response>[] = students.map(
        student => questions.map( question => this.getStudentResponse(student,question) )
    ).reduce(
        (L, responses) => [...L,...responses],[]
    );

    return Promise.all(L)
  }

  async getStudentResponse(student: Student, question: Question): Promise<Response> {
    return {student, question, responses:[]}
  }

  async getStudentsID(): Promise<readonly string[]> {
    return  [];
  }

  async getStudent(id: string) : Promise<Student> {
    return {id: "1", name : "studentTest"};
  }

  async getQuestion(id:String): Promise<Question> {
    return {id: "1",question: "", choix :[]};
  }

  async getQuestionsID(): Promise<readonly string[]>{
    return []
  }
}
