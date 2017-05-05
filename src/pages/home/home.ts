
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { GuessPage } from '../guess/guess';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // Holds every prompt
  prompts = [];

  // Holds prompts not yet completed
  remainingPrompts = [];

  selectedLevel: any;
  levels: Array<{ id: Number, title: string }>

  constructor( private http: Http, public navCtrl: NavController, public toastCtrl: ToastController) {
    this.levels = [];

    // Make four levels
    for (let i = 0; i < 4; i++) {
      this.levels.push({
        id: i,
        title: 'Level ' + (i + 1),
      });
    }

    // Load JSON data
    this.getData();
  }

  /**
   * getData - gets JSON data containing our prompts
   * 
   */
  getData() {
    const url = 'assets/data/data.json';
    this.http.get(url)
      .subscribe((res) => {
        this.prompts = res.json().prompts
        this.remainingPrompts = this.prompts;
    });
  }

  /**
   * levelTapped - Get's a random prompt and sends it to the GuessPage as a param
   * 
   * @param {Object} event
   * @param {Object} level
   */
  levelTapped(event, level) {
    if (this.remainingPrompts.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.remainingPrompts.length);
      const currentPrompt = this.remainingPrompts[randomIndex];
      // For test purposes let us not remove prompts
      // this.remainingPrompts.splice(randomIndex, 1);
      this.navCtrl.push(GuessPage, { prompt: currentPrompt });
    } else {
      this.presentToast('No prompts left!', 3000, 'top', false);
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
