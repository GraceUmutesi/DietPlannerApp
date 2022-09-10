import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticlesComponent } from './articles/articles.component';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MealPlansComponent } from './meal-plans/meal-plans.component';
import { NewMealPlanComponent } from './new-meal-plan/new-meal-plan.component';
import { NewRecipeComponent } from './new-recipe/new-recipe.component';
import { RecipeDetailsComponent } from './recipe-details/recipe-details.component';
import { RecipesComponent } from './recipes/recipes.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  { path: '', component: BaseComponent, children: [
    { path: 'home', component: HomeComponent },
    { path: 'recipes', component: RecipesComponent },
    { path: 'recipe/:recipe_id', component: RecipeDetailsComponent },
    { path: 'new-recipe', component: NewRecipeComponent },
    { path: 'meal-plans', component: MealPlansComponent },
    { path: 'new-meal-plan', component: NewMealPlanComponent },
    { path: 'articles', component: ArticlesComponent },
    { path: 'article/:article_id', component: ArticleDetailsComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
