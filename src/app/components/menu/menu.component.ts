import { Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar'
import { MatButton } from '@angular/material/button'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatButton, MatToolbar, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

    router = inject(Router);
    userService = inject(UserService);

    onClickLogout(){
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);
    }
}
