import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-new-meal-plan',
  templateUrl: './new-meal-plan.component.html',
  styleUrls: ['./new-meal-plan.component.scss']
})
export class NewMealPlanComponent implements OnInit {

  isLoading = false;
  newMealPlanForm!: FormGroup;
  newMealPlanError: boolean = false;
  newMealPlanSuccess: boolean = false;
  recipes = [];

  recipesFrom: string = '';

  constructor(
    private _router: Router,
    private _api: ApiService,
    private _others: OthersService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    if(this._others.isLoggedIn.getValue()) {
      this.recipesFrom = this._others.recipesFrom.getValue();
      this.createNewMealPlanForm();
      this.addAnotherMeal();
      this.getRecipes();
    } else {
      this._router.navigate(['login']);
    }
  }

  createNewMealPlanForm(): void {
    this.newMealPlanForm = this.fb.group({
      name: ['', [Validators.required]],
      meals: this.fb.array([])
    });
  }

  addAnotherMeal() {
    (this.newMealPlanForm.get('meals') as FormArray).push(
      this.fb.group({
        recipe: ['', [Validators.required]],
        day: ['', [Validators.required]],
        time: ['', [Validators.required]]
      })
    )
  }

  removeMeal(position: number) {
    if ((this.newMealPlanForm.get('meals') as FormArray).length > 1) {
      (this.newMealPlanForm.get('meals') as FormArray).removeAt(position);
    }
  }

  getRecipes() {
    this.isLoading = true;
    this._others.isLoading.next(true);

    let url: string = `recipes/user-sys-recipes`;

    this._api.getRequest(url).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.recipes = response;
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  createMealPlan() {
    this.isLoading = true;
    this.newMealPlanError = false;
    this.newMealPlanSuccess = false;

    let params = this.newMealPlanForm.value;
    const ings = this.newMealPlanForm.value['meals'];

    let meals: any = [];

    ings.forEach(meal => {
      meals.push(
        {
          recipe_id: meal.recipe['id'],
          recipe_name: meal.recipe['name'],
          recipe_image: meal.recipe['image'],
          day: meal['day'],
          time: meal['time']
        }
      )
    });

    params['meals'] = meals
    params['created_by'] = this._api.userData.id

    this._api.postRequest('meal-plans', params).subscribe((response: any) => {
      this.isLoading = false;
      this.newMealPlanSuccess = true;
      this.createNewMealPlanForm();
      this.addAnotherMeal();
    }, (error: any) => {
      this.isLoading = false;
      this.newMealPlanError = true;
      console.log(error);
    });

  }

}
