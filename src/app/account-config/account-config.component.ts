import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Observable, of, switchMap } from 'rxjs';
import { DataService, MiahootUser } from '../data.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Data } from '@angular/router';
import { Storage, getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-account-config',
  templateUrl: './account-config.component.html',
  styleUrls: ['./account-config.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountConfigComponent {


  readonly miahootUserObs: Observable<MiahootUser | undefined>;
  readonly preview: Observable<string>;


  formGroup !: FormGroup<{
    name: FormControl<string>,
    photoURL: FormControl<string>,
    photoFile: FormControl<File | undefined>
  }>

  // private data : Data,
  constructor(private MUDATA: DataService, private formBuilder: FormBuilder, fireStore: Firestore, private auth : Auth ){ 
    this.miahootUserObs = MUDATA.miahootUser;
    let nnfb = formBuilder.nonNullable;

    this.formGroup = formBuilder.nonNullable.group({
      name: [""],
      photoURL: [""],
      photoFile: [undefined as undefined | File]
    })

    this.preview = this.formGroup.controls.photoFile.valueChanges.pipe(
      switchMap(file => {
        if (file) {
          return loadFileUrl(file);
        } else {
          return of("");
        }
      })
    )
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
