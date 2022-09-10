import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number = new Date().getFullYear();
  contacts: any = [
    {
      country: "Rwanda",
      city: "Kigali",
      address: "KK 01 st",
      phone_number: "+250 780 000 000",
      email: "info@dietplanner.rw"
    }
  ];
  logoPath: string = "";

  constructor(
    private _router: Router,
  ) { }

  ngOnInit(): void {
  }

  smoothScrollToPageSection(routeName: string, elementID: string): void {
    this._router.navigate([`/${routeName}`]).then(() => {
      const element: HTMLElement = document.getElementById(elementID)!;
      setTimeout(() => {
        element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }, 1);
    })
  }

}
