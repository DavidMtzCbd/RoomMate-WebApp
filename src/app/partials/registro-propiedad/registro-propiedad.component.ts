import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { FacadeService } from 'src/services/facade.service';
import { PropiedadService } from 'src/services/propiedad.service';
declare var $:any;

@Component({
  selector: 'app-registro-propiedad',
  templateUrl: './registro-propiedad.component.html',
  styleUrls: ['./registro-propiedad.component.scss']
})
export class RegistroPropiedadComponent {

  public propiedad:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idUser: Number = 0;

  public valoresCheckbox: any = [];
  public servicios_json: any[] = [];
  public selectedImages: File[] = [];


//para el select de capacidades
public capacidades: any[] = [
  { value: '1', viewValue: '1' },
  { value: '2', viewValue: '1-2' },
  { value: '2', viewValue: '2-3' },
  { value: '2', viewValue: '4 a mas' }

];


//para el select para sanitarios
public sanitarioss: any[] = [
  { value: '1', viewValue: '1' },
  { value: '2', viewValue: '3' },
  { value: '2', viewValue: '4' },
  { value: '2', viewValue: 'Mas de 5' }

];

public estadoss: any[] = [
  { value: '1', viewValue: 'Disponible' },
  { value: '2', viewValue: 'Ocupado' }

];


public servicios: any[] = [
  { value: '1', nombre: 'Agua potable' },
  { value: '2', nombre: 'Luz electrica' },
  { value: '3', nombre: 'Internet' },
  { value: '4', nombre: 'Mascotas' },
  { value: '5', nombre: 'Cocina' },
  { value: '6', nombre: 'Estacionamiento' },
  { value: '7', nombre: 'Lavadora' },
  { value: '8', nombre: 'Amueblado' },
  { value: '9', nombre: 'Seguridad' }
];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    private propiedadService: PropiedadService,
    private facadeService: FacadeService,
  ){}

  ngOnInit() {
    this.propiedad = this.propiedadService.esquemaUsuario();
  }

  public regresar(){
    this.location.back();
  }

  public checkboxChange(event:any){
    //console.log("Evento: ", event);
    if(event.checked){
      this.propiedad.servicios_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.propiedad.servicios_json.forEach((servicio, i) => {
        if(servicio == event.source.value){
          this.propiedad.servicios_json.splice(i,1)
        }
      });
    }
    console.log("Array materias: ", this.propiedad);
  }

  onFileSelected(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Verifica que la URL base64 se esté añadiendo correctamente
        this.selectedImages.push(e.target.result); // Añadir la URL de la imagen
      };
      reader.readAsDataURL(files[i]); // Leer archivo como URL base64
    }
  }
}


  // Método para eliminar una imagen
  removeImage(index: number): void {
    this.selectedImages.splice(index, 1); // Eliminar imagen de la lista
  }


  public revisarSeleccion(nombre: string){
    if(this.propiedad.servicios_json){
      var busqueda = this.propiedad.servicios_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

  public registrar() {
    // Validar
    this.errors = [];
    this.errors = this.propiedadService.validarPropiedad(this.propiedad, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }

    // Llamar al servicio para registrar la materia
    this.propiedadService.registrarPropiedad(this.propiedad, this.selectedImages).subscribe(
      (response) => {
        alert("Propiedad registrada correctamente");
        console.log("Propiedad registrada:", response);
        if(this.token != ""){
          this.router.navigate(["home"]);
         }else{
           this.router.navigate(["/"]);
         }
      }, (error)=>{
        alert("No se pudo registrar usuario");
      }
    )
    this.errors = this.propiedadService.validarPropiedad(this.propiedad, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
  }
  obtenerListaPropiedades(): void {
    this.propiedadService.obtenerListaPropiedades().subscribe(
      (response) => {
        this.propiedad = response; // Guardar las propiedades en la variable
      },
      (error) => {
        console.error("Error al obtener las propiedades", error);
      }
    );
  }
}

//Cambios hasta aqui atras
