export class Response {
    label: string;
    estValide: boolean;

    constructor(label: string, isCorrect: boolean) {
        this.label = label;
        this.estValide = isCorrect;
    }
}
