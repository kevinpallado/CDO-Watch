import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, VirtualScroll, AlertController, LoadingController } from 'ionic-angular';

import * as firebase from 'firebase';
import { PostTimelineProvider } from '../../providers/post-timeline/post-timeline';
import { ReportDetailsPage } from '../report-details/report-details';
/**
 * Generated class for the CitizenReportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-citizen-reports',
  templateUrl: 'citizen-reports.html',
})
export class CitizenReportsPage {

  @ViewChild('virtualScroll', { read: VirtualScroll }) virtualScroll: VirtualScroll;

  firebase_refdb = firebase.database();
  userUid:any;
  userData:any;
  identifier:any;
  arrlength:any;
  citizenPosts:any = [];
  govagency:any;
  num:any;
  numPost:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public timeline: PostTimelineProvider) {
    this.userUid = sessionStorage.getItem('userid'); // UID of the user
    var snapUser = sessionStorage.getItem('realtime_data'); // data of the user
    this.userData = JSON.parse(snapUser);
    console.log(JSON.stringify(this.userData));
    this.govagency = this.userData.gov_agency;
    this.identifier = sessionStorage.getItem('user_identifier'); // user identifier either government official or citizen
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CitizenReportsPage');
  }
  ionViewDidEnter() {
    this.virtualScroll.resize();
  }
  ngOnInit(){
    setTimeout(() => {
      this.selectAllCitizenReports().then(()=>{

      });
    }, 500);
  }
  selectAllCitizenReports(){
    return new Promise((resolve,reject) =>{
      return this.firebase_refdb.ref('posts/reports/unvalidated').on('value', data=>{
        if(data){
          this.citizenPosts = [];
          this.citizenPosts = this.timeline.SnapshotToArray(data);
          this.citizenPosts = this.citizenPosts.reverse();
          this.arrlength = this.citizenPosts.length;
          // console.log(JSON.stringify(this.citizenPosts));
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
    this.navCtrl.push(ReportDetailsPage, { 'data': readPost });
  }

  validateReport(postid,postdata){
    let alertExists = this.alertCtrl.create();
    alertExists.setTitle('Notice');
    alertExists.setMessage('Already posted this report in your agency timeline');
    alertExists.addButton('Done');
    let loadingValid = this.loadingCtrl.create();
    loadingValid.setSpinner('bubbles');
    loadingValid.setContent('Grabbing report');
    let alertValidate = this.alertCtrl.create();
    alertValidate.setTitle('Notice');
    alertValidate.setMessage('Are you sure that this report is valid?');
    alertValidate.addButton('No');
    alertValidate.addButton({
      text: 'Yes',
      handler: () =>{
        loadingValid.present();
        this.firebase_refdb.ref('posts/reports/unvalidated/' + postid).once('value', data =>{
          // console.log(data ,"",data.val());
          loadingValid.dismiss();
          if(data.val().num_grab < 4){
            this.numPost = data.val().num_grab;
            this.num = data.val().num_grab + 1;
            console.log("new =>" + this.num + " old => " + data.val().num_grab);
            this.firebase_refdb.ref('posts/reports/unvalidated/' + postid+'/'+this.govagency).once('value', data => {
              if(!data.val()){
                this.firebase_refdb.ref('posts/reports/unvalidated/' + postid + '/' + this.govagency).set(true).then(()=>{
                  this.firebase_refdb.ref('posts/reports/unvalidated/' + postid + '/num_grab').set(this.num).then(()=>{
                    this.postTimelineReport(postdata);
                  });
                });
                
              }
              else{
                alertExists.present();
              }
            });
          }
            // this.firebase_refdb.ref('posts/citizen/unvalidated/' + postid + '/num_grab').once('value', data => {
            //   console.log(JSON.stringify(data));
            //   if (!data.val()) {
            //     console.log("NUM1");
            //     loadingValid.dismiss();
                // this.firebase_refdb.ref('posts/reports/'+this.govagency+'/'+postid).set({
                //   name: postdata.name,
                //   date_posted: postdata.dateposted,
                //   userid: postdata.userid,
                //   title: postdata.title,
                //   content: postdata.content,
                //   postId: postdata.postId,
                //   imagepost_url: postdata.imagepost_url,
                //   postedIn : {
                //     pnp: false,
                //     rta: false,
                //     bfp: false,
                //     ndrmmc: false,
                //   },
                //   validatedBy: this.userData.displayName,
                //   lattitude: postdata.lattitude,
                //   longitude: postdata.longitude
                // }).then(()=>{
                //   console.log("NUM2");
                //   var agency = this.govagency;
                //   var obj = { agency : true };
                //   this.firebase_refdb.ref('posts/reports/' + this.govagency + '/' + postid + '/postedIn').once('value',data =>{
                //     if(data.val().agency){

                //     }
                //   })
                //   .update(obj).then(()=>{
                //     console.log("NUM3");
                //     this.firebase_refdb.ref('posts/citizen/unvalidated/' + postid + '/grab_report/' + grabkey + '/num_grab').update(num).then(()=>{
                //       console.log("NUM4");
                //       this.updateCitizenCopyPosts(postdata);
                //     });
                //   });
                // });
            //   }
            //   else {
            //     loadingValid.dismiss();
            //     alertExists.present();
            //   }
            // });
          // }
          // else{
          //   this.firebase_refdb.ref('posts/citizen/unvalidated/'+postid).remove();
          // }
        });
      }
    });
    alertValidate.present();
  }
  postTimelineReport(postdata){
    new Promise((resolve)=>{
      this.firebase_refdb.ref('posts/reports/' + this.govagency + '/' + postdata.postId).set({
        name: postdata.name,
        dateValidated: this.timeFormatPosts(),
        date_posted: postdata.date_posted,
        userid: postdata.userid,
        title: postdata.title,
        content: postdata.content,
        postId: postdata.postId,
        imagepost_url: postdata.imagepost_url,
        validatedBy: this.userData.displayName,
        lattitude: postdata.lattitude,
        longitude: postdata.longitude
      }).then(()=>{
        this.updateCitizenCopyPosts(postdata).then(()=>{
          this.selectAllCitizenReports();
          return resolve();
        });
      });
    });

}
// this will grab copy the owned posts twice

  async updateCitizenCopyPosts(userdata){
    if (this.numPost < 1){
      await this.firebase_refdb.ref('users/citizen/' + userdata.userid + '/reportCopy/' + userdata.postId).update({
        dateValidated: this.timeFormatPosts()
      }).then(() =>{
      ['rta', 'pnp', 'bfp', 'ndrmmc'].forEach(async data => {
        data == this.govagency ? await this.firebase_refdb.ref('users/citizen/' + userdata.userid + '/reportCopy/' + userdata.postId+'/'+data).set(true) : console.log("false"); 
        });
      });
    }
    else if(this.num == 4){
      ['rta', 'pnp', 'bfp', 'ndrmmc'].forEach(async data => {
        data == this.govagency ? await this.firebase_refdb.ref('users/citizen/' + userdata.userid + '/reportCopy/' + userdata.postId + '/' + data).set(true) : console.log("false");
      });
      this.firebase_refdb.ref('posts/reports/unvalidated/' + userdata.postId).remove();
    }
    else{
      ['rta', 'pnp', 'bfp', 'ndrmmc'].forEach(async data => {
        data == this.govagency ? await this.firebase_refdb.ref('users/citizen/' + userdata.userid + '/reportCopy/' + userdata.postId + '/' + data).set(true) : console.log("false");
      });
    }
  }
  public timeFormatPosts() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var _day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var _date = new Date();
    var dateOfTheDay = months[_date.getMonth()] + ' ' + _date.getDate() + ',' + _date.getFullYear();

    let hours: number = _date.getHours();
    let minutes: any = _date.getMinutes();
    let ampm = hours > 12 ? 'pm' : 'am';
    minutes = minutes < 10 ? minutes.toString() : minutes;
    hours = hours > 12 ? hours - 12 : hours;
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'

    minutes = minutes < 10 ? 0 + String(minutes) : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm + ' of ' + dateOfTheDay + ', ' + _day[_date.getDay()];

    return strTime;
  }
}
