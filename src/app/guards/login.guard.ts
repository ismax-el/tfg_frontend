import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService)

    // Utilizar validateToken para verificar la validez del token
    return userService.validateToken().then(isValid => {
        if (isValid) {
            return true; // Token válido, permite el acceso a la ruta
        } else {
            router.navigate(['/login']);
            localStorage.removeItem('userToken');
            return false; // Token no válido, redirige al usuario al login
        }
    });
};
