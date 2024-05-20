import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { EventService } from '../services/event.service';
import { catchError, map, throwError } from 'rxjs';

export const eventStatusGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const userService = inject(UserService)
    const eventService = inject(EventService);

    const eventId = route.paramMap.get('eventId');
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (eventId) {
        return eventService.getEvent(eventId).pipe(
            map(event => {
                console.log(event.endDate, currentDate)
                if(event.endDate >= currentDate){
                    return true;
                }else{
                    router.navigate(['/not-found'])
                    return false;
                }
                
            }),
            catchError((error) => {
                router.navigate(['/not-found']);
                return throwError(error)
            })
        );
    }else{
        return false; // Si no se proporciona el eventId, no permitir el acceso
    }


};
