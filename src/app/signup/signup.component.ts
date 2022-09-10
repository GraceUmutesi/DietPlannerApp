import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  isLoading: boolean = false;
  signupForm!: FormGroup;
  signupError: boolean = false;
  signupErrorMessage: string = "";
  signupSuccess: boolean = false;
  storage = window.sessionStorage;
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private _othersService: OthersService
  ) { }

  ngOnInit(): void {
    this.createSignupForm();
  }

  createSignupForm(): void {
    this.signupForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  signup(): void {
    this.isLoading = true;
    this.signupError = false;
    this.signupSuccess = false;

    const params = this.signupForm.value;

    this.api.postRequest('authentication/create-account', params).subscribe((response: any) => {
      this.storage.setItem('token', `Token ${response['token']}`);
      this.storage.setItem('user_data', JSON.stringify(response));
      this.isLoading = false;
      this.api.updateHttpOptions();
      this._othersService.isLoggedIn.next(true);
      this.router.navigate(['/']);
    }, (error: any) => {
      this.isLoading = false;
      this.signupError = true;
      if (error.status == 409) {
        this.signupErrorMessage = "User with e-mail already exists"
      } else {
        this.signupErrorMessage = "Something went wrong, please try again"
      }
      console.log(error);
    });
  }

}
