import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user';
import { TweetService } from '../services/tweet.service';
import { Router } from '@angular/router';
import { ConfirmedValidator } from './ConfirmedValidator';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  isEmailUnique: boolean = true;
  isUsernameUnique: boolean = true;
  success: boolean = false;
  flag:boolean = true;
  f_user:string;
  userList:User[]=[];
  userFilter:string[]=[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private tweetService: TweetService,
    private formBuilder: FormBuilder
  ) { }

  get f() {
    return this.registerForm.controls;
  }
  ngOnInit(): void {

    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required,Validators.pattern('[A-ZA-z\s]{1,}')]],
      lastName: ['', [Validators.required,Validators.pattern('[A-ZA-z\s]{1,}')]],
      loginId: ['', Validators.required],
      password: ['', [Validators.required,Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      contactNumber: [ '',[Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')],],
    },{
    validator: ConfirmedValidator('password', 'confirmPassword')
    });
    this.tweetService
    .getAllUsers()
    .subscribe((data: any) => (this.userList = data));
  }

  search_user() 
  {
    this.userFilter=[];
    this.userList.forEach(element =>
      {
          let temp = element.loginId;
          if(temp.toLowerCase()==this.f_user.toLowerCase())
          {
            this.userFilter.push(element.loginId);
          }
          if(this.userFilter.length > 0)
          {
            this.flag = false;
          }
          else
          {
            this.flag = true;
          }
      });
  }

  onSubmit() {
    console.log('Submitted');
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    let user: User = {
      id: null,
      loginId: this.f.loginId.value,
      password: this.f.password.value,
      confirmPassword: this.f.confirmPassword.value,
      email: this.f.email.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      contactNumber: this.f.contactNumber.value,
    };
    this.loading = true;
    this.authService.register(user).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.loginId !== undefined) {
            this.success = true;
            window.alert('Registered Successfully!')
            this.router.navigateByUrl('login');
        }
      },
      (err) => {
        this.loading = false;
        if (
          err.message.includes('duplicate key') &&
          err.message.includes('loginId')
        ) {
          this.isUsernameUnique = false;
        }
        if (
          err.message.includes('duplicate key') &&
          err.message.includes('email')
        ) {
          this.isEmailUnique = false;
        }
      }
    );
  }
}
