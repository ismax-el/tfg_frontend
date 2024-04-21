import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card'
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    hide = true;
    hideConfirm = true;
    form: FormGroup;

    userService = inject(UserService);

    constructor(private router: Router) {
        this.form = new FormGroup({
            name: new FormControl(),
            email: new FormControl('', [Validators.required, Validators.email]),
            instagram: new FormControl(),
            twitter: new FormControl(),
            artstation: new FormControl(),
            password: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required)
        }, 
        [this.passwordMatchValidator]
        )
    }

    passwordMatchValidator(form: AbstractControl){
        return form.get('password')!.value === form.get('confirmPassword')!.value ? null : {'mismatch' : true};
    }

    async onSubmit() {
        //Llamar al método "register" de usersService pasándole los datos del form
        const response = await this.userService.register(this.form.value);
		console.log(response);
        this.router.navigate(['/gallery']);

    }
}
