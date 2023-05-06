import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataService, MiahootUser, Role } from '../data.service';
import { BehaviorSubject, EMPTY, Observable, catchError, lastValueFrom, map, of, retry, timeout } from 'rxjs';
import { Qcm } from '../model/qcm';
import { RequestService } from '../request.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-all-miahoots',
  templateUrl: './all-miahoots.component.html',
  styleUrls: ['./all-miahoots.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AllMiahootsComponent {
  protected readonly Role = Role;
  miahootUserSubjectInAllMiahoots: Observable<MiahootUser | undefined>;
  qcmOfTheTeacher: Observable<Qcm[] | undefined> = new Observable(undefined);
  idEnseignant: string | null;
  url: string = 'http://129.88.210.80:8080/api/v0/miahoots'

  constructor(private http: HttpClient, private data: DataService, private RS: RequestService, private auth: Auth) {
    this.idEnseignant  = sessionStorage.getItem("idEnseignant")
    this.qcmOfTheTeacher = this.get(this.url + '?id=' + this.idEnseignant);
    this.miahootUserSubjectInAllMiahoots = this.data.miahootUserBS;
  }

  get(url: string): Observable<any | undefined> {
    return this.RS.get(url);
  }

  /* On sait que l'id métier ne sera pas undefined dans ce cas de figure */
  delete(idMetier: string | undefined): Observable<any | undefined> {
    return this.RS.delete(this.url + "/" +  idMetier);
  }

  refreshPage() {
    window.location.reload();
  }
}
