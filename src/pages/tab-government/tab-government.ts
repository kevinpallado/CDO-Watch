import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the TabGovernmentPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab-government',
  templateUrl: 'tab-government.html'
})
export class TabGovernmentPage {

  tabRtaRoot = 'TabRtaPage'
  tabPnpRoot = 'TabPnpPage'
  tabNdrmmcRoot = 'TabNdrmmcPage'
  tabBfpRoot = 'TabBfpPage'


  constructor(public navCtrl: NavController) {}

}
