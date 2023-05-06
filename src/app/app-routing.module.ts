import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AccountConfigComponent } from './account-config/account-config.component';
import {CreationComponent} from "./creation/creation.component";
import { DetailComponent } from './detail/detail.component';
import { AllMiahootsComponent } from './all-miahoots/all-miahoots.component';

const routes: Routes = [
  { path: "", redirectTo: "/accueil", pathMatch: "full" },
  { path: "accueil", component: AccueilComponent},
  { path: "accountConfig", component: AccountConfigComponent },
  { path: "creation", component: CreationComponent },
  { path: "miahoots/:id/detail", component: DetailComponent },
  { path: "miahoots", component: AllMiahootsComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
