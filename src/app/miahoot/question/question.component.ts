import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../miahoot.service";

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
  set data(d:undefined|Question) {
    this._data = d == undefined ? {id:'0',question:'',choix:[]} : d;
    this.responses = d?.choix.map( () => false ) ?? [];
  }

  @Output() submit = new EventEmitter<number[]>()

  submitResponses(): void {
    this.submit.emit( [1,2,3] )
  }
}
