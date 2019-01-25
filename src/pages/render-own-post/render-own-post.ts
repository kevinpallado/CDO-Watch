import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import * as firebase from 'firebase';
import { PostTimelineProvider } from '../../providers/post-timeline/post-timeline';
import { ReportDetailsPage } from '../report-details/report-details';
/**
 * Generated class for the RenderOwnPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-render-own-post',
  templateUrl: 'render-own-post.html',
})
export class RenderOwnPostPage {

  databaseRef:any = firebase.database();
  storageRef:any = firebase.storage().ref();

  identifier:any;
  userData:any;
  ownPosts:any = [];
  userUid:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public timeline: PostTimelineProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    var loadingPosts = loadingCtrl.create();
    loadingPosts.setContent('Rendering your posts ..');
    loadingPosts.setSpinner('bubbles');
    loadingPosts.present();
    this.userUid = sessionStorage.getItem('userid'); // UID of the user
    var snapUser = sessionStorage.getItem('realtime_data'); // data of the user
    this.userData = JSON.parse(snapUser);
    this.identifier = sessionStorage.getItem('user_identifier'); // user identifier either government official or citizen
    this.renderPosts().then(()=>{
      loadingPosts.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RenderOwnPostPage');
  }

  renderPosts(){
    console.log("identifier =>",this.identifier);
    if(this.identifier == 'citizen'){
      return new Promise((resolve,reject)=>{
        this.databaseRef.ref('users/citizen/'+this.userUid+'/reportCopy').on('value', data =>{
          if(data){
            this.ownPosts = [];
            this.ownPosts = this.timeline.SnapshotToArray(data);
            this.ownPosts.reverse();
            console.log("posts => ",JSON.stringify(this.ownPosts));
            return resolve();
          }
          else{
            return reject();
          }
        });
      });
    }
    else{
      return new Promise((resolve, reject) => {
        this.databaseRef.ref('users/government/'+this.userData.gov_agency+'/'+this.userUid+'/reportCopy').on('value', data =>{
          if(data){
            this.ownPosts = [];
            this.ownPosts = this.timeline.SnapshotToArray(data);
            this.ownPosts.reverse();
            console.log("posts => ", JSON.stringify(this.ownPosts));
            return resolve();
          }
          else{
            return reject();
          }
        });
      });
    }
  }

  removePosts(copyPostId,userUid,govAgency,govOfficial){
    let confirmDelete = this.alertCtrl.create();
    confirmDelete.setTitle('Confirm Delete');
    confirmDelete.setMessage('Are you sure to delete this posts?');
    confirmDelete.addButton('Cancel');
    confirmDelete.addButton({
      text: 'Confirm',
      handler: ()=>{
        if (govOfficial) {
          this.databaseRef.ref('users/government/' + govAgency + '/' + userUid + '/reportCopy/' + copyPostId).remove().then(data => {
            if (!data) {
              this.databaseRef.ref('posts/reports/' + govAgency + '/' + copyPostId).remove().then(data => {
                if (!data) {
                  this.storageRef.child('reports/' + copyPostId + '.jpg').delete().then(() => {
                    this.navCtrl.popToRoot();
                  });
                }
              });
            }
          });
        }
        else {
          this.databaseRef.ref('users/citizen/' + userUid + '/reportCopy/' + copyPostId).remove().then(data => {
            if (!data) {
              if (govAgency == 'unvalidated') {
                this.databaseRef.ref('posts/citizen/' + govAgency + '/' + copyPostId).remove().then(data => {
                  if (!data) {
                    this.storageRef.child('reports/' + copyPostId + '.jpg').delete().then(() => {
                      this.navCtrl.popToRoot();
                    });
                  }
                });
              }
              else {
                this.databaseRef.ref('posts/reports/' + govAgency + '/' + copyPostId).remove().then(data => {
                  if (!data) {
                    this.storageRef.child('reports/' + copyPostId + '.jpg').delete().then(() => {
                      this.navCtrl.popToRoot();
                    });
                  }
                });
              }
            }
          });
        }
      }
    });
    confirmDelete.present();
  }

  readpost(name,date,image,title,content,latitude,longitude){
    var readPost:any = [];
    readPost.push({ name:name, date:date, image:image, title:title, content:content, latitude:latitude, longitude:longitude });
    this.navCtrl.push(ReportDetailsPage, { 'data': readPost});
  }
}
