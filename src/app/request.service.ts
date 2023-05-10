import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, Observable, firstValueFrom, of, shareReplay } from "rxjs";
import {ToasterService} from "./toaster.service";


/**
 * Ce service contient les méthodes permettant d'interroger un serveur
 *  
 */

@Injectable({
    providedIn: 'root'
})
export class RequestService {

  public static readonly PATH: string = '/api/v0/miahoots'

  constructor(private http: HttpClient, private toaster : ToasterService) {}

  /**
   * Requête GET
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête
   * @returns La promesse d'un objet récupéré sur un serveur
   */
  get<T>(url: string): Promise<T> {
    try {
      return firstValueFrom( this.http.get<T>(url) );
    } catch (err) {
      const error: HttpErrorResponse = err as HttpErrorResponse;
      if (error.status === 404) {
        // Erreur coté serveur
        // Pour le get celà arrive si la requête ne trouve aucun miahoot associé à cette enseignant.
        this.toaster.error(`IL N'Y A AUCUN MIAHOOT ASSOCIÉ À VOTRE ID`);
      } else {
        // Erreur coté client.
        this.toaster.error(`ERREUR LORS DE LA TENTATIVE DE RÉCUPÉRATION DU MIAHOOT`);
      }
      this.toaster.error(`404 sur GET ${url}`);
      throw `404 sur GET ${url}`;
    }
  } 

  /**
   * Requête CREATE
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête 
   * @param body L'entité à créer
   * @returns La promesse de l'entité qui vient d'être créée
   */

  create<T>(url: string, body: Object): Promise<any> {
    try {
      const res = firstValueFrom(this.http.post(url, body));
      return res;
    } catch (err) {
      const error: HttpErrorResponse = err as HttpErrorResponse;
      this.toaster.error(`VOTRE MIAHOOT N'A PAS PU ETRE CRÉÉ. VERIFIEZ QU'IL N'A PAS LE MÊME NOM ET QUE VOUS AVEZ BIEN ACCÈS AU SERVEUR`)
      throw `400 sur CREATE ${url}`;
    }
  }
  
  /**
   * Requête UPDATE
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête 
   * @param body L'entité à update
   * @returns La promesse de l'entité qui vient d'être update
   */

  update<T>(url: string, body: Object):  Promise<any> {
    try {
      const res =  firstValueFrom(this.http.patch<T>(url, body))
      this.toaster.success(`MODIFICATION RÉUSSIE 😀`);
      return res;
    } catch (err) { 
      const error: HttpErrorResponse = err as HttpErrorResponse;
      if (error.status === 404) {
        // Erreur coté serveur
        // Pour le get celà arrive si la requête ne trouve aucun miahoot associé à cette enseignant.
        this.toaster.error(`IL N'Y A AUCUN MIAHOOT ASSOCIÉ À VOTRE ID`);
      } else {
        // Erreur coté client.
        this.toaster.error(`ERREUR LORS DE LA MISE A JOUR DU MIAHOOT`);
      }
      this.toaster.error(`IL N'Y A AUCUN MIAHOOT ASSOCIÉ À VOTRE ID`);
      throw `404 sur GET ${url}`;
    }
  }


  /**
   * Requête DELETE
   * 
   * @param url L'url du endpoint auquel on veut addresser la requête
   * @returns La promesse de la suppression de l'entité
   */
  delete<T>(url: string): Promise<any> {
    try {
      const res = firstValueFrom(this.http.delete<T>(url));
      this.toaster.success(`SUPPRESSION RÉUSSIE 😀`);
      return res;
    } catch (err) {
      const error: HttpErrorResponse = err as HttpErrorResponse;
      this.toaster.error(`ERREUR LORS DE LA TENTATIVE DE SUPPRESSION DU MIAHOOT`);
      throw `400 sur le DELETE ${url}`;
    }
  }
}



