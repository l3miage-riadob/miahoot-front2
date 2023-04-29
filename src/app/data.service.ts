import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, FirestoreDataConverter, QueryDocumentSnapshot, doc, docData, getDoc, setDoc, updateDoc, DocumentReference} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, switchMap, of } from 'rxjs';

export interface MiahootUser {
  readonly name: string,
  readonly photoURL: string;
  readonly projectedMiahoot?: string;
}

const miahootConverter: FirestoreDataConverter<MiahootUser> = {
  toFirestore: (data: MiahootUser) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) =>
    snap.data() as MiahootUser
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly miahootUser: Observable<MiahootUser | undefined>;

  document: DocumentReference<MiahootUser>  | undefined; 

  constructor(private auth: Auth, private firestore: Firestore) {
    authState(this.auth).subscribe( async user => {
      if (user != null) {
        const docUser = doc(firestore, `user/${user.uid}`).withConverter( miahootConverter );
        const snapUser = await getDoc(docUser);
        if (!snapUser.exists()) {
          setDoc(docUser, {
            name: user.displayName ?? user.email ?? user.uid,
            photoURL: user.photoURL ?? "",
            projectedMiahoot: ""
          } satisfies MiahootUser )
        }
      }
    })

    this.miahootUser = authState(this.auth).pipe(
      switchMap( user => {
        if (user == null) {
          this.document = undefined;
          return of(undefined);
        } else {
          this.document = doc(firestore, `user/${user.uid}`).withConverter( miahootConverter )
          return docData(this.document);
        }
      })
    )
  }

  updateMiahootUser(data: Partial<MiahootUser>) {
    if (this.document != undefined) {
      updateDoc(this.document, data);
    }
  }
}


