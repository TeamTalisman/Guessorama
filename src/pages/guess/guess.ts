import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-guess',
  templateUrl: 'guess.html'
})
export class GuessPage {
  prompt: {
    type: String,
    prompt: String,
    responses: Array<{points: Number, hint: String, response: String, partialResponse: String}>
  };
  textPrompt = false;
  imgPrompt = false;
  audioPrompt = false;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams) {
    this.prompt = navParams.get('prompt');

    this.imgPrompt = (this.prompt.type === 'image');
    this.textPrompt = (this.prompt.type === 'text');
    this.audioPrompt = (this.prompt.type === 'audio');

    console.log(this.prompt);
  }

  textEntered(event) {
    const input = event.target.value.toLowerCase();
    let correctResponse = -1;

    this.prompt.responses.forEach((response, index) => {
      correctResponse = (input == response.response) ? index : correctResponse;
    });

    if (correctResponse >= 0) {
     this.presentToast('Correct Answer!', 3000, 'top', true);
    }
  }

  presentToast(message, duration, position, interactive) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      showCloseButton: interactive
    });

    toast.present();
  }
}
