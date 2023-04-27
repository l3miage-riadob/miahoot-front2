import { Question } from "./question";

export class Qcm {
    name: string
    questions: Question[];

    constructor(name: string, questions: Question[]) {
        this.name = name;
        this.questions = questions;
    }
}
