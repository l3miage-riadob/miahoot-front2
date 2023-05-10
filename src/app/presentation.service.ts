import {Injectable} from '@angular/core';
import {
    Firestore,
    docData,
    collection,
    getDoc,
    query,
    where,
    getDocs,
    updateDoc,
    setDoc, QueryDocumentSnapshot, arrayUnion
} from '@angular/fire/firestore';
import {FirestoreDataConverter, doc} from 'firebase/firestore';
import {Observable, of, map, switchMap, BehaviorSubject} from 'rxjs' ;
import {DataService, MiahootUser} from './data.service';
import {HistoriqueProjectedMiahoot, ProjectedMiahoot} from "./firestore.service";


export interface Question {
    readonly id: string;
    readonly question: string;
    readonly choix: readonly string []
}


export interface ProjectedQCM {
    readonly question: string;
    readonly reponses: string [];
}

export interface Resultats {
    nbReponses: number
    reponsesQuestionCourante: number[]

}

interface ProjectedReponse {
    reponses: boolean[]
}

export interface HistoRepQcm {
    tabReponses: number[]
}

export const ProjectedMiahootConverter: FirestoreDataConverter<ProjectedMiahoot> = {

    toFirestore: M => M,
    fromFirestore: snap => ({
        title: snap.get("title") ?? "Error pas de titre ????",
        idEnseignant: snap.get("idEnseignant") ?? "Error pas d'idEnseignant ????",
        idMetier: snap.get("idMetier") ?? "Error pas d'idMetier ????",
        currentQCM: snap.get("currentQCM") ?? "Error pas de currentQCM ????",
        isStarted: snap.get("isStarted") ?? "Error pas d'idStarted ????",
    })
}

export const HistoriqueProjectedMiahootConverter: FirestoreDataConverter<HistoriqueProjectedMiahoot> = {

    toFirestore: M => M,
    fromFirestore: snap => ({
        title: snap.get("title") ?? "Error pas de titre ????",
        idEnseignant: snap.get("idEnseignant") ?? "Error pas d'idEnseignant ????",
        idMetier: snap.get("idMetier") ?? "Error pas d'idMetier ????",
        currentQCM: snap.get("currentQCM") ?? "Error pas de currentQCM ????",
        nbParticipant: snap.get("nbParticipant") ?? "Error pas de nbParticipant ????",
        nbVotesCurrentQCM: snap.get("nbVotesCurrentQCM") ?? "Error pas de nbVotesCurrentQCM ????",
        tabCurrentRep: snap.get("tabCurrentRep") ?? "Error pas de tabCurrentRep ????",
    })
}

export const HistoriqueRepQcmConverter: FirestoreDataConverter<HistoRepQcm> = {

    toFirestore: M => M,
    fromFirestore: snap => ({
        tabReponses: snap.get("tabReponses") ?? "Error pas de tabReponses ????",
    })
}

//convertiseur de QCMProjected
export const FsQCMProjectedConverter: FirestoreDataConverter<ProjectedQCM> = {
    toFirestore: M => M,
    fromFirestore: snap => ({
        question: snap.get("label"),
        reponses: snap.get("reponses"),
    })
}

const HistoRepQcmConverter: FirestoreDataConverter<HistoRepQcm> = {
    toFirestore: (data: HistoRepQcm) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        snap.data() as HistoRepQcm
}


const projecteReponseConverter: FirestoreDataConverter<ProjectedReponse> = {
    toFirestore: (data: ProjectedReponse) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        snap.data() as ProjectedReponse
}

const historiqueProjectedMiahootConverter: FirestoreDataConverter<HistoriqueProjectedMiahoot> = {
    toFirestore: (data: HistoriqueProjectedMiahoot) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        snap.data() as HistoriqueProjectedMiahoot
}

const miahootConverter: FirestoreDataConverter<MiahootUser> = {
    toFirestore: (data: MiahootUser) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        snap.data() as MiahootUser
}


@Injectable({
    providedIn: 'root'
})
export class PresentationService {

    readonly BSProjectedMiahootID: BehaviorSubject<undefined | string> = new BehaviorSubject<undefined | string>(undefined);
    readonly ObsProjectedMiahootID = this.BSProjectedMiahootID.asObservable();
    readonly BSProjectedQCM: BehaviorSubject<undefined | ProjectedQCM> = new BehaviorSubject<undefined | ProjectedQCM>(undefined);
    readonly ObsProjectedQCM = this.BSProjectedQCM.asObservable();
    readonly BSProjectedMiahoot: BehaviorSubject<undefined | ProjectedMiahoot> = new BehaviorSubject<undefined | ProjectedMiahoot>(undefined);
    readonly ObsProjectedMiahoot = this.BSProjectedMiahoot.asObservable();
    ProjectedQCMsIDs: string[] = [];
    miahootIDProjected: string = "";
    idPresentateur: string = "";

    /* Ca va commencer à en faire pas mal des observables */
    private BSHistorique: BehaviorSubject<HistoriqueProjectedMiahoot | undefined> = new BehaviorSubject<HistoriqueProjectedMiahoot | undefined>(undefined)
    ObsHistorique: Observable<HistoriqueProjectedMiahoot | undefined> = this.BSHistorique.asObservable()

    private BSHistoRepQcm: BehaviorSubject<HistoRepQcm[][] | undefined> = new BehaviorSubject<HistoRepQcm[][] | undefined>(undefined);
    ObsHistoRepQcm: Observable<HistoRepQcm[][] | undefined> = this.BSHistoRepQcm.asObservable()

    constructor(private dataService: DataService, private firestore: Firestore) { // Pas besoin du @Inject(Auth) normalement a pourtant quand je le met pas le compilateur rale ^^
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
        // on récupère l'id du presentation projeté dans le champ projectedMiahoot de l'utilisateur
        dataService.miahootUserObs.pipe(
            map(U => {
                console.log(`Alors l'id du projected miahoot = ${U?.projectedMiahoot}`)
                this.idPresentateur = U?.id!
                return U?.projectedMiahoot
            })
        ).subscribe(this.BSProjectedMiahootID);

        // on récupère le projectedMiahoot à partir de son id
        this.BSProjectedMiahootID.pipe(
            switchMap(id => {
                if (id === undefined && id !== "") {
                    return of(undefined);
                } else {
                    this.miahootIDProjected = id;
                    this.getQCMsIDs().then(ids => this.ProjectedQCMsIDs.push(...ids));
                    const docProjectedMiahoot = doc(firestore, `projectedMiahoots/${id}`).withConverter(ProjectedMiahootConverter);
                    return docData(docProjectedMiahoot);
                }
            })
        ).subscribe(this.BSProjectedMiahoot);

        // on récupère le QCM courant dans le projectedMiahoot à partir de son id contenu dans currentQCM
        this.BSProjectedMiahoot.pipe(
            map(M => M?.currentQCM),
            switchMap(id => {
                if (id == undefined) {
                    return of(undefined);
                } else {
                    const docQCM = doc(firestore, `projectedMiahoots/${this.miahootIDProjected}/QCMs/${id}`).withConverter(FsQCMProjectedConverter);
                    return docData(docQCM);
                }
            })
        ).subscribe(this.BSProjectedQCM);

        /**
         * Setup de l'observable sur l'historique
         */

        this.BSProjectedMiahootID.pipe(
            switchMap(id => {
                if (id === undefined && id !== "") {
                    return of(undefined);
                } else {
                    const docHistoProjectedMiahoot = doc(firestore, `historiqueProjectedMiahoots/${this.miahootIDProjected}`).withConverter(HistoriqueProjectedMiahootConverter);
                    return docData(docHistoProjectedMiahoot)
                }
            })
        ).subscribe(this.BSHistorique);

        //const docHistoProjectedMiahoot = doc(firestore, `historiqueProjectedMiahoots/${this.miahootIDProjected}`).withConverter(HistoriqueProjectedMiahootConverter);
        //docData(docHistoProjectedMiahoot).subscribe(this.BSHistorique);

    }

    public async getQCMsIDs(): Promise<string[]> {
        const q = query(collection(this.firestore, `projectedMiahoots/${this.miahootIDProjected}/QCMs`));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.id);
    }

    // update le QCM courant dans le projectedMiahoot sur firebase
    public async updateCurrentQCM(id: string) {
        const docRef = doc(this.firestore, `projectedMiahoots/${this.miahootIDProjected}`);
        await updateDoc(docRef, {currentQCM: id});

    }

    /* PASSER A LA QUESTION SUIVANTE
     on récupère le Miahoot projeté soit le titre et le QCM courant
     on récupère les ids des QCMs du Miahoot projeté
     on récupère l'index du QCM courant dans le tableau des ids
     si l'index est le dernier du tableau, donc c'est la dernière question du Miahoot projeté
        alors on reset le current QCM avec la valeur de l'id du premier QCM
     sinon,
        on incrémente l'index et on récupère l'id du QCM suivant
     puis
     on update le current QCM dans le Miahoot projeté de firebase
     on met à jour l'observable du Miahoot projeté
     on met à jour l'observable du QCM projeté
     */
    public async setNextQuestion() {
        const a = await this.addAllReponses();

        let projectedMiahoot = this.BSProjectedMiahoot.value!;
        let QCMs = this.ProjectedQCMsIDs;
        let index = QCMs.indexOf(projectedMiahoot!.currentQCM);

        if (index == QCMs.length - 1) {
            projectedMiahoot!.currentQCM = QCMs[0];
        } else {
            projectedMiahoot!.currentQCM = QCMs[index + 1];
        }

        await this.updateCurrentQCM(projectedMiahoot!.currentQCM)
        this.BSProjectedMiahoot.next(projectedMiahoot);

    }

    /**
     *         this.BSProjectedMiahootID.pipe(
     *             switchMap(id => {
     *                 if (id === undefined && id !== "") {
     *                     return of(undefined);
     *                 } else {
     *                     const docHistoRepQcmProjectedMiahoot = doc(firestore, `historiqueProjectedMiahoots/${this.miahootIDProjected}/allReponses`).withConverter(HistoriqueRepQcmConverter);
     *                     return docData(docHistoRepQcmProjectedMiahoot)
     *                 }
     *             })
     *         ).subscribe(this.BSHistoRepQcm);
     */

    public async endQcm() {
        const a = await this.addAllReponses();
    }

    //publie les réponse de l'utilisateur sur fireBase
    /**
     * Ca risque d'être lourd comme fonction mais à chaque fois que cette méthode est appelée il faut actualiser l'observable
     * qui va compter le nombre de réponse et celui qui possède les résultats
     *
     * const docReponseProjete = doc(this.firestore, `projectedMiahoots/${qcm.idMetier}/QCMs/${i + 1}/Reponse/${i + 1}`).withConverter(projecteReponseConverter);
     *                         const snapReponseProjete = await getDoc(docReponseProjete).then(
     *                             () =>
     *                             setDoc(docReponseProjete, {
     *                                 projectedRep: []
     *                             } satisfies ProjectedReponse)
     *                         )
     *
     */
    public async updateReponses(reponses: boolean[]) {
        this.dataService.miahootUserObs.pipe(
            map(U => U?.name)
        ).subscribe(async(nom: string | undefined) => {
            // Utilisez la valeur de `name` ici
            if (nom != undefined) {
                const path = `historiqueProjectedMiahoots/${this.miahootIDProjected}/QCMs/${this.BSProjectedMiahoot.value?.currentQCM}/ProjectedReponse/${nom}`;
                const docRef =
                    doc(this.firestore, path);
                const snapRep = await getDoc(docRef)
                if (snapRep.exists()) {
                    updateDoc(docRef, {
                        reponses: reponses
                    })
                } else {
                    console.log("BOB EST LA")
                    const docRefRep = doc(this.firestore, path);
                    const snapRefRep = await getDoc(docRefRep).then(
                        async () => {
                            setDoc(docRefRep, {
                                reponses: reponses,
                            } satisfies ProjectedReponse)
                        }
                    );
                }
            }

            await this.refreshReponsesQuestionCourante()

            console.log('Alors qui voilà')
            const docHistorique = doc(this.firestore, `historiqueProjectedMiahoots/${this.miahootIDProjected}`).withConverter(HistoriqueProjectedMiahootConverter);
            const a = docData(docHistorique)
            let bob: HistoriqueProjectedMiahoot | undefined = undefined;
            a.pipe(
                map( value => {
                    console.log("Valeur de value =", value)
                    bob = value
                })
            )
            console.log('Print de la valeur de bob = ', bob)
            this.BSHistorique.next(bob)
        })
    }

    /**
     * Méthode qui permet de calculer le nombre de joueur qui participe au miahoot courant du présentateur
     * Pour celà on récupère la collection de tous les utilisateurs sur firestore
     * Puis on incrémente une variable V si l'id projectedMiahoot du user est celui du miahoot projeté
     * Enfin on actualise l'attribut sur firebase nbParticipant avec la valeur de V
     */
    public async refreshNbParticipants(): Promise<void> {
        const querySnapshot = await getDocs(collection(this.firestore, `user`))
        let nbParticipants = 0;
        console.log("Id presentateur dans refresh participant = ", this.idPresentateur)
        querySnapshot.forEach((doc) => {
            let data = doc.data() as MiahootUser
            if (data.projectedMiahoot === this.miahootIDProjected && data.id !== this.idPresentateur) {
                nbParticipants++
            }
        })
        console.log(`Nb participants = ${nbParticipants}`)
        const docRef = doc(this.firestore, `projectedMiahoots/${this.miahootIDProjected}`);
        const a = await updateDoc(docRef, {
            nbParticipant: nbParticipants
        })

    }

    /**
     * Méthode pour le bouton démarrer dans le composant gameroom seulement visible par le présentateur
     * Permet de démarrer l'affichage des questions
     *
     */
    public async startQcm() {
        console.log("id du présentateur = ", this.idPresentateur)
        const docRef = doc(this.firestore, `projectedMiahoots/${this.miahootIDProjected}`);
        await updateDoc(docRef, {
            isStarted: true
        });

    }

    /**
     * Permet de mettre à jour le nombre de votant ainsi que le choix des votes
     */
    public async refreshReponsesQuestionCourante() {
        const path = `historiqueProjectedMiahoots/${this.miahootIDProjected}/QCMs/${this.BSProjectedMiahoot.value?.currentQCM}/ProjectedReponse`;
        try {
            const querySnapshot = await getDocs(collection(this.firestore, path))
            let nbVotes = 0;

            let tmpTabReponses: boolean[][] = []
            querySnapshot.forEach((doc) => {
                let data = doc.data() as ProjectedReponse
                tmpTabReponses.push(data.reponses)
                nbVotes++
            })
            console.log(`Nb votes = ${nbVotes}`)

            let tabReponses: number[] = []
            tmpTabReponses[0].forEach( () => tabReponses.push(0)); // On appel cette méthode après que quelqu'un ai voté donc ce tableau ne sera jamais vide

            tmpTabReponses.forEach( tableau =>
                tableau.map( (element, i) => {
                    if (element) {
                        tabReponses[i] = tabReponses[i] + 1;
                    }
                })
            )
            console.log(`Compteur de réponse = ${tabReponses}`)
            const docRef = doc(this.firestore, `historiqueProjectedMiahoots/${this.miahootIDProjected}`);
            const a = await updateDoc(docRef, {
                nbVotesCurrentQCM: nbVotes,
                tabCurrentRep: tabReponses
            })
        } catch (err) {

            console.log("Aucune collection ProjectedReponse trouvé dans firebase lors de l'execution de la méthode refreshReponsesQuestionCourante()")
        }
    }

    public async addAllReponses() {
        const docRef = await doc(this.firestore, `historiqueProjectedMiahoots/${this.miahootIDProjected}`)
        const snapRep = await getDoc(docRef)
        if (snapRep.exists()) {
            let data = snapRep.data() as HistoriqueProjectedMiahoot
            const docRefAllRep =
                await doc(this.firestore, `historiqueProjectedMiahoots/${this.miahootIDProjected}/allReponses/${this.BSProjectedMiahoot.value?.currentQCM}`).withConverter(HistoRepQcmConverter)
            const snapAllRep = await getDoc(docRefAllRep);
            if (!snapAllRep.exists()) {
                setDoc(docRefAllRep, {
                    tabReponses: data.tabCurrentRep
                })
            } else {
                console.log("Error when trying to create collection allReponses in addAllReponses()")
            }
        }
    }

}
