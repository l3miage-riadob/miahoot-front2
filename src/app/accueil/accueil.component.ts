import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs";
import {DataService, MiahootUser} from "../data.service";
import {
    Auth,
    authState,
    GoogleAuthProvider,
    OperationType,
    signInAnonymously,
    signInWithPopup,
    signOut,
    User,
    UserCredential
} from '@angular/fire/auth';
import {FirestoreService} from '../firestore.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {ToasterService} from "../toaster.service";

@Component({
    selector: 'app-accueil',
    templateUrl: './accueil.component.html',
    styleUrls: ['./accueil.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccueilComponent {

    readonly miahootUserObs !: Observable<MiahootUser | undefined>
    public readonly user: Observable<User | null>;
    public projectedMiahootIds!: string[]

    formGroup !: FormGroup<{
        name: FormControl<string>,
    }>

    constructor(private MUDATA: DataService, private auth: Auth,
                private FS: FirestoreService, private router: Router, private formBuilder: FormBuilder, private toaster: ToasterService) {
        this.user = authState(auth);
        this.miahootUserObs = MUDATA.miahootUserObs

        this.loadAllProjectedMiahootIds()
        this.formGroup = formBuilder.nonNullable.group({
            name: [""]
        })
    }

    async loginAnonymouslyAndJoin(currentId: string) {
        await signInAnonymously(this.auth);
        setTimeout(() => {
            this.MUDATA.updateMiahootUser({
                name: this.formGroup.controls.name.value,
            })
        }, 400)
        this.join(currentId)
    }

    async join(currentId: string) {
        if (this.projectedMiahootIds) {
            if (this.isFound(currentId)) {
                this.goToPage('gameroom')
            } else {
                this.toaster.error("AUCUN SALON CORRESPONDANT TROUVÉ")
            }
        }
    }

    public async loadAllProjectedMiahootIds() {
        try {
            this.projectedMiahootIds = await this.FS.getProjectedMiahootsIDs()
        } catch (error) {
            console.error(error)
        }
    }

    public goToPage(pageName: string) {
        this.router.navigate([`${pageName}`]);
    }

    public isFound(id: string): boolean {
        if (this.projectedMiahootIds) {
            let isFound = false
            let i = 0

            while (i < this.projectedMiahootIds.length && !isFound) {
                if (this.projectedMiahootIds.at(i) === id) {
                    isFound = true
                }
                i++;
            }

            return isFound
        } else {
            throw "isFound() : projectedMiahootIds undefined"
        }
    }
}
