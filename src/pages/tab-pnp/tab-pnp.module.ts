import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TabPnpPage } from './tab-pnp';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    TabPnpPage,
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(TabPnpPage),
  ],
})
export class TabPnpPageModule {}
