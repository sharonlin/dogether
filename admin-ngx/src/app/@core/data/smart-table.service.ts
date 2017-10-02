import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Test} from './Test';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SmartTableService {
  url: string;

  constructor(private http: Http) {
    this.url = 'http://myd-vm08561.hpeswlab.net:8787/api/users/issues';
  }

  private static handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

  getData(): Observable<Test[]> {
    return this.http.get(this.url)
      .map(res => res.json())
      .catch(SmartTableService.handleErrorObservable);
  }
}
