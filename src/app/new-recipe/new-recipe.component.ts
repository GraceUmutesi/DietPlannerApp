import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-new-recipe',
  templateUrl: './new-recipe.component.html',
  styleUrls: ['./new-recipe.component.scss']
})
export class NewRecipeComponent implements OnInit {

  isLoading: boolean = false;
  newRecipeForm!: FormGroup;
  newRecipeError: boolean = false;
  newRecipeSuccess: boolean = false;
  recipeCategories = [];
  foods = [];

  constructor(
    private _api: ApiService,
    private _others: OthersService,
    private fb: FormBuilder,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.createNewRecipeForm();
    this.addAnotherFood();
    // this.addAnotherNutrValue();
    this.getCategories();
    this.getFoods();
  }

  createNewRecipeForm(): void {
    this.newRecipeForm = this.fb.group({
      name: ['', [Validators.required]],
      recipe_type: ['', [Validators.required]],
      directions: ['', [Validators.required]],
      description: [''],
      ingredients: this.fb.array([]),
      nutritional_value: this.fb.array([]),
    });
  }

  addAnotherFood() {
    (this.newRecipeForm.get('ingredients') as FormArray).push(
      this.fb.group({
        food: ['', [Validators.required]],
        quantity: [0, [Validators.required]]
      })
    )
  }

  addAnotherNutrValue() {
    (this.newRecipeForm.get('nutritional_value') as FormArray).push(
      this.fb.group({
        name: ['', [Validators.required]],
        unit: ['', [Validators.required]],
        value: [0, [Validators.required]]
      })
    )
  }

  removeFood(position: number) {
    if ((this.newRecipeForm.get('ingredients') as FormArray).length > 1) {
      (this.newRecipeForm.get('ingredients') as FormArray).removeAt(position);
    }
  }

  removeNutrValue(position: number) {
    if ((this.newRecipeForm.get('nutritional_value') as FormArray).length > 0) {
      (this.newRecipeForm.get('nutritional_value') as FormArray).removeAt(position);
    }
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

  getFoods() {
    this.isLoading = true;
    this._others.isLoading.next(true);
    this._api.getRequest('foods').subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.foods = response
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  addRecipe() {
    this.isLoading = true;
    this.newRecipeError = false;
    this.newRecipeSuccess = false;

    let params = this.newRecipeForm.value;
    const ings = this.newRecipeForm.value['ingredients'];

    let ingredients: any = [];

    ings.forEach(food => {
      ingredients.push(
        {
          food_id: food.food['id'],
          food_name: food.food['name'],
          quantity: food['quantity'],
          unit: food.food['quantitation']
        }
      )
    });

    params['ingredients'] = ingredients

    this._api.postRequest('recipes', params).subscribe((response: any) => {
      this.isLoading = false;
      this.newRecipeSuccess = true;
      this._router.navigate(['recipes']);
      // this.createNewRecipeForm();
      // this.addAnotherFood();
    }, (error: any) => {
      this.isLoading = false;
      this.newRecipeError = true;
      console.log(error);
    });
  }


}
