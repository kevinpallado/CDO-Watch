import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { SignupPage } from '../signup/signup';
import { TabGovernmentPage } from '../tab-government/tab-government';
import * as firebase from 'firebase';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm: FormGroup;
  errorCodeIdentifier:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public auth: AuthServiceProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder) {

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(){
    let loginLoading = this.loadingCtrl.create();
    loginLoading.setSpinner('circles');
    loginLoading.setContent('Verifying user please wait..');
    let chooseUser = this.alertCtrl.create();
    chooseUser.setTitle('Sign in as ?');
    chooseUser.addInput({
      type: 'radio',
      label: 'Citizen',
      value: 'citizen'
    });
    chooseUser.addInput({
      type: 'radio',
      label: 'BFP',
      value: 'bfp'
    });
    chooseUser.addInput({
      type: 'radio',
      label: 'CDRMMD',
      value: 'ndrmmc'
    });
    chooseUser.addInput({
      type: 'radio',
      label: 'PNP',
      value: 'pnp'
    });
    chooseUser.addInput({
      type: 'radio',
      label: 'RTA',
      value: 'rta'
    });
    chooseUser.addButton('Cancel');
    chooseUser.addButton({
      text: 'Submit',
      handler: data => {
        loginLoading.present();
        if (data === 'citizen' || data === 'bfp' || data === 'ndrmmc' || data === 'pnp' || data === 'rta'){
            this.auth.loginAuthentication(this.loginForm.value.email, this.loginForm.value.password,data).then(data=>{
              loginLoading.dismiss();
              if (data.code === 'auth/user-not-found' || data.code === ' auth/invalid-email' || data.code === 'auth/wrong-password'){
                this.errorCodeIdentifier = data.code;
              }
              else if(data.code == true && !data.userverified){
                this.errorCodeIdentifier = 'not-verified';
                //this.errorCodeIdentifier = false;
                //this.navCtrl.setRoot(TabGovernmentPage);
              }
              else if (data.code == true && data.userverified && data.realtimedatabaseexists){
                this.errorCodeIdentifier = false;
                this.navCtrl.setRoot(TabGovernmentPage);
              }
            });
          }
        }
      });
    chooseUser.present(); 
  }
  loginAuthFunction(){

  }
  register(){
    this.navCtrl.push(SignupPage);
  }
  
  // pushNatId(){
  //   var nationalid = 
  //     {
  //       900000001: false,
  //       900000002: false,
  //       900000003: false,
  //       900000004: false,
  //       900000005: false,
  //       900000006: false,
  //       900000007: false,
  //       900000008: false,
  //       900000009: false,
  //       900000010: false,
  //       900000011: false,
  //       900000012: false,
  //       900000013: false,
  //       900000014: false,
  //       900000015: false,
  //       900000016: false,
  //       900000017: false,
  //       900000018: false,
  //       900000019: false,
  //       900000020: false,
  //       900000021: false,
  //       900000022: false,
  //       900000023: false,
  //       900000024: false,
  //       900000025: false,
  //       900000026: false,
  //       900000027: false,
  //       900000028: false,
  //       900000029: false,
  //       900000030: false,
  //       900000031: false,
  //       900000032: false,
  //       900000033: false,
  //       900000034: false,
  //       900000035: false,
  //       900000036: false,
  //       900000037: false,
  //       900000038: false,
  //       900000039: false,
  //       900000040: false,
  //       900000041: false,
  //       900000042: false,
  //       900000043: false,
  //       900000044: false,
  //       900000045: false,
  //       900000046: false,
  //       900000047: false,
  //       900000048: false,
  //       900000049: false,
  //       900000050: false,
  //     };
  //   firebase.database().ref('national_id/').set(nationalid);
  // }
}
