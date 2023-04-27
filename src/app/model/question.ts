import {Response} from "./response";

export class Question {
    title: string;
    responses: Response[];

    constructor(title: string, responses: Response[]) {
        this.title = title;
        this.responses = responses;
    }

}
