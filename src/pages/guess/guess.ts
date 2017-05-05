import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-guess',
  templateUrl: 'guess.html'
})
export class GuessPage {
  selectedPrompt: any;
  prompt: Object

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams) {
    console.log(navParams.get('item'));
  }
}
