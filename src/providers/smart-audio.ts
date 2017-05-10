import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
 
@Injectable()
export class SmartAudio {
 
  audioType: string = 'html5';
  sounds: any = [];

  constructor(public nativeAudio: NativeAudio, platform: Platform) {
    // Set audio type depending on platform
    this.audioType = (platform.is('cordova')) ? 'native' : 'html5';
  }
 
  preload(key, asset) {
    // Create audio object
    const audio = {
      key: key,
      asset: (this.audioType === 'html5') ? 'html5' : 'native',
      type: this.audioType
    };

    // If native platform
    if (this.audioType === 'native') {
      // Preload with native
      this.nativeAudio.preloadSimple(key, asset);
    }

    // Push audio to sounds array
    this.sounds.push(audio);
  }

  play(key){
    // Find thr audio in the sounds array using its key
    let audio = this.sounds.find((sound) => {
        return sound.key === key;
    });

    // If HTML5
    if(audio.type === 'html5'){
      // Create audio asset
      let audioAsset = new Audio(audio.asset);
      // Play audio asset
      audioAsset.play();
    } else {
      // Otherwise if native
      // Create promise to play audio
      this.nativeAudio.play(audio.asset).then((res) => {
          console.log(res);
      }, (err) => {
          console.log(err);
      });
    }
  }
}