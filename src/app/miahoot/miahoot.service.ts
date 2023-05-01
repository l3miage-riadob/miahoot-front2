import { Inject, Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, docData } from '@angular/fire/firestore';
import { FirestoreDataConverter, doc } from 'firebase/firestore';
import {Observable, of, map, switchMap} from 'rxjs' ;
import { DataService } from '../data.service';
import {coerceBooleanProperty} from "@angular/cdk/coercion";

export interface Question {
  readonly id : string;
  readonly question : string;
  readonly choix : readonly string []
}

export interface Response {
  readonly question: Question;
  readonly responses : readonly string []
}

export interface QCMProjected{
  readonly question : string;
  readonly reponses : string []
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
    question: snap.get("question"),
    reponses: snap.get("reponses")
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
     * Modélisez petit à petit et essayez de synchroniser entre plusieurs clients déjà
     * en affichant par exemple juste le titre du Miahoot projetté et l'identifiant de QCM courant
     * VOus pourrez remplir ensuite les collections petit à petit pour voir ce que ça donne
     * Puis on pourra refaire un point pour voir comment gérer les votes.
     *
     *
     * 2) Faire un observable qui dérive l'observable de projectedMiahoot et qui renvoie
     *    un observable du document Firestore encodant le projectedMiahoot.
     */ 
    this.obsProjectedMiahootID = dataService.miahootUser.pipe(
      map( U => U?.projectedMiahoot )
    );
    this.obsProjectedMiahoot = this.obsProjectedMiahootID.pipe(
        switchMap( id => {
        if (id == undefined && id != ""){
          return of(undefined);
        } else {
          // TODO : voir le problème d'espace dans l'id
          this.miahootID = id?.trim() ?? "";
          const docProjectedMiahoot = doc(firestore, `projectedMiahoots/${id?.trim()}`).withConverter(ProjectedMiahootConverter);
          return docData(docProjectedMiahoot);
        }
      })
    );
    this.obsProjectedQCM = this.obsProjectedMiahoot.pipe(
        map( M => M?.currentQCM ),
        switchMap( id => {
          if (id == undefined){
            console.log("id undefined");
            return of(undefined);
          } else {
            const docQCM = doc(firestore, `projectedMiahoots/${this.miahootID}/QCMs/${id}`).withConverter(FsQCMProjectedConverter);
            console.log("id defined");
            console.log(id);
            console.log(`projectedMiahoots/${this.miahootID}/QCMs/${id}`)
            return docData(docQCM);
          }
        })
    )
  }

  async getStudentsID(): Promise<readonly string[]> {
    return  [];
  }

  async getQuestion(id:String): Promise<Question> {
    return {id: "1",question: "", choix :[]};
  }

  async getQuestionsID(): Promise<readonly string[]>{
    return []
  }
}
