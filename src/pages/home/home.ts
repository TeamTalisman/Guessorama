
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { GuessPage } from '../guess/guess';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';
import { Prompts } from '../../providers/prompts';

@Injectable()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  selectedLevel: any;
  levels: Array<{ id: number, title: string, promptId: number, completed: boolean }>

  constructor(public promptsService: Prompts, private http: Http, public navCtrl: NavController, public toastCtrl: ToastController) {
    this.levels = [];
  }

  ionViewDidLoad() {
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
      const newLevel = this.promptsService.prompts[level.promptId];
      this.navCtrl.push(GuessPage, { prompt: newLevel });
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
}
