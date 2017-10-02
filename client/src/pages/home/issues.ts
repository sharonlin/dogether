import {Events, NavController} from 'ionic-angular';
import {Http} from '@angular/http';
import {Component} from "@angular/core";
import * as _ from 'underscore';
import {GlobalVariable} from "../../app/global";


enum Type {
  TestName = 1,
  ClassName
}


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class IssuesPage {
  searchSubject: any;
  useRandomGif: boolean;
  image_width: boolean;
  isEmpty: boolean;
  name: any;
  fullName: any;
  userId: string;
  data: any;
  type = Type;
  avatarId: string;
  email: string = localStorage['email'];
  randomGif: string;
  private image_height: any;
  private selectedPipelineName: any;

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.isEmpty = true;
    this.data=[];
    this.fetchData();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  constructor(public navCtrl: NavController, public http: Http, public events: Events) {
    this.isEmpty = true;
    this.fetchData();
    this.searchSubject = localStorage['searchSubject'] || "funny";
    debugger;
    this.email = localStorage['email'];
    // this.useRandomGif = Boolean(localStorage['randomGif'] === "true");
    if (!this.email || this.email == '') {
      this.navCtrl.parent.select(2);
    }
    this.getRandomGif();
    events.subscribe('settings:saved', (user, time) => {
      this.navCtrl.parent.select(0);
      // this.useRandomGif = Boolean(localStorage['randomGif'] === "true");
      this.getRandomGif();
      console.log("settings:saved useRandomGif):" + this.useRandomGif);
      this.fetchData();
    });

  }

  selectedPipeline(pipelineName) {
    this.selectedPipelineName = pipelineName;
  }

  getRandomGif() {
    // if (this.useRandomGif) {
      this.searchSubject = localStorage['searchSubject'] || "funny";
      this.http.get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + this.searchSubject).subscribe(res => {
        this.randomGif = res.json().data.image_original_url;
        this.image_width = res.json().data.image_width;
        this.image_height = res.json().data.image_height;
      })
    // }
  }

  private fetchData() {
    this.getRandomGif();
    this.email = localStorage['email'];
    this.userId = '';
    if (this.email) {
      this.http.get(GlobalVariable.BASE_API_URL + '/api/users/' + this.email).subscribe(user => {
        let userInfo = user.json()[0];
        if (userInfo) {
          this.name = userInfo.name;
          this.fullName = userInfo.full_name;
          this.userId = userInfo._id;
          this.avatarId = userInfo.avatar_id;
          this.http.get(GlobalVariable.BASE_API_URL + '/api/users/' + this.userId + '/issues/None').subscribe(data => {
            // this.http.get("http://localhost:8080/api/mock").subscribe(data => {
            let groupedData = [];
            let byPipelineName = _.groupBy(data.json(), 'rootJobName');
            let pipelineData = Object.keys(byPipelineName).map(function (pipelineName) {
              let byPipelineBuild = _.groupBy(byPipelineName[pipelineName], 'buildNumber');

              let map = Object.keys(byPipelineBuild).map(function (buildNumber) {
                return ({buildNumber: buildNumber, issues: byPipelineBuild[buildNumber]});
              });

              return ({name: pipelineName, issues: map})

            })

            // let perBuildIssues = Object.keys(perBuild).map(function (key) {
            //   debugger;
            //   return ({name: key, byPipelineName: byPipelineName[key]})
            //
            // })

            groupedData.push({
              'full_name': this.fullName,
              avatar_id: this.avatarId,
              _id: this.userId,
              name: this.name,
              pipelines: pipelineData
            });
            this.data = groupedData;
            this.isEmpty = pipelineData.length == 0;
            if (pipelineData.length > 0) {
              this.events.publish('byPipelineName:loaded', groupedData);
              this.selectedPipeline(groupedData[0].pipelines[0].name);
            } else {
              this.events.publish('byPipelineName:empty');
              this.data=[];
              this.isEmpty=true;
            }

          });
        }else{
          this.isEmpty=true;
          this.data=[];
        }
      });
    } else {
      this.navCtrl.parent.select(1);
      this.isEmpty=true;
      this.data=[];
      this.events.publish('byPipelineName:empty');
      this.events.publish('byPipelineName:wrongEmail');
    }

  }


  itsMe(issue, uid) {
    //http://localhost:8080/api/issues/59b7b3e0f7c97337502ecd27/59b7b3faf7c97337502ecd3c
    let self = this;
    issue.is_blamed = 'right';
    this.http.put(GlobalVariable.BASE_API_URL + '/api/issues/' + issue._id, {'is_blamed': 'right'}).subscribe(function (res) {
      self.fetchData();
    });


  }

  notMe(issue, uid) {
    let self = this;
    issue.is_blamed = 'wrong';
    //http://localhost:8080/api/issues/59b7b3e0f7c97337502ecd27/59b7b3faf7c97337502ecd3c
    this.http.put(GlobalVariable.BASE_API_URL + '/api/issues/' + issue._id, {'is_blamed': 'wrong'}).subscribe(function (res) {
      self.fetchData();
    });

  }
}


