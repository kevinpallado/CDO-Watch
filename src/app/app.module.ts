import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { LoginPageModule } from '../pages/login/login.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { TabGovernmentPageModule } from '../pages/tab-government/tab-government.module';
import { ReportDetailsPageModule } from '../pages/report-details/report-details.module';
import { GooglemapPageModule } from '../pages/googlemap/googlemap.module';
import { CrudAddPostPageModule } from '../pages/crud-add-post/crud-add-post.module';
import { CrudUpdatePostPageModule } from '../pages/crud-update-post/crud-update-post.module';
import { RenderOwnPostPageModule } from '../pages/render-own-post/render-own-post.module';
import { CitizenReportsPageModule } from '../pages/citizen-reports/citizen-reports.module';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import * as firebase from 'firebase';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { Camera } from '@ionic-native/camera';
import { SignupServiceProvider } from '../providers/signup-service/signup-service';
import { PostTimelineProvider } from '../providers/post-timeline/post-timeline';

import { IonicImageLoader } from 'ionic-image-loader';
import { DeveloperProvider } from '../providers/developer/developer';
import { FirebaseCrudProvider } from '../providers/firebase-crud/firebase-crud';

export const config = {
  apiKey: "AIzaSyBUfGgqoo12xn00Y7qdVnlvz9K_B0LNLGk",
  authDomain: "cdo-watch.firebaseapp.com",
  databaseURL: "https://cdo-watch.firebaseio.com",
  projectId: "cdo-watch",
  storageBucket: "cdo-watch.appspot.com",
  messagingSenderId: "361918174846"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    LoginPageModule,
    SignupPageModule,
    TabGovernmentPageModule,
    ReportDetailsPageModule,
    GooglemapPageModule,
    CrudAddPostPageModule,
    RenderOwnPostPageModule,
    CitizenReportsPageModule,
    CrudUpdatePostPageModule,
    IonicImageLoader.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    ImagePicker,
    Camera,
    Crop,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    SignupServiceProvider,
    PostTimelineProvider,
    DeveloperProvider,
    FirebaseCrudProvider
  ]
})
export class AppModule {}
