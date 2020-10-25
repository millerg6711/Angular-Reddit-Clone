import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {SignupRequestPayload} from './signup-request.payload';
import {AuthService} from '../shared/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  signup(): void {
    const payload = {
      username: this.username.value,
      email: this.email.value,
      password: this.password.value
    } as SignupRequestPayload;

    this.authService.signup(payload)
      .subscribe(async (data) => {
        console.log('signup', data);
        await this.router.navigate(['/login'], {queryParams: {registered: 'true'}});
      }, (err) => {
        console.error('signup', err);
      });
  }

  get username(): AbstractControl {
    return this.signupForm.get('username');
  }

  get email(): AbstractControl {
    return this.signupForm.get('email');
  }

  get password(): AbstractControl {
    return this.signupForm.get('password');
  }
}
