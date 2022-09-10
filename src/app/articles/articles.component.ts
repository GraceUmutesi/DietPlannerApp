import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {

  isLoading = false;
  articles = [];

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _others: OthersService,
  ) { }

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles() {
    this.isLoading = true;
    this._others.isLoading.next(true);

    this._api.getRequest(`articles?ordering=-created_at`).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.articles = response['results'];
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  goToArticle(articleId: string) {
    this._router.navigate(['article/', articleId]);
  }

}
