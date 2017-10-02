import {Component} from '@angular/core';
import {AccuracyService} from '../../../@core/data/accuracy.service';

@Component({
  selector: 'ngx-d3',
  styleUrls: ['./d3.component.scss'],
  templateUrl: './d3.component.html',
})
export class D3Component {
  private errorMessage: any;
  accuracy_results = [];
  feedback = [];

  constructor(private accuracyService: AccuracyService) {
    const data = this.accuracyService.getData();
    const self = this;
    data.subscribe(
      accuracyData => {

        let total = 0;
        for (let i = 0; i < accuracyData.length; i++) {
          if (accuracyData[i]._id !== 'None') {
            total += accuracyData[i].count;
          }
        }
        const _accuracyOnly = [];
        const _feedback = [];

        accuracyData.map((obj: any) => {
          if (obj._id !== 'None') {
            _accuracyOnly.push({name: obj._id, value: (obj.count / total) * 100});
            // _accuracyOnly.push({name: obj._id, value: obj.count});
          }
          _feedback.push({name: obj._id, value: obj.count});
        });
        self.accuracy_results = _accuracyOnly;
        self.feedback = _feedback;
      },
      error => this.errorMessage = <any>error);
  }

}
