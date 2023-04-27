import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AccountConfigComponent } from './account-config/account-config.component';
import {CreationComponent} from "./creation/creation.component";

const routes: Routes = [
  { path: "", redirectTo: "/accueil", pathMatch: "full" },
  { path: "accueil", component: AccueilComponent},
  { path: "accountConfig", component: AccountConfigComponent },
  { path: "creation", component: CreationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
