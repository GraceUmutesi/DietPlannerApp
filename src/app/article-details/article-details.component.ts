import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss']
})
export class ArticleDetailsComponent implements OnInit {

  isLoading = false;
  otherArticles = [];
  articleId: string = '';
  article: any;

  articleText: HTMLElement;

  @ViewChild('articleContentText') articleContentText: ElementRef;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _api: ApiService,
    private _others: OthersService
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.articleId = params.article_id;
      this.loadArticleDetails();
      this.getOtherArticles();
    });
  }

  loadArticleDetails() {
    this.isLoading = true;
    this._others.isLoading.next(true);
    this._api.getRequest(`articles/${this.articleId}`).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.article = response;
      this.articleText = this.stringToHTML(response['content']);
      this.articleTextInjector(this.articleText);
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }
  stringToHTML(str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(str, 'text/html');
    return doc.body;
  }

  articleTextInjector(articleTextHTMLElement: HTMLElement) {
    // const elem = document.getElementById('article-text');
    this.articleContentText.nativeElement.appendChild(articleTextHTMLElement);
  }

  getOtherArticles() {
    this.isLoading = true;
    this._api.getRequest('articles').subscribe((response: any) => {
      this.isLoading = false;
      this.otherArticles = response['results'];
    }, (error: any) => {
      this.isLoading = false;
      console.log(error);
    });
  }

  goToArticle(articleId: string) {
    this._router.navigate(['article/', articleId]);
  }

}
