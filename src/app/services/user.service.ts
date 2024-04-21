import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:3000/api/users';
    }

    register(formValue: any) {
        return firstValueFrom(
            this.http.post<any>(`${this.baseUrl}/register`, formValue)
        )
    }

    login(formValue: any) {
        return firstValueFrom(
            this.http.post<any>(`${this.baseUrl}/login`, formValue)
        )
    }

    isLogged() {
        return localStorage.getItem('userToken') ? true : false;
    }

    validateToken(): Promise<boolean> {
        const token = localStorage.getItem('userToken');
        if (!token) {
            return Promise.resolve(false);
        }

        return firstValueFrom(
            this.http.post<any>(`${this.baseUrl}/validate`, null)
        ).then(response => response.isValid);
    }

    getUserIdFromToken() {

    }
}
