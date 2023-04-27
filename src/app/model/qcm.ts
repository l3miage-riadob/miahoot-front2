import { Question } from "./question";

export class Qcm {
    name: string
    idEnseignant?: string
    questions: Question[];

    constructor(name: string, questions: Question[], idEnseignant?: string) {
        this.name = name;
        this.idEnseignant = idEnseignant;
        this.questions = questions;
    }
}
