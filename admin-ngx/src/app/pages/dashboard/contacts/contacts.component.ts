import {Component} from '@angular/core';
import {NbMediaBreakpoint, NbMediaBreakpointsService, NbThemeService} from '@nebular/theme';
import {UserAccuracyService} from 'app/@core/data/user-accuracy.service';


@Component({
  selector: 'ngx-contacts',
  styleUrls: ['./contacts.component.scss'],
  templateUrl: './contacts.component.html',
})
export class ContactsComponent {
  contacts: any[] = [];
  noneUsers: any[] = [];
  rightUsers: any[] = [];
  recent: any[];
  breakpoint: NbMediaBreakpoint;
  breakpoints: any;
  themeSubscription: any;

  constructor(private userAccuracyService: UserAccuracyService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService) {

    this.breakpoints = breakpointService.getBreakpointsMap();
    this.themeSubscription = themeService.onMediaQueryChange()
      .subscribe(([oldValue, newValue]) => {
        this.breakpoint = newValue;
      });
    const dataService = this.userAccuracyService.getAccuracyData();
    dataService.subscribe((users: any) => {
      users.map((user) => {
        this.contacts.push({
          user: {name: user._id.full_name},
          type: user._id.name + ' ' + user.Wrong + ' / ' + user.total,
          precent: Number((parseInt(user.Wrong, 10) / parseInt(user.total, 10)) * 100).toFixed(0) + ' %',
        })
      });
    })

    const dataService2 = this.userAccuracyService.getAccuracyData('None');
    dataService2.subscribe((users: any) => {
      users.map((user) => {
        this.noneUsers.push({
          user: {name: user._id.full_name},
          type: user._id.name,
          precent: user.None,
        })
      });
    })

    const dataService3 = this.userAccuracyService.getAccuracyData('Success');
    dataService3.subscribe((users: any) => {
      users.map((user) => {
        this.rightUsers.push({
          user: {name: user._id.full_name},
          type: user._id.name + ' ' + user.Success + ' / ' + user.total,
          precent: Number((parseInt(user.Success, 10) / parseInt(user.total, 10)) * 100).toFixed(0) + ' %',
        })
      });
    })

  }
}
