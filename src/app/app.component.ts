import { Component, OnInit } from '@angular/core';
import { animationFrameScheduler, BehaviorSubject, interval } from 'rxjs';
import { delay, map, repeat, take, takeUntil, takeWhile, tap } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  points: string[] = [];

  ball = new BehaviorSubject({ x: 0, y: 0 });
  ball$ = this.ball.pipe(
    tap(console.log),
    map(cor => `translate(${cor.x}px, ${-cor.y}px)`)
  )


  ngOnInit() {
    interval(90, animationFrameScheduler).pipe(
      takeWhile(x => x < 1000),
      map(x => ({ x: ((Math.cos(x)) * 200), y: ((Math.sin(x)) * 200) })),
      tap(cor => this.ball.next(cor)),
      map(cords => `translate(${cords.x}px, ${-cords.y}px)`),
      tap(x => this.points = [...this.points, x]),
      tap(x => this.points.length > 500 ? this.points = [] : null),
    ).subscribe()
  }


}
