import { Platform } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  phoneMenuOpened: boolean = false;
  isLoading: boolean = false;

  logoPath: string = "../../assets/img/Your meal planner white.png";

  viewProfile: boolean = false;
  isLoggedIn: boolean = false;
  userData: any;

  storage = window.sessionStorage;

  constructor(
    private _router: Router,
    public platform: Platform,
    private _api: ApiService,
    private _others: OthersService
  ) { }

  ngOnInit(): void {
    this._others.isLoading.subscribe(status => {
      this.isLoading = status;
    });
    this._others.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;

      if (this.isLoggedIn) {
        this.userData = this._api.userData;
      }
    });
  }

  toggleMobileMenu() {
    this.phoneMenuOpened = !this.phoneMenuOpened;
  }

  smoothScrollToHomeSection(elementID: string): void {
    this._router.navigate(['/home']).then(() => {
      const element: HTMLElement = document.getElementById(elementID)!;
      // Timeout fixes issues when routing from another route to /home
      setTimeout(() => {
        element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }, 1);
    })
  }

  logout(): void{
    window.sessionStorage.clear();
    this._others.isLoggedIn.next(false);
    window.location.reload();
  }

}
