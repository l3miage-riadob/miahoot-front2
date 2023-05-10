import { Injectable } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
// npm install --save ngx-toast-notifications

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(private toaster : Toaster) { }

  success(message: string) {
    this.toaster.open({
      text: message,
      caption: 'Success',
      type: 'success',
    });
  }

    error(message: string) {
    this.toaster.open({
      text: message,
      caption: 'Error',
      type: 'danger',
    });
    }

    warning(message: string) {
    this.toaster.open({
      text: message,
      caption: 'Warning',
      type: 'warning',
    });
    }

    info(message: string) {
    this.toaster.open({
      text: message,
      caption: 'Info',
      type: 'info',
    });
    }

    primary(message: string) {
    this.toaster.open({
      text: message,
      caption: 'Primary',
      type: 'primary',
    });
    }
    dark(message: string) {
    this.toaster.open({
      text: message,
      caption: 'Dark',
      type: 'dark',
    });
    }

}
