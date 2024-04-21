import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { Event } from '../definitions/event';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private baseUrl: string;


    constructor(private http: HttpClient) {
        this.baseUrl = 'http://localhost:3000/api/events';
    }

    getEvents(): Observable<Event[]>{
        return this.http.get<any[]>(this.baseUrl).pipe(
            map((response: any[]) => {
                return response.map(event => ({
                    id: event._id,
                    name: event.name,
                    description: event.description,
                    themes: event.themes,
                    startDate: new Date(event.startDate),
                    endDate: new Date(event.endDate)
                }));
            })
        );
    }

    getEventImages(eventId: string){

    }

    createEvent(formValue: any){
        return firstValueFrom(
            this.http.post<any>(`${this.baseUrl}/create`, formValue)
        )
    }

}
