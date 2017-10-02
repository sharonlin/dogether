import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { RankPage } from '../pages/about/rank';
import { SettingsPage } from '../pages/contact/settings';
import { IssuesPage } from '../pages/home/issues';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpModule} from "@angular/http";
import {ExponentialStrengthPipe} from '../pipes/ExponentialStrengthPipe';

@NgModule({
  declarations: [
    MyApp,
    RankPage,
    SettingsPage,
    IssuesPage,
    TabsPage,
    ExponentialStrengthPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RankPage,
    SettingsPage,
    IssuesPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
