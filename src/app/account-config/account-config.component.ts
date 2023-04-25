import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService, MiahootUser } from '../data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Data } from '@angular/router';

@Component({
  selector: 'app-account-config',
  templateUrl: './account-config.component.html',
  styleUrls: ['./account-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountConfigComponent {


  readonly miahootUserObs: Observable<MiahootUser | undefined>;


  fg !: FormGroup<{
    name: FormControl<string>,
    photoURL: FormControl<string>,
    photoFile: FormControl<File | undefined>
  }>

  // private data : Data,
  constructor(private MUDATA: DataService, private fb: FormBuilder){ 
    this.miahootUserObs = MUDATA.miahootUser;
    let nnfb = fb.nonNullable;
    /*
    this.fg = nnfb.group({
      name : new FormControl<string>(''),
      photoURL : new FormControl<string>(''),
      photoFile :  new FormControl<File | undefined>(undefined)
    })
    */
  }

  updateMiahootUser(data: Partial<MiahootUser>) {
    this.MUDATA.updateMiahootUser(data);
  }
}
