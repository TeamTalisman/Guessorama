import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';
import { SmartAudio } from '../../providers/smart-audio'; 

@Component({
  selector: 'page-guess',
  templateUrl: 'guess.html'
})
export class GuessPage {
  // GuessPage fields
  prompt: {
    type: String,
    prompt: String,
    completed: Boolean,
    responses: Array<{ points: Number, hint: String, response: String, partialResponse: String, guessed: Boolean }>
  };
  textPrompt = false;
  imgPrompt = false;
  audioPrompt = false;
  levelCompleted: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public smartAudio: SmartAudio, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    smartAudio.preload('correctPing', 'assets/audio/correct.mp3');
    smartAudio.preload('wrongPing', 'assets/audio/incorrect.wav');

    // Preload audio assets
    
    // Get the prompt from the parameters passed from home
    this.prompt = navParams.get('prompt');

    // This is for checking what content we display
    this.imgPrompt = (this.prompt.type === 'image');
    this.textPrompt = (this.prompt.type === 'text');
    this.audioPrompt = (this.prompt.type === 'audio');
  }

  /**
   * textEntered - verifies if the text entered is a response of the prompt
   * 
   * @param {Object} event
   */
  textEntered(event) {
    // Cache the keyCode we are looking for
    const ENTER_KEY_CODE = 13;

    // If key entered was for enter
    if (event.which === ENTER_KEY_CODE) {
      // Create a variable for the correct response and set default value to -1 (incorrect)
      let correctResponse = -1;

      // Get the input in lowercase
      const input = event.target.value.toLowerCase();

      // Loop through the responses
      this.prompt.responses.forEach((response, index) => {
        // If the input value is equal to the response we set correctResponse to index
        correctResponse = (input == response.response) ? index : correctResponse;
      });

      // If the correctResponse is greater than 0
      // it means we got a correct answer
      if (correctResponse >= 0) {
        // Set input to empty again
        event.target.value = '';

        // If already guessed skip the rest
        if (this.prompt.responses[correctResponse].guessed)
          return null;
        
        // Set bool for class to true
        this.prompt.responses[correctResponse].guessed = true;

        // Play audio
        this.smartAudio.play('correctPing');

        // Present toast to alert user the answer was correct
        this.presentToast('Correct Answer!', 3000, 'bottom', true);      

        this.checkIfLevelIsCompleted();
      } else {
        // Play sound
        this.smartAudio.play('wrongPing');
        // Present toast to alert user the answer was incorrect
        this.presentToast('Wrong Answer! Try again.', 3000, 'bottom', true); 
      }
    }
  }

  checkIfLevelIsCompleted() {
    let isLevelFinished = true;
    const alertProps = {
      title: 'Congratulations',
      description: 'You have completed the level!',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.pop();
        }
      }],
    };

    this.prompt.responses.forEach((response) => {
      if (!response.guessed) {
        isLevelFinished = false;
      }
    });

    if (isLevelFinished) {
      this.prompt.completed = true;
      this.presentAlert(alertProps.title, alertProps.description, alertProps.buttons);
    }
  }

  /**
   * presentToast - Presents toast
   * 
   * @param {String} message
   * @param {Number} duration
   * @param {String} position
   * @param {Boolean} interactive
   */
  presentToast(message, duration, position, interactive) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      showCloseButton: interactive
    });

    toast.present();
  }

  /**
   * presentAlert - Presents alert
   * 
   * @param {String} title
   * @param {Number} description
   * @param {Array} button
   */
  presentAlert(title, description, buttons) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: description,
      buttons: buttons,
    });

    alert.present();
  }
}
