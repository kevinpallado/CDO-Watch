import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import * as firebase from 'firebase';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  loginFireAuth = firebase.auth();
  loginFiredatabase = firebase.database();
  loginIdentificationExists:boolean;
  errorCodeIdentifier:any;
  constructor(public events: Events) {
    console.log('Hello AuthServiceProvider Provider');
  }

   loginAuthentication(email:any,password:any,data:any){
     return this.loginFireAuth.signInWithEmailAndPassword(email, password).then(async authData => {
      //  console.log('success', JSON.stringify(authData)); // get UID from authData
       var login:any;
        if (authData.uid) {
          sessionStorage.setItem('userid',authData.uid);
          if (data == 'citizen') {
            // await this.searchuserCitizen(counter,authData.uid);
            await this.checkRealTimeDatabase(1, authData.uid, null).then(() => {
              login = { code: true, userverified: this.loginFireAuth.currentUser.emailVerified, realtimedatabaseexists: this.loginIdentificationExists };
            }).catch(e => login = { code: e });
          }
          else if (data === 'bfp' || data === 'ndrmmc' || data === 'pnp' || data === 'rta') {
            // await this.searchuserGovernment(counter,authData.uid);
            await this.checkRealTimeDatabase(2, authData.uid, data).then(()=>{
              login = { code: true, userverified: this.loginFireAuth.currentUser.emailVerified, realtimedatabaseexists: this.loginIdentificationExists };
            }).catch(e => login = { code: e });
            
          }
        }
        return login;
        }).catch((error)=> {
          this.errorCodeIdentifier = error.code;
          var errorMessage = error.message;
          console.log("authservice error code : " + this.errorCodeIdentifier + " errorMessage : " + errorMessage);
          return error;
        });
  }

  checkRealTimeDatabase(numIdentifier: any, uid, gov){
    if(numIdentifier == 1){
      return new Promise((resolve, reject) => {
        return this.loginFiredatabase.ref('users/citizen/' + uid).on('value', (snapshot) => {
          if (snapshot.exists()) {
            console.log("SNAPSHOT =>",JSON.stringify(snapshot));
            sessionStorage.setItem('realtime_data', JSON.stringify(snapshot));
            sessionStorage.setItem('user_identifier','citizen');
            this.loginIdentificationExists = true;
            this.subscribeInfo(snapshot.val().idnumber,snapshot.val().fullname,snapshot.val().email,'citizen');
            return resolve();
          }
          else {
            this.loginIdentificationExists = false;
            return reject('auth/user-not-found');
          }
        });
      });
    }
    else{
      return new Promise((resolve, reject) => {
      return this.loginFiredatabase.ref('users/government/' + gov + '/' + uid).on('value', (snapshot) => { // authdata.uid is the id of the user
        if (snapshot.exists()) {
          this.loginIdentificationExists = true;
          console.log("SNAPSHOT =>", JSON.stringify(snapshot));
          sessionStorage.setItem('realtime_data', JSON.stringify(snapshot));
          sessionStorage.setItem('user_identifier', 'government');
          this.subscribeInfo(snapshot.val().idnumber, snapshot.val().displayName, snapshot.val().email, 'government');
          return resolve();
        }
        else {
          this.loginIdentificationExists = false;
          return reject('auth/user-not-found');
        }
      });
      });
    }
  }
  subscribeInfo(nat_id,displayname,email,identifier){
    console.log("subscribe info => ", nat_id, displayname, email, identifier);
    this.events.publish('user:login', nat_id,displayname,email,identifier);
  }

  signOut(){
    return new Promise((resolve,reject) =>  {
      this.loginFireAuth.signOut().then(()=>{
        return resolve('success');
      }).catch(e =>{
        return reject(e);
      });
    });
  }
}
