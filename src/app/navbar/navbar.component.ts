import { OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  
  currentUser: User;
  
  constructor(private authService:AuthService,private router:Router,private observer: BreakpointObserver) {}

  loginId=sessionStorage.getItem("loginId");
  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('login');
    }
    this.currentUser = this.authService.getCurrentUser();
  }

  ngAfterViewInit() {
    this.observer.observe([]).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.open();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.close();
      }
    });
  }

  doLogOut()
  {
    this.authService.setCurrentUser(null);
    this.router.navigateByUrl("/");
  }
}
