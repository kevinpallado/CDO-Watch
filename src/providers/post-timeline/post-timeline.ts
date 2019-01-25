// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
/*
  Generated class for the PostTimelineProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostTimelineProvider {
  firebaseRef:any;
  citizenPosts:any;
  storageRef:any;
  arrlength:any;
  notif:any;
  constructor() {
    this.firebaseRef = firebase.database();
    this.storageRef = firebase.storage().ref();

  }
  SnapshotToArray = snapshot =>{ // converts JSON to array
    let _posts: any = [];
    snapshot.forEach(childSnapshot => {
      // this.pnp_posts_title.push(childSnapshot.val().title);

      let item = childSnapshot.val();
      console.log("value rta: " + childSnapshot.val().imagepost_url);
        this.storageRef.child('reports/' + childSnapshot.val().imagepost_url + '.jpg').getDownloadURL().then(url => {
          item.imagepost_url = url;
        }).catch(error => {
          //console.log(JSON.stringify(error));
        });
        _posts.push(item);
      });
      // console.log(childSnapshot.val());
    return _posts;
  }

  selectCitizenReports(){
    return new Promise ((resolve,reject) => {
      return this.firebaseRef.ref('posts/reports/unvalidated').on('value', data => {
        if (data) {
          this.citizenPosts = [];
          this.citizenPosts = this.SnapshotToArray(data);
          this.arrlength = this.citizenPosts.length;
          return resolve(this.arrlength);
        }
        else {
          return reject();
        }
      });
    });
  }
}
