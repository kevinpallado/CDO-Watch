import { Injectable } from '@angular/core';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
/*
  Generated class for the SignupServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SignupServiceProvider {
  fireAuth:any;
  firedb:any;
  citizenProfile:any;

  constructor(private loadingCtrl: LoadingController, public toastCtrl: ToastController,public alertCtrl: AlertController) {
    this.fireAuth = firebase.auth();
    this.firedb = firebase.database();
    this.citizenProfile = firebase.database().ref('users/citizen');
  }
  signUpUser(info: {}){
    let loadingSignup = this.loadingCtrl.create();
    loadingSignup.setContent('Checking user info ..');
    loadingSignup.setSpinner('bubbles');
    let toastSuccess = this.toastCtrl.create();
    toastSuccess.setMessage('Email sent Please verify user');
    toastSuccess.setPosition('middle');
    toastSuccess.setDuration(3000);
    let alertSucessRegister = this.alertCtrl.create();
    alertSucessRegister.setTitle('Notice');
    alertSucessRegister.setMessage('Successfully Register! You only have one step to become a netizen reporter!');
    alertSucessRegister.addButton('Thanks');
    let alertInvalidNationalId = this.alertCtrl.create();
    alertInvalidNationalId.setTitle('Warning');
    alertInvalidNationalId.setMessage('Please re-check your id number');
    alertInvalidNationalId.addButton('Okay');
    loadingSignup.present();
    let alreadyTakenId = this.alertCtrl.create();
    alreadyTakenId.setTitle('Warning');
    alreadyTakenId.setMessage('Your ID is already taken. Please provide another');
    alreadyTakenId.addButton('Okay');
    return new Promise((resolve)=> {
      this.firedb.ref('national_id/' + info['idnumber']).once('value', (snapshot) => {
        // console.log(" SNAP SHOT VALUE "+snapshot.val()+"EXISTS " +snapshot.exists());
        if (snapshot.exists()) {
          if (!snapshot.val()){
            this.firedb.ref('national_id/' + info['idnumber']).set(true).then(()=>{
              loadingSignup.dismiss();
              loadingSignup.onDidDismiss(() => {
                this.fireAuth.createUserWithEmailAndPassword(info['email'], info['password']).then((user) => {
                  // console.log(user);
                  alertSucessRegister.present();
                  alertSucessRegister.onDidDismiss(() => {
                    user.sendEmailVerification().then(() => {
                      // console.log('email sent');
                      toastSuccess.present();
                      this.citizenProfile.child(user.uid).set(info);
                      user.updateProfile({
                        displayName: info['displayName']
                      });
                      return resolve();
                    }).catch(e => { console.log(e); });
                  });
                }).catch(e => {
                  console.log(e);
                });
              });
            }).catch(e => console.log(JSON.stringify(e)));
          }
          else{
            // console.log("FALSE already taken");
            loadingSignup.dismiss();
            loadingSignup.onDidDismiss(() => {
              alreadyTakenId.present();
            });
          }

        }
        else {
          loadingSignup.dismiss();
          loadingSignup.onDidDismiss(() => {
            alertInvalidNationalId.present();
          });
        }
      });
    });
  }
}
