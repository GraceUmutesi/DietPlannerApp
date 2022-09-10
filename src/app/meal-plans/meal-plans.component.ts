import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-meal-plans',
  templateUrl: './meal-plans.component.html',
  styleUrls: ['./meal-plans.component.scss']
})
export class MealPlansComponent implements OnInit {

  isLoading = false;
  mealPlans = [];
  selectedMealPlan: any = {};
  selectedMealPlanId: string = '';
  selectedMealPlanMeals: any = {};
  groceryList: any = [];
  gListToShow: any = [];

  groceryListCreateError = false;
  groceryListCreateSuccess = false;

  nbrOfServings: number = 1;
  glTotal: number = 0;

  showGlobalError: boolean = false;
  globalError = '';

  @ViewChild("printContent") printContent: ElementRef;
  constructor(
    private _router: Router,
    private _api: ApiService,
    private _others: OthersService,
  ) { }

  ngOnInit(): void {
    if(this._others.isLoggedIn.getValue()) {
      this.getMealPlans();
      this.selectedMealPlan = this._others.selectedMealPlan.getValue();
      if (this.selectedMealPlan.name != undefined) {
        this.organizingDailyMeals();
      }
    } else {
      this._router.navigate(['login']);
    }
  }

  getMealPlans() {
    this.isLoading = true;
    this._others.isLoading.next(true);

    this._api.getRequest(`meal-plans?created_by=${this._api.userData.id}`).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.mealPlans = response['results'];
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  goToMealPlan(mealPlanId: string) {
    this._router.navigate(['meal-plan/', mealPlanId]);
  }

  addNewMealPlan() {
    this._router.navigate(['new-meal-plan']);
  }

  selectMealPlan(mealPlan: any) {
    this._others.selectedMealPlan.next(mealPlan);
    this.selectedMealPlan = mealPlan;
    this.selectedMealPlanId = mealPlan['id'];
    this.organizingDailyMeals();
    this.globalError = '';
    this.showGlobalError = false;
  }

  organizingDailyMeals() {
    if (this.selectedMealPlan['grocery_list'] != null) {
      this.groceryList = this.selectedMealPlan.grocery_list.foods;
      this.gListToShow = this.groceryList;

      this.glTotal = 0;
      this.groceryList.forEach(element => {  
        const p = parseFloat(element.estimated_price) * this.nbrOfServings;
        this.glTotal = this.glTotal + p;
      });

    } else {
      this.groceryList = [];
      this.gListToShow = this.groceryList;
    };

    this.selectedMealPlanMeals = { breakfast: [], lunch: [],  dinner: [] };
    this.selectedMealPlan['meals'].forEach(element => {
      if (element.time == 'Breakfast') {
        this.selectedMealPlanMeals.breakfast.push(element);
      } else if (element.time == 'Lunch') {
        this.selectedMealPlanMeals.lunch.push(element);
      } else if (element.time == 'Dinner') {
        this.selectedMealPlanMeals.dinner.push(element);
      }
    });
  } 

  goToRecipe(recipe: any) {
    this._router.navigate(['recipe/', recipe.recipe_id]);
  }

  createGroceryList() {
    this.isLoading = false;
    this.groceryListCreateError = false;
    this.groceryListCreateSuccess = false;

    const params = {
      meal_plan: this.selectedMealPlan['id']
    };

    this._api.postRequest('grocery-lists', params).subscribe((response: any) => {
      this.isLoading = false;
      this.groceryListCreateSuccess = true;
      window.location.reload();
    }, (error: any) => {
      this.isLoading = false;
      this.groceryListCreateError = true;
      console.log(error);
    });
  }

  deleteMealPlan() {
    if (this.selectedMealPlanId != '') {
      this.isLoading = true;
      this._others.isLoading.next(true);
  
      this._api.deleteRequest(`meal-plans/${this.selectedMealPlanId}`).subscribe((response: any) => {
        this.isLoading = false;
        this._others.isLoading.next(false);
        window.location.reload();
      }, (error: any) => {
        this.isLoading = false;
        this._others.isLoading.next(false);
        console.log(error);
      });
    }
  }

  updateGroceryList() {
    // console.log(this.nbrOfServings);
    let newGrocList: any = [];
    this.glTotal = 0;
    this.groceryList.forEach(element => {
      let elem: any = {};
      elem['food_name'] = element.food_name;
      elem['unit'] = element.unit;
      elem['quantity'] = parseFloat(element.quantity) * this.nbrOfServings;
      elem['estimated_price'] = parseFloat(element.estimated_price) * this.nbrOfServings;
      newGrocList.push(elem);

      const p = parseFloat(element.estimated_price) * this.nbrOfServings;
      this.glTotal = this.glTotal + p;
    });

    // console.log(newGrocList);
    this.gListToShow = newGrocList;
  }

  printGroceryList() {
    const originalContent = document.body.innerHTML;
    const htmlContent = this.printContent.nativeElement.innerHTML;
    const pc = `
      <html>
        <head><title></title></head>
        <body>
          <h3>${this.selectedMealPlan['name']}'s Grocery List</h3>
          <div>${htmlContent}</div>
        </body>
      </html>`;
    document.body.innerHTML = pc;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  }

  deleteMealPlanItem(recipe: any) {
    this.isLoading = true;
    this._others.isLoading.next(true);

    let mpms = [...this.selectedMealPlan['meals']];

    if (mpms.length > 1) {
      for (let i = 0; i < mpms.length; i++) {
        const element = mpms[i];
        
        if (element['recipe_id'] == recipe.recipe_id && element['day'] == recipe.day && element['time'] == recipe.time) {
          mpms.splice(i, 1);
          break;
        };
      };
  
      const params = { meals: mpms };
  
      this._api.patchRequest(`meal-plans/${this.selectedMealPlanId}`, params).subscribe((response: any) => {
        if (this.selectedMealPlan['grocery_list'] != null) {
          this.deleteGroceryList();
        } else {
          this.selectMealPlan(response);
        }
      }, (error: any) => {
        this.isLoading = false;
        this._others.isLoading.next(false);
        console.log(error);
      });
    } else {
      this.globalError = 'You can not delete all meals in a meal plan. Delete the meal plan instead';
      this.showGlobalError = true;
    }
  }

  deleteGroceryList() {
    this.isLoading = true;
    this._others.isLoading.next(true);
    console.log(this.selectedMealPlan['grocery_list']['id']);
    this._api.deleteRequest(`grocery-lists/${this.selectedMealPlan['grocery_list']['id']}`).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this._api.getRequest(`meal-plans/${this.selectedMealPlanId}`).subscribe((response: any) => {
        this.selectMealPlan(response);
      });
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }



}
