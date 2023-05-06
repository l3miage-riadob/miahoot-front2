import { Question } from "./question";

export class Qcm {
    nom: string;
    idEnseignant?: string;
    idMetier?: string;
    questions: Question[];

    constructor(nom: string, questions: Question[], idEnseignant?: string, idMetier?: string) {
        this.nom = nom;
        this.idEnseignant = idEnseignant;
        this.questions = questions;
        this.idMetier = idMetier;
    }
}
