import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabNdrmmcPage } from './tab-ndrmmc';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    TabNdrmmcPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(TabNdrmmcPage),
  ],
})
export class TabNdrmmcPageModule {}
