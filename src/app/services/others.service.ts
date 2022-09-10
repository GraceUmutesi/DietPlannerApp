import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OthersService {

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  recipesFrom: BehaviorSubject<string> = new BehaviorSubject<string>("system_recipes");

  sysRecipes: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  myRecipes: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  selectedMealPlan: BehaviorSubject<any> = new BehaviorSubject<any>({});

  previousUrlArrayString: string[] = [];
  previousUrlString: string = '';

  storage = window.sessionStorage;

  constructor() { 
    const token = this.storage.getItem('token');
    const userData = JSON.parse(this.storage.getItem('user_data'));

    if (token != null && token !== '') {
      this.isLoggedIn.next(true);
    } else {
      this.isLoggedIn.next(false);
    }
  }
}
