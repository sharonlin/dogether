import {Component, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import {SmartTableService} from '../../../@core/data/smart-table.service';
import {LocalDataSource} from 'ng2-smart-table';
import {Test} from '../../../@core/data/Test';
import {UserNameComponent} from './UserNameComponent';

@Component({
  selector: 'ngx-tab1',
  template: `
    <p>Early home automation began with labor-saving machines. Self-contained electric or gas powered
      <a target='_blank' href='https://en.wikipedia.org/wiki/Home_appliances'>home appliances</a>
      became viable in the 1900s with the introduction of
      <a target='_blank' href='https://en.wikipedia.org/wiki/Electric_power_distribution'>electric power distribution
      </a> and led to the introduction of washing machines (1904), water heaters (1889), refrigerators, sewing machines,
      dishwashers, and clothes dryers.
    </p>
  `,
})
export class Tab1Component {

}

@Component({
  selector: 'ngx-tab2',
  template: `
    <p>Tab 2 works!</p>
  `,
})
export class Tab2Component {
}

@Component({
  selector: 'ngx-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
})
export class TabsComponent {
  tests: Test[];
  errorMessage: any;
  source: LocalDataSource = new LocalDataSource();
  // @Input('value') wrongFilter: boolean;
  //
  // set value(val: boolean) {
  //   this.wrongFilter = val;
  //   if (this.wrongFilter) {
  //     this.source.setFilter([{field: 'is_blamed', search: 'right'}]);
  //   } else {
  //     this.source.setFilter([]);
  //   }
  //
  // }

  // get value(): boolean {
  //   return this.wrongFilter;
  // }

  // ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
  //
  //   if (changes['inputData'] && this.wrongFilter) {
  //     debugger;
  //     //your logic work when input change
  //   }
  // }

  constructor(private service: SmartTableService) {
    const obs = this.service.getData();

    obs.subscribe(
      tests => {
        this.source.load(tests);
        this.tests = tests
      },
      error => this.errorMessage = <any>error);
  }

  // .subscribe(res => {
  //
  //     const arr = Array.from(res, (item,key) => {
  //       return {
  //         pipelineRunId: res[key].pipelineRunId,
  //         rootJobName: res[key].rootJobName,
  //         buildNumber: res[key].buildNumber,
  //         is_blamed: res[key].is_blamed,
  //         test_package: res[key].test_package,
  //         test_name: res[key].test_name
  //       };
  //     });
  //
  //     this.data = arr;
  //   });
  //   this.source.load(data);
  // }

  settings = {
    // add: {
    //   addButtonContent: '<i class='nb-plus'></i>',
    //   createButtonContent: '<i class='nb-checkmark'></i>',
    //   cancelButtonContent: '<i class='nb-close'></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class='nb-edit'></i>',
    //   saveButtonContent: '<i class='nb-checkmark'></i>',
    //   cancelButtonContent: '<i class='nb-close'></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class='nb-trash'></i>',
    //   confirmDelete: true,
    // },
    actions: [],
    columns: {
      created_at: {
        title: 'Date',
        type: 'date',
      },
      _user: {
        title: 'User',
        type: 'custom',
        renderComponent: UserNameComponent,
        filterFunction(value1?: any, value2?: string) {
          return value1.full_name.indexOf(value2) >= 0;
        },
      },
      rootJobName: {
        title: 'Pipeline',
        type: 'string',
        // filter: {
        //   type: 'completer',
        //   config: {
        //     completer: {
        //       data: this.tests,
        //       searchFields: 'rootJobName',
        //       titleField: 'rootJobName',
        //     },
        //   },
        // },
      }
      , pipelineRunId: {
        title: 'Run Id',
        type: 'string',
      },
      buildNumber: {
        title: 'Build',
        type: 'string',
      },
      is_blamed: {
        title: 'Feedback',
        type: 'string',
        filter: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [
              {value: 'None', title: 'None'},
              {value: 'Wrong', title: 'Wrong'},
              {value: 'Right', title: 'Right'},
            ],
          },
        },
      },
      // test_package: {
      //   title: 'Package',
      //   type: 'string',
      // },
      // test_class: {
      //   title: 'Class',
      //   type: 'string',
      // },
      test_name: {
        title: 'Name',
        type: 'string',
      },
      // email: {
      //   title: 'E-mail',
      //   type: 'string',
      // },
      // age: {
      //   title: 'Age',
      //   type: 'number',
      // },
    },
  };


  tabs: any[] = [
    {
      title: 'Route tab #1',
      route: '/pages/ui-features/tabs/tab1',
    },
    {
      title: 'Route tab #2',
      route: '/pages/ui-features/tabs/tab2',
    },
  ];

}
