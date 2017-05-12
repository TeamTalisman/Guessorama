import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the Prompts provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Prompts {
  prompt: any;
  promptObserver: any;
  prompts: any = [];
  remainingPrompts: any = [];
  currentPrompt: any = {};

  constructor(public http: Http) {
    console.log('Hello Prompts Provider');

    this.promptObserver = null;

    // Create observer
    this.prompt = Observable.create(observer => {
      this.promptObserver = observer;
    });
  }

  /**
   * loadData - loads JSON data containing our prompts
   * 
   */
  loadData() {
    const url = 'assets/data/data.json';
    this.http.get(url)
      .subscribe((res) => {
        this.prompts = this.shuffle(res.json().prompts);
        this.remainingPrompts = this.prompts;
        this.promptObserver.next(this.prompts);
      });
  }

  /**
   * getRandomPrompt() - returns a random prompt
   */
  getRandomPrompt() {
    const promptsLeft = this.remainingPrompts.length;
    // If we have prompts left
    if (promptsLeft > 0) {
      const randomIndex = Math.floor(Math.random() * promptsLeft);
      this.currentPrompt = this.remainingPrompts[randomIndex];
      this.remainingPrompts.splice(randomIndex, 1);
      return this.currentPrompt;
    } else {
      return null;
    }
  }

  shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
  }
}
