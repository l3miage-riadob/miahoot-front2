export class Response {
    label: string;
    isCorrect: boolean;

    constructor(title: string, isCorrect: boolean) {
        this.label = title;
        this.isCorrect = isCorrect;
    }
}
