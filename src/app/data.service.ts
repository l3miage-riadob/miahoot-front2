import {Injectable, OnChanges, OnInit} from '@angular/core';
import {Auth, authState, User} from '@angular/fire/auth';
import { Firestore, FirestoreDataConverter, QueryDocumentSnapshot, doc, docData, getDoc, setDoc, updateDoc, DocumentReference} from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import {Observable, switchMap, of, BehaviorSubject, shareReplay} from 'rxjs';

export interface MiahootUser {
  readonly id : User['uid'],
  readonly name: string,
  readonly photoURL: string,
  readonly projectedMiahoot: string,
}

export interface AnonymousUser {
  id : User['uid'],
  name: string,
  projectedMiahoot: string,
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

  private miahootUserBS: BehaviorSubject<MiahootUser | undefined> = new BehaviorSubject<MiahootUser | undefined>(undefined);
  readonly miahootUserObs = this.miahootUserBS.asObservable();
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
            projectedMiahoot: ""

          } satisfies MiahootUser )
        }
      } else if(user != null && user.isAnonymous) {
        const docUser = doc(firestore, `user/${user.uid}`).withConverter( anonymousConverter );
        const snapUser = await getDoc(docUser);
        if (!snapUser.exists()) {
          setDoc(docUser, {
            id: user.uid,
            name: "anonymous",
            projectedMiahoot: ""
          } satisfies AnonymousUser )
        }
      }
    })
    
    authState(this.auth).pipe(
        switchMap( user => {
          if (user == null) {
            this.document = undefined;
            return of(undefined);
          } else {
            this.document = doc(this.firestore, `user/${user.uid}`).withConverter( miahootConverter )
            return docData(this.document);
          }
        }),
    ).subscribe( res => { 
        if (res != undefined) {
        this.miahootUserBS.next(res)
      } 
    })
  }

  updateMiahootUser(data: Partial<MiahootUser>) {
    if (this.document != undefined) {
      updateDoc(this.document, data);
    } else {
      console.log("document is undefined")
    }
  }
}

