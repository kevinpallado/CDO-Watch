import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabRtaPage } from './tab-rta';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    TabRtaPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(TabRtaPage),
  ],
})
export class TabRtaPageModule {}
