import {DataService, MiahootUser} from "./data.service";
import {Qcm} from "./model/qcm";
import {Injectable} from "@angular/core";
import {BehaviorSubject, filter, map, Observable, shareReplay, switchMap} from "rxjs";
import {RequestService} from "./request.service";
import {environment} from "../environments/environment";


interface STATE {
    user: MiahootUser;
    qcms: Qcm[];
}

@Injectable({
    providedIn: 'root'
})
export class MiahootsService {

    private stateBS: BehaviorSubject<STATE> = new BehaviorSubject<STATE>( this.initValue() );
    readonly stateObs: Observable<STATE>
    url: string = `${environment.springServer}${RequestService.PATH}`

    constructor(private data: DataService, private RS: RequestService) {
        this.stateObs = this.stateBS.asObservable();

        data.miahootUserObs.pipe(
            filter( U => U !== undefined ),
            map( U => U as MiahootUser ),
            switchMap( async U => {
                const state: STATE = {
                    user: U,
                    qcms: await RS.get<Qcm[]>( `${this.url}?id=${U.id}`)
                }
                return state;
            })
        ).subscribe(this.stateBS)
    }

    private initValue(): STATE {
        const defMiahoot: MiahootUser = { id: '1', name: 'default', photoURL: 'default', projectedMiahoot: "" };
        return {user: defMiahoot, qcms: []}
    }

    async getQcmByIdMetier(idMetier: string): Promise<Qcm> {
        try {
            const qcm = await this.RS.get<Qcm>(`${this.url}/${idMetier}`)
            return qcm
        } catch {
            throw `404 sur GET BY ID METIER à $${this.url}/${idMetier}}`
        }
    }

    async createQcm(qcm: Qcm) {
        try {
            const create = await this.RS.create(`${this.url}`, qcm)
        } catch {
            throw `ERROR sur CREATE ${this.url}}`
        }
    }

    async deleteQcm(idMetier: string): Promise<any> {

        try {
            const del = await this.RS.delete(`${this.url}/${idMetier}`)
            this.stateBS.next(
                {
                    user: this.stateBS.value.user,
                    qcms: await this.RS.get<Qcm[]>( `${this.url}?id=${this.stateBS.value.user.id}`)
                }
            )
        } catch {
            throw `404 sur DELETE ${this.url}/${idMetier}}`;
        }
    }

    async update(idMetier: string , qcm: Qcm): Promise<any> {
        console.log("l'id métier = ", idMetier)
        console.log("qcm idmétier = ", qcm.idMetier)
        if (qcm.idMetier != undefined) {
            try {
                const update = await this.RS.update(`${this.url}/${qcm.idMetier}`, qcm)
                this.stateBS.next(
                    {
                        user: this.stateBS.value.user,
                        qcms: await this.RS.get<Qcm[]>( `${this.url}?id=${this.stateBS.value.user.id}`)
                    }
                )
            } catch {
                throw `404 sur UPDATE ${this.url}/${qcm.idMetier}}`;
            }
        }
    }

}