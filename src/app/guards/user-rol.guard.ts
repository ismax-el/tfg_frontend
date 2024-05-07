import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const userRolGuard: CanActivateFn = (route, state) => {
    
    const router = inject(Router);
    const userService = inject(UserService)

    if(!userService.isAdminUser()){
        router.navigate(['/gallery'])
        return false;
    }else{
        return true;
    }
};
