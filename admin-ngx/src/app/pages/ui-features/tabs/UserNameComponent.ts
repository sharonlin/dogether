import {Component, Input, OnInit} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    {{renderValue}}
  `,
})
export class UserNameComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: any;
  @Input() rowData: any;

  ngOnInit() {
    this.renderValue = this.value.full_name;
  }

}
