import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { SignupServiceProvider } from '../../providers/signup-service/signup-service';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  registerForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public signupProvider: SignupServiceProvider,
    public navParams: NavParams) {
      
    this.registerForm = this.formBuilder.group({
      idnumber: ['', Validators.required],
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      repassword: ['', Validators.required],
      phonenumber: ['', Validators.required]},
      { validator: SignupPage.passwordsMatch });
  }

  static passwordsMatch(cg: FormGroup): { [err: string]: any } {
    let pwd1 = cg.get('password');
    let pwd2 = cg.get('repassword');
    let rv: { [error: string]: any } = {};
    if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
      rv['passwordMismatch'] = true;
    }
    return rv;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  register(){
    console.log(JSON.stringify(this.registerForm.value));
    this.signupProvider.signUpUser(this.registerForm.value).then(()=>{
      this.viewCtrl.dismiss();
    });
  }
  login(){
    this.navCtrl.pop();
  }
}
