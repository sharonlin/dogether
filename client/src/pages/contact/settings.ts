import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Events} from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class SettingsPage {
  randomGif: boolean;
  searchSubject: string;
  email: string;
  errorMessage: string;
  server: string = 'http://myd-vm08561.hpeswlab.net:8787';

  constructor(public navCtrl: NavController, public events: Events) {
    this.email = localStorage['email'];
    this.server = localStorage['server'] || 'http://myd-vm08561.hpeswlab.net:8787';
    this.searchSubject = localStorage['searchSubject'] || "funny";
    this.randomGif = Boolean(localStorage['randomGif']);


  }

  save() {
    localStorage['server'] = this.server;
    localStorage['email'] = this.email.toLowerCase();
    localStorage['randomGif'] = Boolean(this.randomGif);
    localStorage['searchSubject'] = this.searchSubject;
    this.events.publish('settings:saved');

  }
}
