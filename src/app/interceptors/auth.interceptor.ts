import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    let clonedRequest = req;

    if(localStorage.getItem('userToken')){
        clonedRequest = req.clone({
            setHeaders: {
                Authorization: localStorage.getItem('userToken')!
            }
        });
    }

    return next(clonedRequest);
};
