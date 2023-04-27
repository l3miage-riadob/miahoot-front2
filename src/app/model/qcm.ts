import { Question } from "./question";

export class Qcm {
    questions: Question[];

    constructor(questions: Question[]) {
        this.questions = questions;
    }
}
