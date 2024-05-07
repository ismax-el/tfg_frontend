import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image',
  standalone: true,
  imports: [],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: {imageUrl: string}){
        
    }
}
