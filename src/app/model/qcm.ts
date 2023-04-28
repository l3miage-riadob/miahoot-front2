import { Question } from "./question";

export class Qcm {
    nom: string
    idEnseignant?: string
    questions: Question[];

    constructor(nom: string, questions: Question[], idEnseignant?: string) {
        this.nom = nom;
        this.idEnseignant = idEnseignant;
        this.questions = questions;
    }
}
