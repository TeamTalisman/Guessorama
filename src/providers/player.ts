import { Injectable } from '@angular/core';

@Injectable()
export class Player {
  name: string;
  coins: number;

  constructor() {
    this.coins = 0;
    this.name = 'You';
  }

  changeName(name) {
    // If name is not empty string
    if (name.length > 0) {
      // Set playe name to name
      this.name = name;
    }
  }

  addCoins(points, bonus) {
    // If bonus points make multiplier 150% otherwise keep it 100%
    const multiplier = (bonus) ? 1.5 : 1;

    // Calculate amount of coins to give
    const amount = points * multiplier; 

    // Add coins
    this.coins += amount; 
  }

  spendCoins(amount) {
    // Subtract coins from player
    this.coins -= amount;
  }
}