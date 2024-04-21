import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatExpansionModule } from '@angular/material/expansion'
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../definitions/event';
import { catchError, firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [MatExpansionModule, MatTooltipModule, MatDividerModule, MatIconModule, MatButtonModule, MatCardModule, RouterLink, RouterLinkActive, RouterOutlet],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
    events: Event[] = [];

    constructor(private eventService: EventService) { }

    ngOnInit(): void {
        this.getAllEvents();
    }

    getAllEvents() {
        this.eventService.getEvents()
            .pipe(catchError(error => {
                console.error('Error fetching events:', error);
                return []; // Retornar un array vacío en caso de error
            }))
            .subscribe(events => {
                this.events = events
                console.log(this.events);
            });
    }
}
