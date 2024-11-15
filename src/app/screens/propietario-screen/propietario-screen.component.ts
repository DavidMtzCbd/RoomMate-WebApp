import { Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { FacadeService } from 'src/services/facade.service';
import { PropiedadService } from 'src/services/propiedad.service';
import { MatTableDataSource } from '@angular/material/table';

declare var $:any;

@Component({
  selector: 'app-propietario-screen',
  templateUrl: './propietario-screen.component.html',
  styleUrls: ['./propietario-screen.component.scss']
})
export class PropietarioScreenComponent{
  public rol: string = "";
  public token: string = "";
  public lista_propiedades: any[] = [];

  // Definir las columnas para la tabla
  displayedColumns: string[] = ['direccion', 'habitaciones', 'capacidad', 'precio', 'estados', 'servicios_json'];
  dataSource = new MatTableDataSource<DatosPropiedad>(this.lista_propiedades as DatosPropiedad[]);

  constructor(
    public propiedadService: PropiedadService, // Servicio para propiedades
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerPropiedades();
  }


  // Obtener propiedades
  public obtenerPropiedades() {
    this.propiedadService.obtenerListaPropiedades().subscribe(
      (response) => {
        this.lista_propiedades = response;
        console.log("Lista propiedades: ", this.lista_propiedades);
        this.dataSource = new MatTableDataSource<DatosPropiedad>(this.lista_propiedades as DatosPropiedad[]);
      },
      (error) => {
        alert("No se pudo obtener la lista de propiedades");
      }
    );
  }

  // Función para editar
  public goEditar(idPropiedad: number) {
    this.router.navigate(["propiedades/" + idPropiedad]); // Redirigir a la página de editar propiedad
  }
}

export interface DatosPropiedad {
  id: number;
  direccion: string;
  habitaciones: number;
  capacidad: number;
  precio: number;
  servicios_json: string[];
  sanitarios: number;
  telefono: number;
  estados: string;
  imagenes: [];
}
