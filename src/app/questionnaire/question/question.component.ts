import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../questionnaire.service";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionComponent {
  responses: boolean[] = [];
  private _data!:Question;

  @Input()
  get data():Question {return this._data}
  set data(d:Question) {
    this._data = d;
    this.responses = d.choir.map( () => false );
  }

  @Output() submit = new EventEmitter<number[]>()

  submitResponses(): void {
    this.submit.emit( [1,2,3] )
  }
}
