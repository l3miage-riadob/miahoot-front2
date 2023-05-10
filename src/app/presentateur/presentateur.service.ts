import {Injectable} from "@angular/core";
import {MiahootsService} from "../miahoots.service";
import {Qcm} from "../model/qcm";
import {MiahootUser} from "../data.service";
import {Observable} from "rxjs";

interface STATE {
    user: MiahootUser;
    qcms: Qcm[];
}

@Injectable({
    providedIn: 'root'
})
export class PresentateurService {

        obsState!: Observable<STATE>;
        /*
        Le présentateur choisira un Miahoot de sa liste à présenter et pourra ensuite naviguer dedans
        (Il récupère le Miahoot à partir de la base Springboot et utilise ensuite Firebase/Firestore pour le présenter et le piloter)
         */
        constructor(private miahootsService: MiahootsService) {
            this.obsState = miahootsService.stateObs;
        }
}
