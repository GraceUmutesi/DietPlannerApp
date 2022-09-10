import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OthersService } from '../services/others.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading: boolean = false;
  loginForm!: FormGroup;
  loginError: boolean = false;
  loginSuccess: boolean = false;
  storage = window.sessionStorage;
  passwordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
    private _othersService: OthersService
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    this.isLoading = true;
    this.loginError = false;
    this.loginSuccess = false;

    const params = this.loginForm.value;

    this.api.postRequest('authentication/login', params).subscribe((response: any) => {
      this.storage.setItem('token', `Token ${response['token']}`);
      this.storage.setItem('user_data', JSON.stringify(response));
      this.isLoading = false;
      this.api.updateHttpOptions();
      this._othersService.isLoggedIn.next(true);
      this.router.navigate(['/']);
    }, (error: any) => {
      this.isLoading = false;
      this.loginError = true;
      console.log(error);
    });
  }

}
