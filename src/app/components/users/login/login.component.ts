import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatProgressSpinner, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
    hide = true;
    showSpinner = false;
    form: FormGroup;
    responseError: string | null = null;

    userService = inject(UserService)

    constructor(private router: Router, private snackBar: MatSnackBar) {
        this.form = new FormGroup({
            name: new FormControl(),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.minLength(2))
        })
    }

    async onSubmit() {
        //Llamar al método "login" del usersService 
        //Si no ha habido errores en la respuesta, setear el un token en el localstorage
        //navegar a la galería de eventos
        this.showSpinner = true;

        const response = await this.userService.login(this.form.value);
        if (!response.error) {
            localStorage.setItem('userToken', response.token)
            setTimeout(() => {
                this.router.navigate(['/gallery']); // Navegar a la galería después de 2 segundos
                this.snackBar.open('Has iniciado sesión correctamente', 'Cerrar', {
                    duration: 3000, // Duración de la snackbar en milisegundos
                    panelClass: 'snackbar',
                });
            }, 2000);
        }else{
            this.responseError = response.error;
            console.log(response.error)
        }

        // Ocultar el spinner después de 2 segundos, independientemente del resultado de la respuesta
        setTimeout(() => {
            this.showSpinner = false;
        }, 2000);
    }
}
