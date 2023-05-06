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
import { PresentationComponent } from './presentation/presentation.component';
import { CreationComponent } from './creation/creation.component';
import { HttpClientModule } from "@angular/common/http";

import { AcceuilParticipantComponent } from './acceuil-participant/acceuil-participant.component';

import {MatSelectModule} from "@angular/material/select";
import { DetailComponent } from './detail/detail.component';
import { AllMiahootsComponent } from './all-miahoots/all-miahoots.component';
import {MatListModule} from '@angular/material/list';





@NgModule({
  declarations: [
    AppComponent,
    AccountConfigComponent,
    AccueilComponent,
    CreationComponent,
    AcceuilParticipantComponent,
    DetailComponent,
    AllMiahootsComponent
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
        PresentationComponent,
        MatSelectModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
