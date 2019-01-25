import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CrudAddPostPage } from './crud-add-post';

@NgModule({
  declarations: [
    CrudAddPostPage,
  ],
  imports: [
    IonicPageModule.forChild(CrudAddPostPage),
  ],
})
export class CrudAddPostPageModule {}
