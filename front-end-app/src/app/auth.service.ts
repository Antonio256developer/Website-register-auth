import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
//import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any;
  user: any;

  constructor(private http: Http) { }
//регистрация пользователя в БД
registerUser(user) {   //ф-ция принимает объект(все данные что ввел пользователь в форму)
  let headers = new Headers();    //ф-ция отправляет объект по url адресу
  headers.append('Content-Type', 'application/json');
  return this.http.post('account/reg', user,
  {headers: headers}).pipe(map((respone: any) => respone.json()));
}
   //передача объекта user по 'http://localhost:3000/account/auth'
authUser(user) {
  let headers = new Headers();    //ф-ция отправляет объект по url адресу
  headers.append('Content-Type','application/json');
  return this.http.post('account/auth', user,
  {headers: headers}).pipe(map((respone: any) => respone.json()));
}

storeUser(token, user) {
  localStorage.setItem('token', token); //локадьное хранилище
  localStorage.setItem('user', JSON.stringify(user));
  this.token = token;
  this.user = user;
}

logout() {
  this.token = null;
  this.user = null;
  localStorage.clear();
}

isLoggedIn() {
  return tokenNotExpired();
}

}
