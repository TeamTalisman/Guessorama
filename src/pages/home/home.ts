
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';
import { GuessPage } from '../guess/guess';
import { Injectable } from '@angular/core';
import { Player } from '../../providers/player';
import { Prompts } from '../../providers/prompts';
import { SmartAudio } from '../../providers/smart-audio'; 

@Injectable()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedLevel: any;
  levels: Array<{ id: number, title: string, promptId: number, completed: boolean }>
  gameFinished: boolean;

  constructor(public promptsService: Prompts, public player: Player, public smartAudio: SmartAudio, public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController) {
    smartAudio.preload('bloop', 'assets/audio/bloop.mp3');
    smartAudio.preload('ambient', 'assets/audio/ambient.mp3');
    this.smartAudio.preload('fanfare', 'assets/audio/fanfare.mp3');

    this.levels = [];
  }

  ionViewDidLoad() {
    this.smartAudio.play('ambient');
    this.promptsService.loadData();
    this.promptsService.prompt.subscribe((prompts) => {
      prompts.forEach((prompt, index) => {
        this.levels.push({
          id: index,
          title: 'Level ' + (index + 1),
          promptId: prompt.id,
          completed: prompt.completed,
        });
      });
    });
  }

  ionViewDidEnter() {
    this.levels.forEach((level, index) => {
      const promptIndex = level.promptId;
      const completed = this.promptsService.prompts[promptIndex].completed;
      level.completed = completed;
    });

    if (!this.gameFinished) {
      this.checkIfGameEnded();
    }
  }

  onNameTap() {
    let prompt = this.alertCtrl.create({
      title: 'Change Name',
      message: 'Enter your name',
      inputs: [
        {
          name: 'name',
          placeholder: 'Jane Doe'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            return null;
          }
        },
        {
          text: 'Save',
          handler: data => {
            if (data.name.length > 0) {
              this.presentToast('😎 Your name has been updated.', 3000, 'top', true);               
              this.player.changeName(data.name);
            } else {
              this.presentToast('😅 To change your name you need to enter an actual name.', 3000, 'top', true); 
            }
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * levelTapped - Get's a random prompt and sends it to the GuessPage as a param
   * 
   * @param {Object} event
   * @param {Object} level
   */
  levelTapped(event, level) {
    if (level.completed) {
      this.presentToast('You have already completed that level', 3000, 'top', false);
    } else {
      this.smartAudio.play('bloop');
      const newLevel = this.promptsService.prompts[level.promptId];
      this.navCtrl.push(GuessPage, { prompt: newLevel, level: level });
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

  checkIfGameEnded() {
    let isGameFinished = true;
    let prompt = this.alertCtrl.create({
        title: '🎉🎉🎉',
        subTitle: 'Congratulations! You have completed every level!',
        buttons: [{
          text: 'OK',
          handler: () => {
            return null;
          }
        }],
    });

    this.levels.forEach((level) => {
      if (!level.completed) {
        isGameFinished = false;
      }
    });

    if (isGameFinished) {
      this.smartAudio.play('fanfare');
      this.gameFinished = true;
      prompt.present();
    }
  }
}
