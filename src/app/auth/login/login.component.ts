import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginRequestPayload} from './login-request.payload';
import {AuthService} from '../shared/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hasError: boolean;
  registerSuccessMessage: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.activatedRoute.queryParams
      .subscribe((params: Params) => {
        if (params.registered && params.registered === 'true') {
          this.toastr.success('Signup Successful!');
          this.registerSuccessMessage = 'Please check your inbox for activate your account before login!';
        }
      });
  }

  login(): void {
    const payload = {
      username: this.username.value,
      password: this.password.value
    } as LoginRequestPayload;

    this.authService.login(payload)
      .subscribe(async (isValid: boolean) => {
        console.log('login', isValid);

        if (isValid) {
          this.toastr.success('Login Successful!');
          await this.router.navigateByUrl('/');
        }

        this.hasError = !isValid;

      }, (err) => {
        console.error('login', err);

        this.toastr.error('Login Failed!');
        this.hasError = true;
      });
  }

  get username(): AbstractControl {
    return this.loginForm.get('username');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }
}
