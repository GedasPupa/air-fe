import { IPlane } from 'src/app/models/Plane';
import { PlanesService } from './../../services/planes.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-plane',
  template: `
    <form class="card" #onePlaneInfo="ngForm" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">PLANE ID: {{ planeFromParent.id }}</h5>
        <p class="card-text">
          Some quick example text to make up the bulk of the card's content.
        </p>
      </div>
      <ul class="list-group list-group-flush">
      <li class="list-group-item">
          From town: {{ planeFromParent.from_town }}
          <input name="from_town" ngModel />
        </li>
        <li class="list-group-item">
          Airline: {{ planeFromParent.airline }}
          <input name="airline" ngModel />
        </li>
         <li class="list-group-item">
          Arrive Time:<br />{{
            planeFromParent.arrival_time.slice(0, 16).replace('T', ' ')
          }}
          <input type="datetime-local" name="arrival_time" ngModel />
        </li>
      </ul>
      <div class="card-body">
        <button
          (click)="onUpdate($event)"
          class="card-link"
          id="{{ planeFromParent.id }}"
        >
          Update
        </button>
        <button (click)="onDelete(planeFromParent.id)" class="card-link">
          Delete
        </button>
      </div>
    </form>
  `,
  styleUrls: ['./plane.component.css'],
})
export class PlaneComponent implements OnInit {
  @Input() planeFromParent!: IPlane;
  @Output() onDelete1: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('onePlaneInfo') onePlaneInfo!: NgForm;
  constructor(private _planesService: PlanesService) {}
  plane!: IPlane;

  ngOnInit(): void {
    this.plane = this.planeFromParent;
  }

  onUpdate($event: any) {
    this.onePlaneInfo.value.from_town != ''
      ? (this.plane.from_town = this.onePlaneInfo.value.from_town)
      : undefined;
    this.onePlaneInfo.value.airline != ''
      ? (this.plane.airline = this.onePlaneInfo.value.airline)
      : undefined;
    this.plane.arrival_time =
      this.onePlaneInfo.value.arrival_time != ''
        ? this.onePlaneInfo.value.arrival_time
        : new Date().toISOString().slice(0, 16);
    this._planesService.updatePlane(this.plane).subscribe(
      (res) => {
        alert(
          `Plane ID: ${this.plane.id} successfuly updated in DB!`
        );
        console.log(res)
      },
      (err) => console.log(err)
    );
  }

  onDelete(id: number): void {
    this.onDelete1.emit(id);
  }
}
