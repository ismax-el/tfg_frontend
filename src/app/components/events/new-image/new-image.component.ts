import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/user.service';
import { EventService } from '../../../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from '../../../services/image.service';

@Component({
    selector: 'app-new-image',
    standalone: true,
    imports: [MatProgressSpinner, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatChipsModule, MatIconModule, MatButtonModule],
    templateUrl: './new-image.component.html',
    styleUrl: './new-image.component.scss'
})
export class NewImageComponent {
    //coger el userId a través del userservice.getuseridfromtoken
    form: FormGroup;
    showSpinner = false;
    imageUrl: any;

    constructor(private imageService: ImageService, private userService: UserService, private eventService: EventService, private router: Router, private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {

        this.form = new FormGroup({
            user_id: new FormControl(),
            event_id: new FormControl(),
            file: new FormControl(null, [Validators.required]),
            name: new FormControl({value: "", disabled: true}),
            likes: new FormControl(),
        })

        //autorellenar el id del evento y del usuario
        this.form.get('event_id')?.setValue(this.activatedRoute.snapshot.paramMap.get('eventId')!)
        this.form.get('user_id')?.setValue(this.userService.userId)
    }

    changedFileInput(event: any) {
        const file = event.target.files[0];
        if (file.size <= 10 * 1024 * 1024 && file.type.startsWith('image/')) { // Verificar tamaño y tipo de archivo
            this.form.get('name')?.setValue(file.name);
            this.form.get('name')?.enable();
            this.form.patchValue({ file });
            this.form.get('file')?.updateValueAndValidity();

            //Preview de la imagen
            const reader = new FileReader();
            reader.onload = () => {
                this.imageUrl = reader.result;
            };
            reader.readAsDataURL(file);
        } else {
            this.snackBar.open('El tamaño máximo de la imagen no puede superar los 10mb.', 'Cerrar', {
                duration: 6000,
            });
            this.form.get('file')?.setValue(null); // Limpiar el archivo seleccionado
            this.form.get('name')?.setValue(null); // Limpiar el archivo seleccionado
            event.target.value = null; // Limpiar el input de tipo file
        }

    }

    clearImage(){
        this.imageUrl = null;
        this.form.get('file')?.setValue(null);
        this.form.get('name')?.setValue(null);
        this.form.get('name')?.disable();
    }

    async onSubmit() {
        this.showSpinner = true;
        const formData = new FormData();
        formData.append('user_id', this.form.get('user_id')?.value);
        formData.append('event_id', this.form.get('event_id')?.value);
        formData.append('name', this.form.get('name')?.value);
        formData.append('file', this.form.get('file')?.value);
        //EVENTSERVICE CREAR NUEVO EVENTO
        const response = await this.eventService.uploadEventImage(formData);
        console.log(response);

        if (!response.error) {
            setTimeout(() => {
                this.eventService.getEventImages(response.event_id).subscribe(images => {
                    this.imageService.eventImagesDict[response.event_id] = images;
                    console.log("NUEVAS IMAGENES", images)
                    this.router.navigate(['/event/'+ response.event_id]); // Navegar a la galería después de 2 segundos
                    this.snackBar.open('¡Imagen subida con éxito!', 'Cerrar', {
                        duration: 3000, // Duración de la snackbar en milisegundos
                        panelClass: 'snackbar',
                    });
                })
            }, 2000);
        }

        // Ocultar el spinner después de 2 segundos, independientemente del resultado de la respuesta
        setTimeout(() => {
            this.showSpinner = false;
        }, 2000);
    }

}
