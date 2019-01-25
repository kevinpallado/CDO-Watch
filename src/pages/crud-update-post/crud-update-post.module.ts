import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrudUpdatePostPage } from './crud-update-post';

@NgModule({
  declarations: [
    CrudUpdatePostPage,
  ],
  imports: [
    IonicPageModule.forChild(CrudUpdatePostPage),
  ],
})
export class CrudUpdatePostPageModule {}
