import {ChangeDetectionStrategy, Component} from '@angular/core';

import {map, Observable, of, switchMap} from 'rxjs';
import {DataService, MiahootUser} from '../data.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Firestore} from '@angular/fire/firestore';
import {Auth, authState, User} from '@angular/fire/auth';

@Component({
  selector: 'app-account-config',
  templateUrl: './account-config.component.html',
  styleUrls: ['./account-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountConfigComponent {
  readonly miahootUserObs: Observable<MiahootUser | undefined>;
  readonly userObs: Observable<User | null>;

  formGroup !: FormGroup<{
    name: FormControl<string>,
    photoURL: FormControl<string>,
    photoFile: FormControl<File | undefined>
  }>

  constructor(private MUDATA: DataService, private formBuilder: FormBuilder, fireStore: Firestore, private auth : Auth ){
    this.userObs = authState(this.auth);
    this.miahootUserObs = MUDATA.miahootUserObs;

    this.formGroup = formBuilder.nonNullable.group({
      name: [""],
      photoURL: ["url"],
      photoFile: [undefined as undefined | File],
    })
  }

  async update() {
    this.MUDATA.updateMiahootUser({
      name: this.formGroup.controls.name.value,
      photoURL: this.formGroup.controls.photoURL.value,
    })
  }
  updateMiahootUser(data: Partial<MiahootUser>) {
    this.MUDATA.updateMiahootUser(data);
  }
}

async function loadFileUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(reader.result as string);
    }
    reader.onerror = (e) => {
      reject(e);
    }
    reader.readAsDataURL(file);
  })
}

async function loadFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(reader.result as ArrayBuffer);
    }
    reader.onerror = (e) => {
      reject(e);
    }
    reader.readAsArrayBuffer(file);
  })
}
