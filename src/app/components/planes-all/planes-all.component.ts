import { PlanesService } from './../../services/planes.service';
import { IPlane } from 'src/app/models/Plane';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-planes-all',
  template: `
    <form #newPlane="ngForm" class="newPlane">
      <h6>Add new plane</h6>
      <p *ngIf="!formValid" class="alert alert-danger">
        The form is not valid. Please check all fields!
      </p>
      <div>
        From town: <input type="text" ngModel name="from_town" required />
      </div>
      <div>
        <div>
          Airline: <input type="text" ngModel name="airline" required />
        </div>
      </div>
      <div>
        Date:
        <input type="datetime-local" ngModel name="arrival_time" required />
      </div>
      <button type="submit" (click)="addPlane()">Add</button>
    </form>
    <div class="planes-list">
      <app-plane
        *ngFor="let plane of planes"
        [planeFromParent]="plane"
        (onDelete1)="onDelete($event)"
      ></app-plane>
    </div>
  `,
  styleUrls: ['./planes-all.component.css'],
})
export class PlanesAllComponent implements OnInit {
  constructor(private _planesService: PlanesService) {}
  planes: IPlane[] = [];
  fileredPlanes: IPlane[] = [];
  field: string = '';
  sortAsc: boolean = true;
  dataLoaded: boolean = false;
  plane: any;
  formValid: boolean = true;

  @ViewChild('newPlane') newPlane!: NgForm;
  ngOnInit(): void {
    this._planesService.getAllPlanes().subscribe(
      (res) => {
        this.planes = res;
        this.fileredPlanes = this.planes;
        this.dataLoaded = true;
      },
      (err) => {
        console.log(err);
        this.dataLoaded = true;
      }
    );
  }

  addPlane() {
    if (this.newPlane.valid) {
      this.plane = this._planesService
        .createPlane({ is_late: 0, ...this.newPlane.value })
        .subscribe(
          (res) => {
            this.planes.push(res);
            this.fileredPlanes = this.planes;
            alert(
              `Plane from ${this.newPlane.value.from_town} successfuly added to DB!`
            );
          },
          (err) => console.log(err)
        );
      this.formValid = true;
    } else {
      this.formValid = false;
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
        this.fileredPlanes = this.planes;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
