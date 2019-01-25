import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabBfpPage } from './tab-bfp';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    TabBfpPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(TabBfpPage),
  ],
})
export class TabBfpPageModule {}
