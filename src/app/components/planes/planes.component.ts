import { PlanesService } from './../../services/planes.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IPlane } from 'src/app/models/Plane';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.css'],
})
export class PlanesComponent implements OnInit {
  constructor(private _planesService: PlanesService) {
    this.minToday = this.today;
  }

  planes: IPlane[] = [];
  filteredPlanes: IPlane[] = [];
  field: string = '';
  sortAsc: boolean = true;
  dataLoaded: boolean = false;
  total_records: number = 0;
  total_is_late: number = 0;
  recordsLoaded: boolean = false;
  stateError: any = undefined;
  today: string = new Date().toISOString().slice(0, 16);
  minToday: string;

  @ViewChild('newPlane') newPlane!: NgForm;
  @ViewChild('fromTown') fromTown!: NgForm;
  @ViewChild('airline') airline!: NgForm;
  @ViewChild('dateInput') dateInput!: NgForm;
  @ViewChild('checkInput') checkInput!: NgForm;

  ngOnInit() {
    if (this.stateError) {
      alert(`${this.stateError} Please choose scooter from a list.`);
    }
    this._planesService.getAllPlanes().subscribe(
      (res) => {
        this.planes = res;
        this.filteredPlanes = this.planes;
        this.dataLoaded = true;
      },
      (err) => {
        console.log(err);
        this.dataLoaded = true;
      }
    );
    this.getPlanesSum();
    this.getTotalIsLate();
  }

  onFilter($event: any): void {
    let inp = $event.target.value.toLocaleLowerCase();
    this.filteredPlanes = this.planes.filter(
      (pl) => pl.from_town.toLocaleLowerCase().indexOf(inp) != -1
    );
  }

  onSort(field: string): void {
    let fieldAsKey = field as keyof IPlane;
    this.field = field;
    if (this.sortAsc) {
      this.filteredPlanes.sort((a, b) => {
        return a[fieldAsKey] < b[fieldAsKey] ? -1 : 0;
      });
      this.sortAsc = !this.sortAsc;
    } else {
      this.filteredPlanes.sort((a, b) => {
        return a[fieldAsKey] > b[fieldAsKey] ? -1 : 0;
      });
      this.sortAsc = !this.sortAsc;
    }
  }

  addPlane() {
    if (this.newPlane.valid) {
      this._planesService
        .createPlane({ is_late: 0, ...this.newPlane.value })
        .subscribe(
          (res) => {
            this.planes.push(res);
            this.filteredPlanes = this.planes;
            alert(
              `Plane from ${this.fromTown.value} (${this.airline.value}) successfuly added to DB!`
            );
            this.getPlanesSum();
            this.getTotalIsLate();
          },
          (err) => console.log(err)
        );
    }
  }

  onDelete(id: number): void {
    this._planesService.deletePlane(id).subscribe(
      (res) => {
        alert(
          `Plane ${
            this.planes.find((pl) => pl.id == id)?.id
          } successfuly deleted from DB!`
        );
        this.planes = this.planes.filter((pl) => pl.id !== id);
        this.filteredPlanes = this.planes;
        this.getPlanesSum();
        this.getTotalIsLate();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUpdate(plane: IPlane): void {
    console.log(plane.arrival_time);
    plane.arrival_time = plane.arrival_time.slice(0,16);
    this._planesService.updatePlane(plane).subscribe(
      (res) => {
        alert(
          `Plane ${
            this.planes.find((pl) => pl.id == plane.id)?.id
          } successfuly updated in DB!`
        );
        console.log(res);
        this.getPlanesSum();
        this.getTotalIsLate();
      },
      (err) => {
        alert(err.error.errors[0].msg);
      }
    );
  }

  getPlanesSum() {
    this._planesService.getRecordsSum().subscribe(
      (res) => {
        this.total_records = res.total_planes;
        this.recordsLoaded = true;
      },
      (err) => console.log(err)
    );
  }

  getTotalIsLate() {
    this._planesService.getTotalIsLate().subscribe(
      (res) => {
        this.total_is_late = res.total_is_late;
      },
      (err) => console.log(err)
    );
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const dformat = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-');
    return dformat;
  }
}
