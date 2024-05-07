import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl: string;
    userId: string | null = null;
    userRol: string | null = null;

    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:3000/api/users';
        this.retrieveUserInfo();
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

    retrieveUserInfo(): any {
        const token = localStorage.getItem('userToken');
        if (token) {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            console.log(tokenPayload);
            
            if(tokenPayload){
                //En lugar de settear el token en el localstorage, descifrarlo del token
                this.userId = tokenPayload.user_id;
                this.userRol = tokenPayload.user_rol;
            }
        }
    }

    isAdminUser(): any {
        return this.userRol == 'administrator'
    }
}
