import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPlane } from '../models/Plane';

@Injectable({
  providedIn: 'root',
})
export class PlanesService {
  constructor(private http: HttpClient) {}

  getAllPlanes(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/planes');
  }

  getOnePlanes(id: any): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/planes/${id}`);
  }

  deletePlane(id: number) {
    return this.http.delete(`http://localhost:3000/planes/${id}`);
  }

  createPlane(plane: IPlane): Observable<IPlane> {
    return this.http.post<IPlane>(`http://localhost:3000/planes`, plane);
  }

  updatePlane(plane: any): Observable<any> {
    return this.http.put<any>(
      `http://localhost:3000/planes/${plane.id}`,
      plane
    );
  }

  getRecordsSum(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/total`);
  }

  getTotalIsLate(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/is_late`);
  }
}
