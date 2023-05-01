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
export class QuestionnaireService {
  readonly obsQCMProjectedMiahoot: Observable<undefined|QCMProjected>;

  constructor(private ds: DataService, private fs : Firestore, auth:Auth) { // Pas besoin du @Inject(Auth) normalement a pourtant quand je le met pas le compilateur rale ^^
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
    const obsProjectedMiahootID: Observable<string | undefined> = ds.miahootUser.pipe(
      map( U => U?.projectedMiahoot ) 
    );

    // 2) On dérive obsProjectedMiahootID. 
    //    Si il est définit, c'est la référence à un document Firestore de la collection projectedMiahoots
    //    J'ai créé cette collection dans votre Firestore, vous pouvez allez voir. ok je regarde C'est bon je la voit 
    


    // d'accord 
    // et donc pour firebase le projectedMiahoots ça veut dire que l'utilisateur il a une référence vers le projectedMiahoot 
    // qui est une collection avec un qcm courant currentQCM et le nom du miahoot qui va avec (title) ? 
    // Oui les participants auront la référence au projectedMiahoot.
    const obsProjectedMiahoot: Observable<undefined | ProjectedMiahoot> = obsProjectedMiahootID.pipe(
      switchMap( id => {
        if (id == undefined){
          return of(undefined);
        } else {
          const docProjectedMiahoot = doc(fs, `projectedMiahoots/${id}`).withConverter(ProjectedMiahootConverter);
          return docData(docProjectedMiahoot);
        }
      })
    );

    // Bon ensuite :
    //    Vous faites une sous collection de QCM dans chaque projectedMiahoot
    //    ça contiendra les QCM à projeter
    //    le currentQCM référencera le QCM courant dans cette sous collection.$ d'accord 

    
    
    // ca c'est bon on arrive a récupérer le bon miahoot on a juste pas organiser le firebase comme vous
    // Attention vous avez un chemin codé en dur dans le code, ça ne passera pas pour
    // plusieurs utilisateurs/présentateurs
    // Il faudra me mettre en contributeur du projet pour que j'y ai accès : alxdmr2@gmail.com 
    
    this.obsQCMProjectedMiahoot= authState(auth).pipe(
      switchMap( (QCM: User | null) => { // Votre paramètre QCM est de type User | null
        if (QCM == null){
          return of(undefined);
        }
        else {
          // Pourquoi coder en dur l'identifiant ?
          const docProjectedMiahoot = doc (fs,'Question_Current/Ys9lF6rORzsXN8xmZeiV').withConverter(FsQCMProjectedConverter);
          console.log("docProjectedMiahoot");
          console.log(docProjectedMiahoot);
          return docData(docProjectedMiahoot);  
        }
      })
    )
    this.obsQCMProjectedMiahoot.subscribe(
      QCM => {
        console.log("QCM");
        console.log(QCM?.question);
      }
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
