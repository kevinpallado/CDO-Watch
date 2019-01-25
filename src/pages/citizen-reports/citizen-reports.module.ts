import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CitizenReportsPage } from './citizen-reports';

@NgModule({
  declarations: [
    CitizenReportsPage,
  ],
  imports: [
    IonicPageModule.forChild(CitizenReportsPage),
  ],
})
export class CitizenReportsPageModule {}
