import { Inject, Injectable } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import {Firestore, docData, collection, getDoc, query, where, getDocs, updateDoc} from '@angular/fire/firestore';
import { FirestoreDataConverter, doc } from 'firebase/firestore';
import {Observable, of, map, switchMap, BehaviorSubject} from 'rxjs' ;
import { DataService } from '../data.service';
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {firebaseApp$} from "@angular/fire/app";

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
  currentQCM: string; // Identifiant du QCM courant dans la sous collection QCM
}
//convertiseur de projectedMiahoot
// QCMs est une sous collection de projectedMiahoot
export const ProjectedMiahootConverter: FirestoreDataConverter<ProjectedMiahoot> = {
  toFirestore: M => M,
  fromFirestore: snap =>({
    title: snap.get("title")           ?? "Error pas de titre ????",
    currentQCM: snap.get("currentQCM") ?? "Error pas de currentQCM ????",
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
  readonly obsProjectedMiahootID: BehaviorSubject<undefined|string> = new BehaviorSubject<undefined|string>(undefined);
  readonly obsProjectedQCM: BehaviorSubject<undefined|QCMProjected> = new BehaviorSubject<undefined|QCMProjected>(undefined);
  readonly obsProjectedMiahoot: BehaviorSubject<undefined|ProjectedMiahoot> = new BehaviorSubject<undefined|ProjectedMiahoot>(undefined);
  ProjectedQCMsIDs : string[] = [];
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

      // on récupère l'id du miahoot projeté dans le champ projectedMiahoot de l'utilisateur
      dataService.miahootUser.pipe(
          map(U => U?.projectedMiahoot)
      ).subscribe(this.obsProjectedMiahootID);

      // on récupère le projectedMiahoot à partir de son id
      this.obsProjectedMiahootID.pipe(
          switchMap(id => {
              if (id == undefined && id != "") {
                  return of(undefined);
              } else {
                  this.miahootID = id?.trim() ?? "";
                  // instancier ProjectedQCMsIDs avec les id des QCMs du Miahoot projeté
                  this.getQCMsIDs().then(ids => this.ProjectedQCMsIDs.push(...ids));
                  const docProjectedMiahoot = doc(firestore, `projectedMiahoots/${id?.trim()}`).withConverter(ProjectedMiahootConverter);
                  return docData(docProjectedMiahoot);
              }
          })
      ).subscribe(this.obsProjectedMiahoot);

      // on récupère le QCM courant dans le projectedMiahoot à partir de son id contenu dans currentQCM
      this.obsProjectedMiahoot.pipe(
          map(M => M?.currentQCM),
          switchMap(id => {
              if (id == undefined) {
                  return of(undefined);
              } else {
                  const docQCM = doc(firestore, `projectedMiahoots/${this.miahootID}/QCMs/${id}`).withConverter(FsQCMProjectedConverter);
                  return docData(docQCM);
              }
          })
      ).subscribe(this.obsProjectedQCM);


  }

  public async getQCMsIDs(): Promise<string[]> {
      const q = query(collection(this.firestore, `projectedMiahoots/${this.miahootID}/QCMs` ));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.id);
  }

  // update le QCM courant dans le projectedMiahoot sur firebase
    public async updateCurrentQCM(id: string){
        const docRef = doc(this.firestore, `projectedMiahoots/${this.miahootID}`);
        await updateDoc(docRef, {currentQCM: id});
    }

  public async setNextQuestion(miahootObs : BehaviorSubject<undefined|ProjectedMiahoot>){
      // on instancie projectedQCMsIDs avec les id du Miahoot projetés
      //this.getQCMsIDs().then(ids => this.ProjectedQCMsIDs.push(...ids));
      this.ProjectedQCMsIDs = await this.getQCMsIDs();
      // on récupère le projectedMiahoot : le titre et le QCM courant
      let projectedMiahoot = this.obsProjectedMiahoot.value;
        // on récupère les ids des QCMs
      let QCMs = this.ProjectedQCMsIDs;
      console.log("QCMs", QCMs);
      // on récupère l'index du QCM courant
      let index = QCMs.indexOf(projectedMiahoot!.currentQCM);
      console.log("index avant de changer de question :", index);
        if(index == QCMs.length-1){
            // projectedMiahoot!.currentQCM = QCMs[0];
            console.log("OH c'est déjà la fin du miahoot ? ");
            // on reset le currentQCM à la première question
            projectedMiahoot!.currentQCM = QCMs[0];
            await this.updateCurrentQCM(projectedMiahoot!.currentQCM)
            this.obsProjectedMiahoot.next(projectedMiahoot);
            miahootObs.next(projectedMiahoot);

        } else {
            projectedMiahoot!.currentQCM = QCMs[index+1];
            await this.updateCurrentQCM(projectedMiahoot!.currentQCM)
            this.obsProjectedMiahoot.next(projectedMiahoot);
            miahootObs.next(projectedMiahoot);


        }
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
