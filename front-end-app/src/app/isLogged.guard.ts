import { Injectable } from '@angular/core';   //для использования сервиса
import { Router, CanActivate } from '@angular/router'; //класс роутер
import { AuthService } from './auth.service';

@Injectable()
export class IsLoggedIn implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['reg']);
      return false;
    }
  }
}
