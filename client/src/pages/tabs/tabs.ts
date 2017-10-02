import {Component} from '@angular/core';

import {RankPage} from '../about/rank';
import {SettingsPage} from '../contact/settings';
import {IssuesPage} from '../home/issues';
import {Events} from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = IssuesPage;
  tab2Root = RankPage;
  tab3Root = SettingsPage;

  issuesNumber: number;

  constructor(public events: Events) {
    this.issuesNumber = null;

    events.subscribe('byPipelineName:loaded', () => {
      this.issuesNumber = null;
    });

    events.subscribe('byPipelineName:loaded', (userData: UserData) => {
      let count = 0;
      debugger;
      for (let key in userData[0].pipelines) {
        for (let k in userData[0].pipelines[key].issues){
          count += userData[0].pipelines[key].issues[k].issues.length;
        }

      }
      this.issuesNumber = count > 0 ? count : null;

    });
  }
}
