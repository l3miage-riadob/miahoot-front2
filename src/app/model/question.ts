import {Response} from "./response";

export class Question {
    label: string;
    reponses: Response[];

    constructor(label: string, responses: Response[]) {
        this.label = label;
        this.reponses = responses;
    }

}
