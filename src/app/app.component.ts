import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController, LoadingController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ImageLoaderConfig } from 'ionic-image-loader';

// import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
// import { CrudAddPostPage } from '../pages/crud-add-post/crud-add-post';
import { PostTimelineProvider } from '../providers/post-timeline/post-timeline';
import { CitizenReportsPage } from '../pages/citizen-reports/citizen-reports';
import { RenderOwnPostPage } from '../pages/render-own-post/render-own-post';
import { LoginPage } from '../pages/login/login';
import { TabGovernmentPage } from '../pages/tab-government/tab-government';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  identifier: any;
  userinfo: any = [];
  rootPage: any = LoginPage;
  lengthRibbon:any;

  pages: Array<{title: string, component: any, icon: any}>;

  constructor(
    public platform: Platform,
    public events:Events,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public auth: AuthServiceProvider,
    public timeline: PostTimelineProvider,
    public app: App,
    private imageLoaderConfig: ImageLoaderConfig) {
    this.imageLoaderConfig.setConcurrency(5);
    this.imageLoaderConfig.setHeight('40%');
    this.imageLoaderConfig.setBackgroundSize('cover');
    this.imageLoaderConfig.setBackgroundRepeat('repeat-x');
    this.imageLoaderConfig.enableDebugMode();
    this.imageLoaderConfig.setMaximumCacheSize(10 * 1024 * 1024);
    this.initializeApp();
    this.listenLoginEvent();
    // used for an example of ngFor and navigation
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.getRibbon();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  openPage(page) {
    let loading = this.loadingCtrl.create();
    loading.setContent('Logging Out');
    loading.setSpinner('bubbles');
    let alertLogout = this.alertCtrl.create();
    alertLogout.setTitle('Confirm Decision');
    alertLogout.setMessage('Are you sure you want to logout?');
    alertLogout.addButton('Cancel');
    alertLogout.addButton({
      text: 'Yes',
      handler: () =>{
        loading.present();
        this.auth.signOut().then(()=>{
          setTimeout(() => {
            this.app.getRootNav().setRoot(LoginPage);
          }, 2000);

          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        }).catch(e =>  console.log(JSON.stringify(e)));
      }
    });
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component == 'LogOut'){
      alertLogout.present();
    }
    else{
      this.nav.setRoot(page.component);
    }
  }
  getRibbon(){
    this.timeline.selectCitizenReports().then(data =>{
      if(data > 0){
        this.lengthRibbon = data;
        sessionStorage.setItem('notif','1');
      }
      else{
        this.lengthRibbon = data;
        sessionStorage.setItem('notif', '0');
      }
      
    }).catch(e => console.log(e));
  }
  listenLoginEvent(){
    console.log("SUBSCRIBED!");
    this.events.subscribe('user:login', (nat_id, displayname, email, identifier)=>{
      this.userinfo = { id: nat_id, name: displayname, email: email };
      console.log("userinfo =>" ,JSON.stringify(this.userinfo));
      this.checkUserEvent(identifier);
    });
  }
  checkUserEvent(user){
    this.getRibbon();
    this.identifier = sessionStorage.getItem('user_identifier');
    if (this.identifier == 'citizen' || user == 'citizen'){
      this.pages = [
        { title: 'Newsfeed', component: TabGovernmentPage, icon: 'paper' },
        // { title: 'Netizen Reports', component: CitizenReportsPage, icon: 'clipboard' },
        { title: 'Your Report', component: RenderOwnPostPage, icon: 'glasses' },
        { title: 'Logout', component: 'LogOut', icon: 'exit' }
      ];
    }
    else{
      this.pages = [
        { title: 'Newsfeed', component: TabGovernmentPage, icon: 'paper' },
        { title: 'Netizen Reports', component: CitizenReportsPage, icon: 'clipboard' },
        { title: 'Your Report', component: RenderOwnPostPage, icon: 'glasses' },
        { title: 'Logout', component: 'LogOut', icon: 'exit' }
      ];
    }
  }
}
