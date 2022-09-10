import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NewRecipeComponent } from '../new-recipe/new-recipe.component';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {

  isLoading = false;
  recipeCategories = [];
  recipes = [];

  activatedCategoryId = '';

  recipesFrom: string = '';
  rangePrice: string = '';
  searchQuery: string = '';

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _others: OthersService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.recipesFrom = this._others.recipesFrom.getValue();
    this.smoothScrollToTop();
    this.getCategories();
    this.getRecipes();
  }

  goToRecipes(recipeId: string) {
    this._router.navigate(['recipe/', recipeId]);
  }

  smoothScrollToTop(): void {
    const element: HTMLElement = document.getElementById("body")!;
      setTimeout(() => {
        element?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }, 1);
  }

  getCategories() {
    this.isLoading = true;
    this._others.isLoading.next(true);
    this._api.getRequest('recipe-types').subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.recipeCategories = response
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  getRecipes() {
    console.log(this.searchQuery);
    this.isLoading = true;
    this._others.isLoading.next(true);
    this.activatedCategoryId = '';

    let url: string;
    if (this.recipesFrom == 'my_recipes') {
      url =  `recipes?created_by=${this._api.userData.id}&&search=${this.searchQuery}`;
    } else {
      switch (this.rangePrice) {
        case 'less_1000':
          url = `recipes?created_by__is_staff=True&&max_price=1000&&search=${this.searchQuery}`;
          break;

        case '1000_3000':
          url = `recipes?created_by__is_staff=True&&min_price=1001&max_price=3000&&search=${this.searchQuery}`;
          break;

        case '3000_5000':
          url = `recipes?created_by__is_staff=True&&min_price=3001&max_price=5000&&search=${this.searchQuery}`;
          break;

        case '5000_10000':
          url = `recipes?created_by__is_staff=True&&min_price=5001&max_price=10000&&search=${this.searchQuery}`;
          break;

        case '10001_15000':
          url = `recipes?created_by__is_staff=True&&min_price=10001&max_price=15000&&search=${this.searchQuery}`;
          break;

        case 'above_15000':
          url = `recipes?created_by__is_staff=True&&min_price=150001&&search=${this.searchQuery}`;
          break;
        
        default:
          url = `recipes?created_by__is_staff=True&&search=${this.searchQuery}`;
          break;
      }
    }

    this._api.getRequest(url).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.recipes = response['results'];
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  getRecipesInCategory(categoryId: string) {
    this.isLoading = true;
    this._others.isLoading.next(true);
    this.activatedCategoryId = categoryId;

    let url: string;
    if (this.recipesFrom == 'my_recipes') {
      url =  `recipes?created_by=${this._api.userData.id}&&recipe_type=${categoryId}&&search=${this.searchQuery}`;
    } else {
      switch (this.rangePrice) {
        case 'less_1000':
          url = `recipes?created_by__is_staff=True&&recipe_type=${categoryId}&&max_price=1000&&search=${this.searchQuery}`;
          break;

        case '1000_3000':
          url = `recipes?created_by__is_staff=True&&recipe_type=${categoryId}&&min_price=1001&max_price=3000&&search=${this.searchQuery}`;
          break;

        case '3000_5000':
          url = `recipes?created_by__is_staff=True&&recipe_type=${categoryId}&&min_price=3001&max_price=5000&&search=${this.searchQuery}`;
          break;

        case '5000_10000':
          url = `recipes?created_by__is_staff=True&&recipe_type=${categoryId}&&min_price=5001&max_price=10000&&search=${this.searchQuery}`;
          break;

        case '10001_15000':
          url = `recipes?created_by__is_staff=True&&recipe_type=${categoryId}&&min_price=10001&max_price=15000&&search=${this.searchQuery}`;
          break;

        case 'above_15000':
          url = `recipes?created_by__is_staff=True&&recipe_type=${categoryId}&&min_price=150001&&search=${this.searchQuery}`;
          break;
        
        default:
          url = `recipes?created_by__is_staff=True&&recipe_type=${categoryId}&&search=${this.searchQuery}`;
          break;
      }
    }

    this._api.getRequest(url).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.recipes = [];
      this.recipes = response['results'];
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  changeRecipesFrom(event: any) {
    this.recipesFrom = event;
    this._others.recipesFrom.next(event);
    if (this._others.isLoggedIn.getValue()) {
      this.getRecipes();
    } else {
      this._router.navigate(['login']);
    }
  }

  changeRangePrice(event: any) {
    this.rangePrice = event;
    this.getRecipes();
  }

  searchRecipes(event: string) {
    if (event == '') {
      this.getRecipes();
    }
  }

  addNewRecipe() {
    this._router.navigate(['new-recipe']);
  }
  
}
