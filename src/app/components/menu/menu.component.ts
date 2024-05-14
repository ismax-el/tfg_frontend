import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar'
import { MatButton, MatButtonModule } from '@angular/material/button'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatButton, MatToolbar, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
    isMobile: boolean = false;


    router = inject(Router);
    userService = inject(UserService);

    constructor(private breakpointObserver: BreakpointObserver){
        this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe(result => {
            this.isMobile = result.matches;
        });
    }

    onClickLogout(){
        localStorage.removeItem('userToken');
        localStorage.removeItem('_grecaptcha')
        this.router.navigate(['/login']);
    }
}
