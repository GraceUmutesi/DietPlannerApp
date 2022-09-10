import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialsModule } from './materials/materials.module';
import { OthersService } from './services/others.service';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { BaseComponent } from './base/base.component';
import { RecipesComponent } from './recipes/recipes.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { MealPlansComponent } from './meal-plans/meal-plans.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { NewMealPlanComponent } from './new-meal-plan/new-meal-plan.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    BaseComponent,
    RecipesComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    RecipeDetailsComponent,
    NewRecipeComponent,
    MealPlansComponent,
    ArticlesComponent,
    ArticleDetailsComponent,
    NewMealPlanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialsModule
  ],
  entryComponents: [
    NewRecipeComponent
  ],
  providers: [
    ApiService,
    OthersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
