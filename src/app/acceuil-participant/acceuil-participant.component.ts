import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceuil-participant',
  templateUrl: './acceuil-participant.component.html',
  styleUrls: ['./acceuil-participant.component.scss']
})
export class AcceuilParticipantComponent {

    codeMiahoot!: string;

    constructor(private router: Router) {

    }


    connectToMiahoot(): void {
      try {
        this.router.navigate(['roomMiahoot'], { queryParams: {code: this.codeMiahoot}}); //nom du path pour la création de la room d'id 'codeMiahoot'
      } catch (err) {
        throw new Error("Le code du Miahoot est introuvable");
      }
    }
}