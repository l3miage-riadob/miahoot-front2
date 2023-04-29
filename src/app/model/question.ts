import {Response} from "./response";

export class Question {
    label: string;
    responses: Response[];

    constructor(label: string, responses: Response[]) {
        this.label = label;
        this.responses = responses;
    }

}
