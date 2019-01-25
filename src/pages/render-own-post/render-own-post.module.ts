import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RenderOwnPostPage } from './render-own-post';

@NgModule({
  declarations: [
    RenderOwnPostPage,
  ],
  imports: [
    IonicPageModule.forChild(RenderOwnPostPage),
  ],
})
export class RenderOwnPostPageModule {}
