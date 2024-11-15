import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorService } from './tools/error.service';
import { FacadeService } from './facade.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorService,
    private facadeService: FacadeService,
  ) { }

  public esquemaUsuario(){
    return {
      'direccion': '',
      'habitaciones': '',
      'capacidad': '',
      'precio': '',
      'servicios_json': [],
      'sanitarios': '',
      'telefono': '',
      'estados': '',
      'imagenes': [] ,
    }
  }

  // Validación del formulario
  public validarPropiedad(data: any, editar: boolean){
    console.log("validando propiedad...", data);
    let error: any = [];

    if (!this.validatorService.required(data["direccion"])) {
      error["direccion"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["habitaciones"])) {
      error["habitaciones"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["habitaciones"])){
      alert("El formato es solo números");
      error["habitaciones"] = this.errorService.numeric;
    }

    if (!this.validatorService.required(data["capacidad"])) {
      error["capacidad"] = this.errorService.required;
    }

      if (!this.validatorService.required(data["precio"])) {
        error["precio"] = this.errorService.required;
      }
      else if(!this.validatorService.numeric(data["precio"])){
        alert("El formato es solo números");
        error["precio"] = this.errorService.numeric;
      }

      if(data["servicios_json"].length == 0){
        error["servicios_json"] = "Al menos debes elegir una materia";
        alert("Debes seleccionar al menos un servicio para poder registrarte.");
      }

    if (!this.validatorService.required(data["sanitarios"])) {
      error["sanitarios"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }else if(!this.validatorService.numeric(data["telefono"])){
      alert("El formato es solo números");
      error["telefono"] = this.errorService.numeric;
    }

    if (!this.validatorService.required(data["estados"])) {
      error["estados"] = this.errorService.required;
    }

    return error;
  }

  //                    Cambiardirecciones del back
  // SERVICIOS HTTP
  // Servicio para registrar propiedad
  public registrarPropiedad(data: any, images: File[]): Observable <any>{
    const formData: FormData = new FormData();

  // Añadir datos de la propiedad al FormData
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }

  // Añadir imágenes al FormData
  images.forEach((image) => {
    formData.append('imagenes', image); // 'imagenes' debe coincidir con el nombre del campo en el backend
  });

  // Cambiar el encabezado para que no se envíe Content-Type
  return this.http.post<any>(`${environment.url_api}/propiedades/`, formData);
}


  public obtenerListaPropiedades (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-propiedades/`, {headers:headers});
  }
  // Servicio para obtener un usuario por ID
  public getPropiedadByID(idUser: number): Observable<any> {
    return this.http.get<any>(`${environment.url_api}/propiedades/?id=${idUser}`, httpOptions);
  }

  // Función para eliminar un usuario (comentada)
  public eliminarPropiedad(idUser: number): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.delete<any>(`${environment.url_api}/propiedades-edit/?id=${idUser}`, { headers: headers });
  }

  // Función para editar usuario (comentada)
  public editarPropiedad(data: any): Observable<any> {
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    return this.http.put<any>(`${environment.url_api}/propiedades-edit/`, data, { headers: headers });
  }

}
