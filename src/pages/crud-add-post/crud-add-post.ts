import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, LoadingController } from 'ionic-angular';

import { DeveloperProvider } from '../../providers/developer/developer';
import { Geolocation } from '@ionic-native/geolocation';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
/**
 * Generated class for the CrudAddPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-crud-add-post',
  templateUrl: 'crud-add-post.html',
})
export class CrudAddPostPage {
  
  ref_storage = firebase.storage().ref();
  ref_realtime_db = firebase.database();
  ref_put_param = firebase.storage.StringFormat.DATA_URL;

  photo:any;
  identifier:any;
  userdata:any;
  dateToday:any;
  userid:any;

  choicesPosts:boolean = true;
  createPosts:boolean = false;
  generatePosts:boolean = false;
  generateLists:boolean = false;
  // listsAgency: boolean = false;

  savingloading:any;
  generatedLists:any = [];
  _agency:any;

  title:any;
  content:any

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private actionSheetCtrl: ActionSheetController,
    private camera : Camera,
    public dp : DeveloperProvider,
    private imgPicker: ImagePicker) {
    this.identifier = sessionStorage.getItem('user_identifier');
    var userinfo = sessionStorage.getItem('realtime_data');
    this.userid = sessionStorage.getItem('userid');
    this.userdata = JSON.parse(userinfo);
    this.generateListsReports();
  }
  generateListsReports(){
    this.generatedLists = this.dp.listDetails();
  }
  submitReport(title,content){
    let gpsloading = this.loadingCtrl.create();
    gpsloading.setContent('Getting your location ..');
    gpsloading.setSpinner('bubbles');
    this.savingloading = this.loadingCtrl.create();
    this.savingloading.setContent('Saving post information ..');
    this.savingloading.setSpinner('bubbles');
    let alertNotice = this.alertCtrl.create();
    alertNotice.setTitle('Notice');
    alertNotice.setMessage('Do you already check your posts?');
    alertNotice.addButton('No');
    alertNotice.addButton({
      text: 'Yes',
      handler: () =>{
        if (title.length > 0 && content.length > 0 && this.photo) {
          gpsloading.present();
          this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(data => {
            gpsloading.dismiss();
            this.savingloading.present();
            if (this.userdata.gov_official) {
              var newreport = this.ref_realtime_db.ref('posts/reports/' + this.userdata.gov_agency).push();
              var newreportkey = newreport.key;
              this.ref_storage.child('reports/' + newreportkey + '.jpg').putString(this.photo, this.ref_put_param).then(data => data.ref.getDownloadURL()).then(url => {
                newreport.set({
                  name: this.userdata.displayName,
                  date_posted: this.toPeriodFormat(),
                  editedOn: this.toPeriodFormat(),
                  userid: this.userid,
                  title: title,
                  content: content,
                  government_agency: this.userdata.gov_agency,
                  imagepost_url: url,
                  postId: newreportkey,
                  postedIn: this.userdata.gov_agency,
                  gov_official: this.userdata.gov_official,
                  lattitude: data.coords.latitude,
                  longitude: data.coords.longitude
                });
                this.getCopyOfPosts(title, content, this.userdata.gov_official, this.userdata.gov_agency, newreportkey, data.coords.latitude, data.coords.longitude, url);
              }).catch(e => console.log(JSON.stringify(e)));
            }
            else {
              var citizenreport = this.ref_realtime_db.ref('posts/reports/unvalidated').push();
              
              // var verifier = this.ref_realtime_db.ref('posts/citizen/unvalidated/' + citizenreport.key+'/grab_report').push();
              var citizenimage = citizenreport.key;
              this.ref_storage.child('reports/' + citizenimage + '.jpg').putString(this.photo, this.ref_put_param).then(data => data.ref.getDownloadURL()).then(url => {
                citizenreport.set({
                  name: this.userdata.fullname,
                  phonenumber: this.userdata.phonenumber,
                  date_posted: this.toPeriodFormat(),
                  editedOn: this.toPeriodFormat(),
                  dateValidated: this.toPeriodFormat(),
                  userid: this.userid,
                  title: title,
                  content: content,
                  imagepost_url: url,
                  postId: citizenimage,
                  postedIn: "unvalidated",
                  gov_official: false,
                  lattitude: data.coords.latitude,
                  longitude: data.coords.longitude,
                  // grabkey: verifier.key,
                  num_grab: 0
                });
                new Promise((resolve) => {
                  ['rta', 'pnp', 'bfp', 'ndrmmc'].forEach(async data => {
                    await this.ref_realtime_db.ref('posts/reports/unvalidated/' + citizenreport.key + '/' + data).set(false);
                  });
                  return resolve();
                }).then(() => {
                  this.getCopyOfPosts(title, content, false, '', citizenimage, data.coords.latitude, data.coords.longitude, url);
                });
                // verifier.set({
                //   num_grab: 0,
                //   pnp: false,
                //   rta: false,
                //   ndrmmc: false,
                //   bfp: false
                // }).then(() =>{
                //   this.getCopyOfPosts(title, content, false, '', citizenimage, data.coords.latitude, data.coords.longitude);
                // });
              }).catch(e => { alert(e + Object.getOwnPropertyNames(e)); this.savingloading.dismiss(); });
            }
          }).catch(error => {
            alert("error getting location =>" + error);
          });
        }
        else {
          alert("Please complete your report");
        }
      }
    });
    alertNotice.present();
  }
  choose(title,shortitle){
    this.generateLists = true;
    this.title = title;
    this.content = "A " + shortitle + " happen at around " + this.timeFormatPosts()+".";
  }
  createPostsfunc(num:any){
    if(num == 1){
      this.choicesPosts = false;
      this.createPosts = true;
    }
    else{
      this.choicesPosts = false;
      this.generatePosts = true;
    }
  }
  pickImage(){
    this.imgPicker.getPictures({ maximumImagesCount: 10 }).then(result =>{
      for (var i = 0; i < result.length; i++) {
        alert('Image URI: ' + result[i]);
      }

    }).catch(e => alert(e));
  }
  captureImage(){
    const options: CameraOptions = {
      quality: 60,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData)=>{
      this.photo = 'data:image/jpeg;base64,' + imageData;
    }).catch(e => console.log(JSON.stringify(e)));
  }
  getImage(){
    let actionSheet = this.actionSheetCtrl.create();
    actionSheet.setTitle('Choose Action');
    actionSheet.addButton({
      text: 'Take a Picture',
      handler: () =>{
        this.captureImage();
      }
    });
    // actionSheet.addButton({
    //   text: 'Choose Pictures',
    //   handler: ()=>{
    //     this.pickImage();
    //   }
    // });
    actionSheet.present();
  }
  // addPost(){
  //   this.dateToday = this.toPeriodFormat();
  //   if (this.userdata.gov_official){
  //     var reportkey = this.ref_realtime_db.ref('posts/reports/' + this.userdata.gov_agency).push();
  //     var reportId = reportkey.key;
  //     reportkey.set({
  //       name: this.userdata.displayName,
  //       date_posted: this.dateToday,
  //       userid: this.userid,
  //       // title: values.title,
  //       // content: values.content,
  //       government_agency: this.userdata.gov_agency,
  //       imagepost_url: reportId,
  //       postId: reportId,
  //       postedIn: this.userdata.gov_agency,
  //       gov_official: this.userdata.gov_official,
  //       // lattitude: resp.coords.latitude,
  //       // longitude: resp.coords.longitude
  //     });
  //   }
  // }

  getCopyOfPosts(title,content,official,agency,postid,lattitude,longitude,url){
    if(official){
      var officer_report = this.ref_realtime_db.ref('users/government/' + agency + '/' + this.userid + '/reportCopy/' + postid);
      officer_report.set({
        name: this.userdata.displayName,
        date_posted: this.toPeriodFormat(),
        editedOn: this.toPeriodFormat(),
        dateValidated: this.toPeriodFormat(),
        userid: this.userid,
        title: title,
        content: content,
        government_agency: this.userdata.gov_agency,
        imagepost_url: url,
        postId: postid,
        postedIn: this.userdata.gov_agency,
        gov_official: this.userdata.gov_official,
        lattitude: lattitude,
        longitude: longitude
      }).then(()=>{
        this.navCtrl.pop();
        this.savingloading.dismiss();
      }, err => { console.log(err); });
    }
    else{
      var citizen_report = this.ref_realtime_db.ref('users/citizen/'+this.userid+'/reportCopy/'+postid);
      citizen_report.set({
        name: this.userdata.fullname,
        date_posted: this.toPeriodFormat(),
        editedOn: this.toPeriodFormat(),
        dateValidated: this.toPeriodFormat(),
        userid: this.userid,
        title: title,
        content: content,
        imagepost_url: url,
        postId: postid,
        postedIn: "unvalidated",
        gov_official: false,
        latitude: lattitude,
        longitude: longitude
      }).then(() => {
        this.navCtrl.pop();
        this.savingloading.dismiss();
      }, err => { console.log(err); });
    }
    
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
  public timeFormatPosts() {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var _day = ["Sunday", "Monday", "Tuesday", "Wednesday" ,"Thursday" ,"Friday" ,"Saturday"];
    var _date = new Date();
    var dateOfTheDay = months[_date.getMonth()] + ' ' + _date.getDate() + ',' + _date.getFullYear();

    let hours: number = _date.getHours();
    let minutes: any = _date.getMinutes();
    let ampm = hours > 12 ? 'pm' : 'am';
    minutes= minutes < 10 ? minutes.toString() : minutes;
    hours = hours > 12 ? hours - 12 : hours;
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'

    minutes = minutes < 10 ? 0 + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm + ' of ' + dateOfTheDay + ', ' + _day[_date.getDay()];

    return strTime;
  }
}
