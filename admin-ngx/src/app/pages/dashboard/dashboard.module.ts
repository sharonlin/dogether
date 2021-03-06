import {NgModule} from '@angular/core';
import {AngularEchartsModule} from 'ngx-echarts';

import {ThemeModule} from '../../@theme/theme.module';
import {DashboardComponent} from './dashboard.component';
import {StatusCardComponent} from './status-card/status-card.component';
import {RoomsComponent} from './rooms/rooms.component';
import {RoomSelectorComponent} from './rooms/room-selector/room-selector.component';
import {TemperatureComponent} from './temperature/temperature.component';
import {TemperatureDraggerComponent} from './temperature/temperature-dragger/temperature-dragger.component';
import {TeamComponent} from './team/team.component';
import {KittenComponent} from './kitten/kitten.component';
import {SecurityCamerasComponent} from './security-cameras/security-cameras.component';
import {ElectricityComponent} from './electricity/electricity.component';
import {ElectricityChartComponent} from './electricity/electricity-chart/electricity-chart.component';
import {WeatherComponent} from './weather/weather.component';
import {PlayerComponent} from './rooms/player/player.component';
import {TrafficComponent} from './traffic/traffic.component';
import {TrafficChartComponent} from './traffic/traffic-chart.component';
import {UserAccuracyService} from '../../@core/data/user-accuracy.service';
import {SolarComponent} from 'app/pages/dashboard/solar/solar.component';


@NgModule({
  imports: [
    ThemeModule,
    AngularEchartsModule,
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    TemperatureDraggerComponent,
    RoomSelectorComponent,
    TemperatureComponent,
    RoomsComponent,
    TeamComponent,
    KittenComponent,
    SecurityCamerasComponent,
    ElectricityComponent,
    ElectricityChartComponent,
    WeatherComponent,
    PlayerComponent,
    TrafficComponent,
    TrafficChartComponent,
  ],
  providers: [
    UserAccuracyService,
  ],
})
export class DashboardModule {
}
