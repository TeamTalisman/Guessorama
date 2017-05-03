import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  selectedLevel: any;
  levels: Array<{ id: Number, title: string }>

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {
    this.levels = [];

    for (let i = 0; i < 4; i++) {
      this.levels.push({
        id: i,
        title: 'Level ' + (i + 1),
      });
    }
  }

  levelTapped(event, level) {
    // this.navCtrl.push(NAME_OF_PAGE, {NAV PARAMS});
    this.presentToast(level.title + ' was tapped!', 3000, 'top', false);
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
