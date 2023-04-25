import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilComponent } from './accueil/accueil.component';
import { AccountConfigComponent } from './account-config/account-config.component';

const routes: Routes = [
  { path: "", component: AccueilComponent },
  { path: "accountConfig", component: AccountConfigComponent }, 
  { path: "", redirectTo: "", pathMatch: "full"} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
