import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatProgressSpinner, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    hide = true;
    hideConfirm = true;
    form: FormGroup;
    responseError: string | null = null;
    showSpinner = false;

    userService = inject(UserService);

    constructor(private recaptchaService: ReCaptchaV3Service, private router: Router, private snackBar: MatSnackBar) {
        this.form = new FormGroup({
            name: new FormControl(),
            email: new FormControl('', [Validators.required, Validators.email]),
            instagram: new FormControl(),
            twitter: new FormControl(),
            artstation: new FormControl(),
            password: new FormControl('', [Validators.required, Validators.minLength(5), this.passwordValidator]),
            confirmPassword: new FormControl('', Validators.required),
            recaptcha: new FormControl('')

        }, 
        [this.passwordMatchValidator]
        )
    }

    passwordValidator(control: FormControl): { [key: string]: boolean } | null {
        const password = control.value;
        if (!password) {
            return null;
        }
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
        const isValid = password.length >= 5 && hasUpperCase && hasSymbol;
        return isValid ? null : { invalidPassword: true };
    }

    passwordMatchValidator(form: AbstractControl){
        return form.get('password')!.value === form.get('confirmPassword')!.value ? null : {'mismatch' : true};
    }

    async onSubmit() {
        this.showSpinner = true;
        const token = await this.executeRecaptcha();

         // Asignar el token al formulario
        this.form.patchValue({ recaptcha: token });

        //Llamar al método "register" de usersService pasándole los datos del form
        const response = await this.userService.register(this.form.value);
		if (!response.error) {
            setTimeout(() => {
                this.router.navigate(['/login']); // Navegar a la galería después de 2 segundos
                this.snackBar.open('Te has registrado correctamente', 'Cerrar', {
                    duration: 3000, // Duración de la snackbar en milisegundos
                });
            }, 1000);
        }else{
            //En caso de que ya exista un usuario con ese mismo mail
            this.responseError = response.error;
            this.showSpinner = false;
            console.log(response.error)
        }

        // Ocultar el spinner después de 2 segundos, independientemente del resultado de la respuesta
        // setTimeout(() => {
        //     this.showSpinner = false;
        // }, 2000);
    }

    executeRecaptcha(){
        return new Promise((resolve, reject) => {
            this.recaptchaService.execute('').subscribe(
                token => {
                    console.log(token);
                    resolve(token);
                },
                error => {
                    console.error('Error al ejecutar recaptcha:', error);
                    reject(error);
                }
            );
        });
    }
}
