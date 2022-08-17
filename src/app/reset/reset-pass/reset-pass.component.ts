import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/interfaces/user';
import { ForgotPassword } from 'src/app/interfaces/forgotPassword';
import { ConfirmedValidator } from 'src/app/register/ConfirmedValidator';
@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  resetSubmitted: boolean;
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) { }
  resetPasswordForm: FormGroup;
  submitted: boolean = false;
  resetPasswordValue: string;
  currentUser: User;
  invalid = false;
  passwordResetComplete: boolean = false;
  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
      {
        validator: ConfirmedValidator('password', 'confirmPassword')
      }
    );
  }
  get f() {
    return this.resetPasswordForm.controls;
  }
  getPassword() {
    return this.resetPasswordForm.get('password').value;
  }
  onSubmit() {
    console.log('Submitted');
    this.submitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }
    let fp: ForgotPassword = {
      password: this.f.password.value,
      confirmPassword: this.f.confirmPassword.value
    };
    this.loading = true;
    this.authService
      .resetPassword(this.currentUser.loginId, fp)
      .subscribe((data: any) => {
        this.loading = false;


        if (data == 'Password has been reset successfully') {
          this.authService.setCurrentUser(null);
          this.passwordResetComplete = true;
          this.router.navigateByUrl('login');
        }
        else {
          this.invalid = true;
          this.loading = false;
          this.passwordResetComplete = false;
        }
      });
  }
}
