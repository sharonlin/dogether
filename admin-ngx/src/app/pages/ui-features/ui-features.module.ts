import {NgModule} from '@angular/core';

import {ThemeModule} from '../../@theme/theme.module';
import {ButtonsModule} from './buttons/buttons.module';
import {UiFeaturesRoutingModule} from './ui-features-routing.module';
import {UiFeaturesComponent} from './ui-features.component';
import {GridComponent} from './grid/grid.component';
import {ModalsComponent} from './modals/modals.component';
import {IconsComponent} from './icons/icons.component';
import {ModalComponent} from './modals/modal/modal.component';
import {TypographyComponent} from './typography/typography.component';
import {Tab1Component, Tab2Component, TabsComponent} from './tabs/tabs.component';
import {SearchComponent} from './search-fields/search-fields.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {SmartTableService} from '../../@core/data/smart-table.service';
import {UserNameComponent} from './tabs/UserNameComponent';

const components = [
  UiFeaturesComponent,
  GridComponent,
  ModalsComponent,
  IconsComponent,
  ModalComponent,
  TypographyComponent,
  TabsComponent,
  Tab1Component,
  Tab2Component,
  SearchComponent,
  UserNameComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    UiFeaturesRoutingModule,
    ButtonsModule,
    Ng2SmartTableModule,
  ],
  declarations: [
    ...components,
  ],
  entryComponents: [
    ModalComponent,
    UserNameComponent,
  ],
  providers: [
    SmartTableService,
  ],
})
export class UiFeaturesModule { }
