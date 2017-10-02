import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Test} from './Test';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AccuracyService {
  url: string;

  constructor(private http: Http) {
    this.url = 'http://myd-vm08561.hpeswlab.net:8787/api/accuracy';
  }

  private static handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  getData(): Observable<any[]> {
    return this.http.get(this.url)
      .map(res => res.json())
      .catch(AccuracyService.handleErrorObservable);
  }
}
