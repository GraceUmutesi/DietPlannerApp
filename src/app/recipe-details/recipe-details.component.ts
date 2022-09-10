import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})
export class RecipeDetailsComponent implements OnInit {

  isLoading = false;
  otherRecipes = [];
  recipeId: string = '';
  recipe!: any;

  storage = window.sessionStorage;

  imageForm: FormGroup;
  fileMessage = 'Choose Image File';
  imageFile: File;
  imageFormError: boolean = false;
  showEditImage: boolean = false;

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _api: ApiService,
    private _others: OthersService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.recipeId = params.recipe_id;
      this.loadRecipeDetails();
      this.getOtherRecipes();
      this.createImageForm();
    });
  }

  loadRecipeDetails() {
    this.isLoading = true;
    this._others.isLoading.next(true);
    this._api.getRequest(`recipes/${this.recipeId}`).subscribe((response: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      this.recipe = response;
    }, (error: any) => {
      this.isLoading = false;
      this._others.isLoading.next(false);
      console.log(error);
    });
  }

  getOtherRecipes() {
    this.isLoading = true;
    this._api.getRequest('recipes?created_by__is_staff=True').subscribe((response: any) => {
      this.isLoading = false;
      this.otherRecipes = response['results'];
    }, (error: any) => {
      this.isLoading = false;
      console.log(error);
    });
  }

  goToRecipes(recipeId: string) {
    this._router.navigate(['recipe/', recipeId]);
  }

  onFileSelected(event) {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
      this.fileMessage = 'Image Selected  ' + this.imageFile.name;
    }
  }


  createImageForm(): void {
    this.imageForm = this.fb.group({
      image: ['', [Validators.required]],
    });
  }

  addRecipeImage(form: FormGroup) {
    const params = new FormData();
    params.append('recipe_id', this.recipeId);
    params.append('recipe_image', this.imageFile, this.imageFile.name);

    this._api.addingRecipeImage('save-recipe-image', params).subscribe((response: any) => {
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
