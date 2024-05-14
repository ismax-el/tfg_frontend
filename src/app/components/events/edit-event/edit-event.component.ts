import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker'
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-edit-event',
    standalone: true,
    imports: [MatProgressSpinner, MatDatepickerModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatChipsModule, MatIconModule, MatButtonModule],
    providers: [provideNativeDateAdapter()],
    templateUrl: './edit-event.component.html',
    styleUrl: './edit-event.component.scss'
})
export class EditEventComponent {
    form: FormGroup;
    showSpinner = false;
    eventId: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private eventService: EventService, private snackBar: MatSnackBar) {
        this.form = new FormGroup({
            name: new FormControl("", Validators.required),
            description: new FormControl("", Validators.required),
            themes: new FormControl([]),
            startDate: new FormControl(null),
            endDate: new FormControl(null, [
                this.endDateValidator
            ]),
        })
        
        this.form.get('startDate')!.disable();
        
    }

    ngOnInit() {
        let eventId = this.activatedRoute.snapshot.paramMap.get('eventId')!;
        this.eventId = eventId;
        this.eventService.getEvent(eventId).subscribe(event => {
            console.log(event)
            
            this.form.setValue({
                name: event.name,
                description: event.description,
                themes: event.themes,
                startDate: event.startDate,
                endDate: event.endDate
            });
        })
    }

    //CHIPS PARA THEMES
    removeTheme(theme: string) {
        const index = this.form.get('themes')!.value.indexOf(theme);
        if (index >= 0) {
            this.form.get('themes')!.value.splice(index, 1);
        }
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add our keyword
        if (value) {
            this.form.get('themes')!.value.push(value);
        }

        // Clear the input value
        event.chipInput!.clear();

        console.log(this.form.value)
    }
    //CHIPS PARA THEMES


    //DATE VALIDATORS

    endDateValidator(control: AbstractControl) {
        const endDate = control.value;
        const startDate = control.root.get('startDate')?.value;

        if (new Date(endDate) <= new Date(startDate)) {
            return { 'invalidEndDate': true };
        }

        return null;
    }
    //DATE VALIDATORS

    async onSubmit() {
        this.showSpinner = true;

        //EVENTSERVICE CREAR NUEVO EVENTO
        const response = await this.eventService.updateEvent(this.eventId, this.form.value);
        console.log(response);

        if (!response.error) {
            setTimeout(() => {
                this.router.navigate(['/gallery']); // Navegar a la galería después de 2 segundos
                this.snackBar.open('¡Evento editado con éxito!', 'Cerrar', {
                    duration: 3000, // Duración de la snackbar en milisegundos
                    panelClass: 'snackbar',
                });
            }, 2000);
        }

        // Ocultar el spinner después de 2 segundos, independientemente del resultado de la respuesta
        setTimeout(() => {
            this.showSpinner = false;
        }, 2000);
    }
}
