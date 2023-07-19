import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent {
  @Input()
  public score = 0;

  @Input()
  public fontSize = 24;

  @Input()
  public readonly = true;

  @Output()
  public selectedScore: EventEmitter<number> = new EventEmitter<number>();

  public tempScore = this.score;

  public selectScore(i: number): void {
    this.score = i;
    this.tempScore = i;
    this.selectedScore.next(i);
  }
}
