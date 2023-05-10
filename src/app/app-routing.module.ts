import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AccueilComponent} from './accueil/accueil.component';
import {AccountConfigComponent} from './account-config/account-config.component';
import {CreationComponent} from "./creation/creation.component";
import {PresentateurComponent} from "./presentateur/presentateur.component";
import {DetailPresentateurComponent} from "./detail-presentateur/detail-presentateur.component";
import {DetailConcepteurComponent} from './detail-concepteur/detail-concepteur.component';
import {ConcepteurComponent} from './concepteur/concepteur.component';
import {GameroomComponent} from "./gameroom/gameroom.component";
import {AffichageResultatsComponent} from "./affichage-resultats/affichage-resultats.component";

const routes: Routes = [
    {path: "", redirectTo: "/accueil", pathMatch: "full"},
    {path: "accueil", component: AccueilComponent},
    {path: "configuration", component: AccountConfigComponent},
    {path: "presentateur/miahoots", component: PresentateurComponent},
    {path: "presentateur/miahoots/:id/detail", component: DetailPresentateurComponent},
    {path: "concepteur/miahoots", component: ConcepteurComponent},
    {path: "concepteur/miahoots/creation", component: CreationComponent},
    {path: "concepteur/miahoots/:id/detail", component: DetailConcepteurComponent},
    {path: "miahoots/gameroom/:id", component: GameroomComponent},
    {path: "miahoots/gameroom/:id/resultats", component: AffichageResultatsComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {
}
