import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, VirtualScroll, App } from 'ionic-angular';
// import { updateImgs } from 'ionic-angular/components/content/content';
// import { Img } from 'ionic-angular/components/img/img-interface';
import * as firebase from 'firebase';
import { PostTimelineProvider } from '../../providers/post-timeline/post-timeline';
import { ReportDetailsPage } from '../report-details/report-details';
import { CrudAddPostPage } from '../crud-add-post/crud-add-post';
import { CrudUpdatePostPage } from '../crud-update-post/crud-update-post';
import { FirebaseCrudProvider  } from '../../providers/firebase-crud/firebase-crud';
// import { ViewChild } from '@angular/core';
// import { ImageLoader } from 'ionic-image-loader';

/**
 * Generated class for the TabRtaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab-rta',
  templateUrl: 'tab-rta.html',
})
export class TabRtaPage {
  @ViewChild('virtualScroll', { read: VirtualScroll }) virtualScroll: VirtualScroll;
  // @ViewChild(Content) _content: Content;
  notif:any;
  ref = firebase.database().ref('posts/reports/rta');
  identifier: any;
  length: any;
  posts:any = [];

  constructor(public app: App, public navParams: NavParams, public timeline: PostTimelineProvider, public loadingCtrl: LoadingController, public firebasecrud: FirebaseCrudProvider) {
    this.identifier = sessionStorage.getItem('user_identifier');
    let loadingFetch = this.loadingCtrl.create();
    loadingFetch.setContent('Fetching all posted data ..');
    loadingFetch.setSpinner('bubbles');
    loadingFetch.present();
    this.loadPostData().then(() => {
      loadingFetch.dismiss();
        });
    this.notif = sessionStorage.getItem('notif');
  }
  readpost(name,date,image,title,content,latitude,longitude){
    var readPost:any = [];
    readPost.push({ name:name, date:date, image:image, title:title, content:content, latitude:latitude, longitude:longitude });
    this.app.getRootNav().push(ReportDetailsPage, { 'data': readPost});
  }
  generatePost(){
    this.app.getRootNav().push(CrudAddPostPage);
  }
  // ngOnInit(){
  //     setTimeout(() => {
  //       this.loadPostData().then(() => {

  //       });
  //     }, 500);
  // }
  ionViewDidEnter() {
    this.virtualScroll.resize();
  }
  // ngAfterViewInit(): void {
  //   if (this._content) {
  //     this._content.imgsUpdate = () => {
  //       if (this._content._scroll.initialized && this._content._imgs.length && this._content.isImgsUpdatable()) {
  //         // Reset cached bounds
  //         this._content._imgs.forEach((img: Img) => (<any>img)._rect = null);

  //         // Use global position to calculate if an img is in the viewable area
  //         updateImgs(this._content._imgs, this._content._cTop * -1, this._content.contentHeight, this._content.directionY, 1400, 400);
  //       }
  //     };
  //   }
  // }
  loadPostData() {
    return new Promise((resolve, reject) => {
      return this.ref.on('value', resp => {
        if (resp) {
          this.posts = [];
          this.posts = this.timeline.SnapshotToArray(resp);
          this.length = this.posts.length;
          this.posts.reverse();
          return resolve();
        }
        else {
          return reject();
        }
      });
    });
  }
  // updatepost(postedin,postid,govagency){
  //   this.app.getRootNav().push(CrudUpdatePostPage, { postedin: postedin, postid: postid, govofficialbool: govagency });
  // }
  updatepost(post) {
    var dataarr = JSON.stringify(post);
    this.app.getRootNav().push(CrudUpdatePostPage, { data: dataarr });
  }
  dropPost(postid,userid,postedin,govofficial){
    let loadingFetch = this.loadingCtrl.create();
    this.firebasecrud.removefunc(postid,userid,postedin,govofficial).then(data =>{
      console.log("SUCCESS "+JSON.stringify(data));

      loadingFetch.setContent('Fetching all posted data ..');
      loadingFetch.setSpinner('bubbles');
      loadingFetch.present();
      this.loadPostData().then(() => {
        loadingFetch.dismiss();
      });
    }).catch(e => { console.log("error"); loadingFetch.dismiss(); });
  }
  // clearCache(refresher) {
  //   this.imageLoader.clearCache();
  //   refresher.complete();
  // }
  // onImageLoad(event) {
  //   console.log('image ready: ', event);
  // }
}
