import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
/*
  Generated class for the FirebaseCrudProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseCrudProvider {

  databaseRef: any = firebase.database();
  storageRef: any = firebase.storage().ref();
  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  }

  removefunc(copyPostId, userUid, govAgency, govOfficial){
    return new Promise((resolve,reject) =>{
      let loading = this.loadingCtrl.create();
      loading.setSpinner('bubbles');
      loading.setContent('Deleting...');
      let confirmDelete = this.alertCtrl.create();
      confirmDelete.setTitle('Confirm Delete');
      confirmDelete.setMessage('Are you sure to delete this posts?');
      confirmDelete.addButton('Cancel');
      confirmDelete.addButton({
        text: 'Confirm',
        handler: () => {
          loading.present();
          if (govOfficial) {
            this.databaseRef.ref('users/government/' + govAgency + '/' + userUid + '/reportCopy/' + copyPostId).remove().then(data => {
              if (!data) {
                this.databaseRef.ref('posts/reports/' + govAgency + '/' + copyPostId).remove().then(data => {
                  if (!data) {
                    this.storageRef.child('reports/' + copyPostId + '.jpg').delete().then(data => {
                      loading.dismiss();
                      return resolve(data);
                    }).catch(e => { console.log('1',e.message); return reject(e) });
                  }
                }).catch(e => { console.log('2', e.message); return reject(e) });
              }
            }).catch(e => { console.log('3', e.message); return reject(e) });
          }
          else {
            this.databaseRef.ref('users/citizen/' + userUid + '/reportCopy/' + copyPostId).remove().then(data => {
              if (!data) {
                if (govAgency == 'unvalidated') {
                  this.databaseRef.ref('posts/citizen/' + govAgency + '/' + copyPostId).remove().then(data => {
                    if (!data) {
                      this.storageRef.child('reports/' + copyPostId + '.jpg').delete().then(data => {
                        return resolve(data);
                      }).catch(e => { console.log('4', e.message); return reject(e) });
                    }
                  }).catch(e => { console.log('5', e.message); return reject(e) });
                }
                else {
                  this.databaseRef.ref('posts/reports/' + govAgency + '/' + copyPostId).remove().then(data => {
                    if (!data) {
                      this.storageRef.child('reports/' + copyPostId + '.jpg').delete().then(data => {
                        loading.dismiss();
                        return resolve(data);
                      }).catch(e => { console.log('6', e.message); return reject(e) });
                    }
                  }).catch(e => { console.log('7', e.message); return reject(e) });
                }
              }
            }).catch(e => { console.log('8', e.message); return reject(e) });
          }
        }
      });
    confirmDelete.present();
    });
  }
}
