import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, App } from 'ionic-angular';
import * as firebase from 'firebase';
import { PostTimelineProvider } from '../../providers/post-timeline/post-timeline';
import { VirtualScroll } from 'ionic-angular';
import { ReportDetailsPage } from '../report-details/report-details';
import { CrudAddPostPage } from '../crud-add-post/crud-add-post';
import { FirebaseCrudProvider } from '../../providers/firebase-crud/firebase-crud';
import { CrudUpdatePostPage } from '../crud-update-post/crud-update-post';
/**
 * Generated class for the TabPnpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tab-pnp',
  templateUrl: 'tab-pnp.html',
})
export class TabPnpPage {

  @ViewChild('virtualScroll', { read: VirtualScroll }) virtualScroll: VirtualScroll;
  
  notif: any;
  ref = firebase.database().ref('posts/reports/pnp');
  identifier: any;
  length: any;
  posts: any = [];

  constructor(public navCtrl: NavController, public firebasecrud: FirebaseCrudProvider,public app: App, public navParams: NavParams, public timeline: PostTimelineProvider, public loadingCtrl: LoadingController) {
    let loadingFetch = this.loadingCtrl.create();
    this.identifier = sessionStorage.getItem('user_identifier');
    loadingFetch.setContent('Fetching all posted data ..');
    loadingFetch.setSpinner('bubbles');
    loadingFetch.setDuration(5000);
    loadingFetch.present();
    this.notif = sessionStorage.getItem('notif');
  }
  ngOnInit() {
    setTimeout(() => {
      this.loadPostData().then(() => {

      });
    }, 500);
  }
  ionViewDidEnter() {
    this.virtualScroll.resize();
  }
  generatePost() {
    this.app.getRootNav().push(CrudAddPostPage);
  }
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
  readpost(name, date, image, title, content, latitude, longitude) {
    var readPost: any = [];
    readPost.push({ name: name, date: date, image: image, title: title, content: content, latitude: latitude, longitude: longitude });
    this.app.getRootNav().push(ReportDetailsPage, { 'data': readPost });
  }
  updatepost(post) {
    var dataarr = JSON.stringify(post);
    this.app.getRootNav().push(CrudUpdatePostPage, { data: dataarr });
  }
  dropPost(postid, userid, postedin, govofficial) {
    this.firebasecrud.removefunc(postid, userid, postedin, govofficial).then(data => {
      let loadingFetch = this.loadingCtrl.create();
      loadingFetch.setContent('Fetching all posted data ..');
      loadingFetch.setSpinner('bubbles');
      loadingFetch.present();
      this.loadPostData().then(() => {
        loadingFetch.dismiss();
      });
    }).catch(e => { console.log("error") });
  }
}
