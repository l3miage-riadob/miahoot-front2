import {Injectable, OnChanges} from '@angular/core';
import {Auth, authState, User} from '@angular/fire/auth';
import { Firestore, FirestoreDataConverter, QueryDocumentSnapshot, doc, docData, getDoc, setDoc, updateDoc, DocumentReference} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import {Observable, switchMap, of, BehaviorSubject} from 'rxjs';

export interface MiahootUser {
  readonly id : User['uid'],
  readonly name: string,
  readonly photoURL: string
  readonly role : Role
}

export interface AnonymousUser {
  id : User['uid'],
  name: string,
  role : Role
}

export enum Role {
  PRESENTATEUR = "PRESENTATEUR",
  CREATEUR = "CREATEUR",
  PARTICIPANT = "PARTICIPANT"
}

const anonymousConverter: FirestoreDataConverter<AnonymousUser> = {
    toFirestore: (data: AnonymousUser) => data,
    fromFirestore: (snap: QueryDocumentSnapshot) =>
        snap.data() as AnonymousUser
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
      if (user != null && !user.isAnonymous) {
        const docUser = doc(firestore, `user/${user.uid}`).withConverter( miahootConverter );
        const snapUser = await getDoc(docUser);
        if (!snapUser.exists()) {
          setDoc(docUser, {
            id: user.uid,
            name: user.displayName ?? user.email ?? user.uid,
            photoURL: user.photoURL ?? "",
            role: Role.CREATEUR
          } satisfies MiahootUser )
        }
      } else if(user != null && user.isAnonymous) {
        const docUser = doc(firestore, `user/${user.uid}`).withConverter( anonymousConverter );
        const snapUser = await getDoc(docUser);
        if (!snapUser.exists()) {
          setDoc(docUser, {
            id: user.uid,
            name: user.displayName ?? user.email ?? user.uid,
            role: Role.PARTICIPANT
          } satisfies AnonymousUser )
        }
      }
    })
    this.miahootUser = authState(this.auth).pipe(
        switchMap( user => {
          if (user == null) {
            this.document = undefined;
            return of(undefined);
          } else {
            this.document = doc(this.firestore, `user/${user.uid}`).withConverter( miahootConverter )
            return docData(this.document);
          }
        })
    );
  }

  updateMiahootUser(data: Partial<MiahootUser>) {
    if (this.document != undefined) {
      updateDoc(this.document, data);
    }
  }
<<<<<<< HEAD
}

=======

}


>>>>>>> ab95afbc (partie proxy)
