import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AccountConfigComponent } from './account-config/account-config.component';
import { AccueilComponent } from './accueil/accueil.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { CreationComponent } from './creation/creation.component';
import { HttpClientModule } from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from '@angular/material/list';
import { PresentateurComponent } from './presentateur/presentateur.component';
import { DetailPresentateurComponent } from './detail-presentateur/detail-presentateur.component';
import { ConcepteurComponent } from './concepteur/concepteur.component';
import { DetailConcepteurComponent } from './detail-concepteur/detail-concepteur.component';
import {GameroomComponent} from "./gameroom/gameroom.component";
import { AffichageResultatsComponent } from './affichage-resultats/affichage-resultats.component';

import { MiahootUploaderComponent } from './miahoot-uploader/miahoot-uploader.component';
import { ToastNotificationsModule } from "ngx-toast-notifications";

@NgModule({
  declarations: [
    AppComponent,
    AccountConfigComponent,
    AccueilComponent,
    CreationComponent,
    PresentateurComponent,
    ConcepteurComponent,
    DetailConcepteurComponent,
    DetailPresentateurComponent,
    GameroomComponent,
    AffichageResultatsComponent,
    MiahootUploaderComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatListModule,
        MatToolbarModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatRadioModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMatFileInputModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        MatSelectModule,
        ToastNotificationsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
