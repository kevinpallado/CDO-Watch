import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Alert } from 'ionic-angular';

import * as firebase from 'firebase';
/**
 * Generated class for the CrudUpdatePostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crud-update-post',
  templateUrl: 'crud-update-post.html',
})
export class CrudUpdatePostPage {

  firedb = firebase.database();
  postdata:any = [];
  title:any;
  content:any;
  loadingUpdate:any;

  tobeEditArray:any = [];
  governmentArray:any = ['bfp','pnp','rta','ndrmmc'];

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    var data = navParams.get('data');
    console.log(data);
    this.postdata = JSON.parse(data);
    this.title = this.postdata.title;
    this.content = this.postdata.content;
    // this.queryPost();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CrudUpdatePostPage');
  }
  // queryPost(){
  //   this.firedb.ref('posts/reports/'+this.postedin+'/'+this.postid).once('value', snapshot=>{
  //     this.tobeEditArray.push({ title: snapshot.val().title, content: snapshot.val().content, govOfficial: snapshot.val().gov_official, postedIn: snapshot.val().postedIn, postId: snapshot.val().postId, userId: snapshot.val().userid });
  //   });
  // }
  updateReport(title,content){
    this.loadingUpdate = this.loadingCtrl.create();
    this.loadingUpdate.setContent('Updating content ..');
    this.loadingUpdate.setSpinner('bubbles');
    let alert = this.alertCtrl.create();
    alert.setTitle('Notice');
    alert.setMessage('Are you sure you want to update this content?');
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Yes',
      handler: () =>{
        this.loadingUpdate.present();
        if (this.postdata.postedIn) {
          this.firedb.ref('posts/reports/' + this.postdata.postedIn + '/' + this.postdata.postId).update({
            title: title,
            content: content,
            editedOn: this.toPeriodFormat(),
          }).catch(e => console.log("ERROR => ", e));
          this.updateCopyReport(title, content)
        }
      }
    });
    alert.present();
  }

  updateCopyReport(title,content){
    this.firedb.ref('users/citizen/' + this.postdata.userid+'/reportCopy/'+this.postdata.postId).once('value' , (snapshot) => {
      if(snapshot.exists()){
        console.log('citizen exists');
        this.firedb.ref('users/citizen/' + this.postdata.userid + '/reportCopy/' + this.postdata.postId).update({
          title: title,
          content: content,
          editedOn: this.toPeriodFormat(),
        }).then(() =>{
          this.loadingUpdate.dismiss();
          this.navCtrl.pop();
        }).catch(e => console.log("ERROR => ",e));        
      }
      else{
        console.log('government ni ');
        new Promise((resolve,reject) => {
        for (var i = 0; i < this.governmentArray.length; i++){
          this.firedb.ref('users/government/' + this.governmentArray[i] + '/reportCopy/' +this.postdata.postId).once('value',async snapshot => {
            if(snapshot.exists()){
              await this.firedb.ref('users/government/' + this.governmentArray[i] + '/reportCopy/' + this.postdata.postId).update({
                title: title,
                content: content,
                editedOn: this.toPeriodFormat(),
              }).catch(e => { console.log("ERROR => ", e); return reject(); });
              this.loadingUpdate.dismiss();
              this.navCtrl.pop();
              return resolve();
            }
          }).catch(e => console.log("ERROR => ", e));
        }
        });
      }
    }).catch(e => console.log("ERROR => ", e));
        
  }
  public toPeriodFormat() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var _date = new Date();
    var dateOfTheDay = months[_date.getMonth()] + ' ' + _date.getDate() + ',' + _date.getFullYear();

    let hours: number = _date.getHours();
    let minutes: number = _date.getMinutes();
    let ampm = hours > 12 ? 'pm' : 'am';

    hours = hours > 12 ? hours - 12 : hours;
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'

    minutes = minutes < 10 ? 0 + minutes : minutes;
    var strTime = dateOfTheDay + ' - ' + hours + ':' + minutes + ' ' + ampm;

    return strTime;
  }
}
