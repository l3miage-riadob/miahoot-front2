import { Firestore, FirestoreDataConverter, QueryDocumentSnapshot, doc, getDoc, setDoc, collection, query, getDocs } from '@angular/fire/firestore';
import { Qcm } from "./model/qcm";
import { Injectable } from '@angular/core';
import {DataService} from "./data.service";
import {BehaviorSubject, Observable} from "rxjs";

export interface ProjectedMiahoot {
    title: string,
    idEnseignant: string,
    idMetier: string,
    currentQCM: string,
    isStarted: boolean
}

export interface HistoriqueProjectedMiahoot {
    title: string,
    idEnseignant: string,
    idMetier: string,
    currentQCM: string,
    nbParticipant: number,
    nbVotesCurrentQCM: number
    tabCurrentRep: number[]
}

interface Questions {
    label: string
    reponses : string[]
}

interface Reponses {
    label: string
    estValide: boolean
}


const historiqueProjectedMiahootConverter: FirestoreDataConverter<HistoriqueProjectedMiahoot> = {
    toFirestore: (data: HistoriqueProjectedMiahoot) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        snap.data() as HistoriqueProjectedMiahoot
}


const projectedMiahootConverter: FirestoreDataConverter<ProjectedMiahoot> = {
    toFirestore: (data: ProjectedMiahoot) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
      snap.data() as ProjectedMiahoot
}

const questionConverter: FirestoreDataConverter<Questions> = {
    toFirestore: (data: Questions) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
      snap.data() as Questions
}

const reponsesConverter: FirestoreDataConverter<Reponses> = {
    toFirestore: (data: Reponses) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
      snap.data() as Reponses
}


@Injectable({
    providedIn: 'root'
  })
export class FirestoreService {

    constructor(private firestore: Firestore, private data: DataService) {
    }

    public async getProjectedMiahootsIDs(): Promise<string[]> {
        try {
          const q = query(collection(this.firestore, `projectedMiahoots` ));
          const querySnapshot = await getDocs(q);
      
          return querySnapshot.docs.map(doc => doc.id);
        } catch(error) {
          throw "getQCMsIDs() : Erreur lors de la recupération des ids sur firebase"
        }
      } 

    async addProjectedMiahoot(qcm: Qcm) {

        const docQcm = doc(this.firestore, `projectedMiahoots/${qcm.idMetier}`).withConverter(projectedMiahootConverter);
        const snapQcm = await getDoc(docQcm);
        if (!snapQcm.exists()) {
            setDoc(docQcm, {
                title: qcm.nom,
                idEnseignant: qcm.idEnseignant ?? "",
                idMetier: qcm.idMetier ?? "",
                currentQCM: "1",
                isStarted: false,
            } satisfies ProjectedMiahoot)

            qcm.questions.map(async (question, i) => {
                const docQuestion = doc(this.firestore, `projectedMiahoots/${qcm.idMetier}/QCMs/${i + 1}`).withConverter(questionConverter);
                const snapQuestion = await getDoc(docQuestion).then(
                    async () => {
                        setDoc(docQuestion, {
                            label: question.label,
                            reponses: question.reponses.map((reponse, j) => reponse.label),
                        } satisfies Questions)
                    }
                );
            })
        }

        const docHisto = doc(this.firestore, `historiqueProjectedMiahoots/${qcm.idMetier}`).withConverter(historiqueProjectedMiahootConverter);
        const snapHisto = await getDoc(docHisto);
        if (!snapQcm.exists()) {
            setDoc(docHisto, {
                title: qcm.nom,
                idEnseignant: qcm.idEnseignant ?? "",
                idMetier: qcm.idMetier ?? "",
                currentQCM: "1",
                nbParticipant: 0,
                nbVotesCurrentQCM: 0,
                tabCurrentRep: [],
            } satisfies HistoriqueProjectedMiahoot)

            qcm.questions.map(async (question, i) => {
                const docQuestion = doc(this.firestore, `historiqueProjectedMiahoots/${qcm.idMetier}/QCMs/${i + 1}`).withConverter(questionConverter);
                const snapQuestion = await getDoc(docQuestion).then(
                    async () => {
                        setDoc(docQuestion, {
                            label: question.label,
                            reponses: question.reponses.map((reponse, j) => reponse.label),
                        } satisfies Questions)
                    }
                );
            })
        }



    }
}
            /*
                console.log(`print 1`)
                if (!snapQuestion.exists()) {
                    console.log(`print 2`)
                    setDoc(docQuestion, {
                        label: question.label,
                        reponses: question.reponses.map((reponse, j) => reponse.label),
                    } satisfies Questions)
                }
                const docReponseProjete = doc(this.firestore, `projectedMiahoots/${qcm.idMetier}/QCMs/${i + 1}/Reponse/${i+1}`).withConverter(projecteReponseConverter);
                const snapReponseProjete = await getDoc(docReponseProjete);
                console.log(`print 3`)
                if (snapReponseProjete.exists()) {
                    console.log(`print 4`)
                    setDoc(docReponseProjete, {
                        name: 'aaa',
                        projectedRep: [false]
                    } satisfies ProjectedReponse)
                }
            })
        }*/

            /*
                question.reponses.map ( async (reponse, j) => {
                    const docReponse = doc(this.firestore, `projectedMiahoots/${qcm.idMetier}/QCMs/${i+1}/Reponse/${j+1}`);
                    const snapReponse = await getDoc(docReponse);
                    if (!snapReponse.exists()) {
                        setDoc(docReponse, {
                            label: reponse.label,
                            estValide: reponse.estValide
                        } satisfies Reponses)
                    }
                })
        */
                // voir plus tard pour rajouter estValide si besoin
                // reponses: question.reponses.map( (reponse, j) => {
                //     return {
                //         label: reponse.label,
                //         estValide: reponse.estValide
                //     }
                // }, [])


                // question.reponses.map ( async (reponse, j) => {
                //     const docReponse = doc(this.firestore, `projectedMiahoots/${qcm.idMetier}/QCMs/${i+1}/Reponse/${j+1}`);
                //     const snapReponse = await getDoc(docReponse);
                //     if (!snapReponse.exists()) {
                //         setDoc(docReponse, {
                //             label: reponse.label,
                //             estValide: reponse.estValide
                //         } satisfies Reponses)
                //     }
                // })
