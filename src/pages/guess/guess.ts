import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';
import { SmartAudio } from '../../providers/smart-audio'; 
import { Player } from '../../providers/player';

@Component({
  selector: 'page-guess',
  templateUrl: 'guess.html'
})
export class GuessPage {
  // GuessPage fields
  prompt: {
    type: string,
    prompt: string,
    completed: boolean,
    viewed: boolean,
    responses: Array<{ points: number, hint: string, response: string, partialResponse: string, guessed: boolean }>
  };
  title: string;
  textPrompt = false;
  imgPrompt = false;
  audioPrompt = false;
  levelCompleted: Boolean;
  timerDuration = 45000;
  timer: any;
  timerRunning: boolean;
  hint: string;
  evenResponses: boolean;

  constructor(public player: Player, public navCtrl: NavController, public navParams: NavParams, public smartAudio: SmartAudio, public alertCtrl: AlertController, public toastCtrl: ToastController) {    
    // Get the prompt from the parameters passed from home
    this.prompt = navParams.get('prompt');
    this.title = navParams.get('level').title;
    this.evenResponses = this.prompt.responses.length % 2 === 0;
  }

  ionViewDidLoad() {
    // Preload audio assets
    this.smartAudio.preload('timer', 'assets/audio/timer.mp3');
    this.smartAudio.preload('fanfare', 'assets/audio/fanfare.mp3');
    this.smartAudio.preload('correctPing', 'assets/audio/correct.mp3');
    this.smartAudio.preload('wrongPing', 'assets/audio/incorrect.wav');
    this.hint = 'Can\'t guess one of the responses? Tap on a response box to purchase a Hint.';

    if (!this.prompt.viewed) {
      this.timer = setTimeout(() => { this.stopTimer(true); }, this.timerDuration);
      this.timerRunning = true;
    }
  
    // This is for checking what content we display
    this.imgPrompt = (this.prompt.type === 'image');
    this.textPrompt = (this.prompt.type === 'text');
    this.audioPrompt = (this.prompt.type === 'audio');
    this.prompt.viewed = true;
  }

  ionViewWillLeave() {
    this.stopTimer(false);
  }

  stopTimer(showToast) {
    this.timerRunning = false;
    clearTimeout(this.timer);
    if (showToast) {
      this.presentToast('Stuck? Tap on a guess box to get a hint!', 5000, 'bottom', true); 
    }
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

        // If timer was running
        this.player.addCoins(this.prompt.responses[correctResponse].points, this.timerRunning);

        // Play audio
        this.smartAudio.play('correctPing');
        const message = (this.timerRunning) ? 'Correct Answer! You receive bonus points!' : 'Correct Answer!';
        // Present toast to alert user the answer was correct
        this.presentToast(message, 3000, 'bottom', true);      

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
      this.smartAudio.play('fanfare');
      this.presentAlert(alertProps.title, alertProps.description, alertProps.buttons);
    }
  }

  cardTapped(event, response) {
    if (response.guessed) return null;

    const poorProps = {
      title: 'Not enough coins!',
      description: 'You don\'t have enough coins to purchase this hint.',
      buttons: [{
        text: 'OK 🙁',
        handler: () => {
          return null;
        }
      }],
    };

    const alertProps = {
      title: 'Purchase Hint',
      description: 'If you need help guessing this answer you can get a hint. For 50 coins you can get a descriptive blurb. For 100 coins you\'ll see parts of the answer.',
      buttons: [{
        text: 'Blurb: 50 coins',
        handler: () => {
          if (this.player.coins > 50) {
            this.player.spendCoins(50);
            this.hint = response.hint;
          } else {
            this.presentAlert(poorProps.title, poorProps.description, poorProps.buttons);
          }
        }
      }, {
        text: 'Partial Answer: 100 coins',
        handler: () => {
          if (this.player.coins > 100) {
            this.player.spendCoins(100);
            this.hint = response.partialResponse;
          } else {
            this.presentAlert(poorProps.title, poorProps.description, poorProps.buttons);
          }
        }
      }, {
        text: 'Cancel',
        handler: () => {
          return null;
        }
      }]
    };

    this.presentAlert(alertProps.title, alertProps.description, alertProps.buttons);
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
