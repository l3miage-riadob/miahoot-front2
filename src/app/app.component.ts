import { Component } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { Auth, authState, GoogleAuthProvider, OperationType, signInAnonymously, signInWithPopup, signOut, User, UserCredential } from '@angular/fire/auth';
import { DataService, MiahootUser } from './data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = "MIAHOOT"
  public readonly user: Observable<MiahootUser | undefined>;
  public bsIsAuth = new BehaviorSubject<boolean>(false);

  constructor(private auth : Auth, private data : DataService){
    this.user = this.data.miahootUser
  }

  
  async login(){ 

    this.bsIsAuth.next(true);

    await signInWithPopup(this.auth, new GoogleAuthProvider()); // try catch (err) console log

    this.bsIsAuth.next(false);
  }

  async loginAnonymously(){
    await signInAnonymously(this.auth);
  }

  async logout(){
    await signOut(this.auth);
  }
}
