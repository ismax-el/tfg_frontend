import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    constructor(public userService: UserService, @Inject(MAT_DIALOG_DATA) public data: {isDeleteDialog: boolean}, private dialog: MatDialog){
        console.log(this.data)
    }

}
