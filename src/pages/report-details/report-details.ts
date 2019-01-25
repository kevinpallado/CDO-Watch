import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GooglemapPage } from '../googlemap/googlemap';
/**
 * Generated class for the ReportDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-details',
  templateUrl: 'report-details.html',
})
export class ReportDetailsPage {

  contentPost:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.contentPost = navParams.get('data');
    console.log(JSON.stringify(this.contentPost));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportDetailsPage');
  }
  showLocation(lattitude,longitude,title){
    this.navCtrl.push(GooglemapPage, { 'lattitude':lattitude , 'longitude':longitude , 'title':title });
  }
}
