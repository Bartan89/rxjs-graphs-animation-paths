import { Component, OnInit } from '@angular/core';
import { animationFrameScheduler, BehaviorSubject, concat, defer, interval, merge, pipe } from 'rxjs';
import { delay, map, repeat, scan, startWith, take, takeUntil, takeWhile, tap } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  points: string[] = [];

  ball = new BehaviorSubject({ x: 0, y: 0 });
  ball$ = this.ball.pipe(
    map(cor => `translate(${cor.x}px, ${-cor.y}px)`)
  )


  ngOnInit() {

    merge(
      // interval(0, animationFrameScheduler).pipe(
      //   takeWhile(x => x < 2000),
      //   map(x => ({ x: ((Math.cos(x)) * 2000), y: ((Math.sin(x)) * 2000) })),
      //   tap(cor => this.ball.next(cor)),
      //   map(cords => `translate(${cords.x}px, ${-cords.y}px)`),
      //   tap(x => this.points = [...this.points, x]),
      //   tap(x => this.points.length > 500 ? this.points = [] : null),
      // ),
      // this.duration(2000).pipe(
      //   map(t => t),
      //   map(t => (t * 200)),
      //   tap(x => this.ball.next({ x: x, y: this.ball.value.y })),
      // ),
      concat(
        this.duration(1000).pipe(
          map(x => (x ** 6)),
          map(t => t * 600),
          tap(x => this.points = [...this.points, `translate(${x}px, 0px)`]),
          tap(x => this.ball.next({ x, y: this.ball.value.y })),
        ),
        this.duration(1000).pipe(
          map(x => x ** 6),
          map(t => (t * -600) + 600),
          tap(console.log),
          //tap(x => this.points = [...this.points, `translate(${x}px, 0px)`]),
          tap(x => this.ball.next({ x, y: this.ball.value.y })),
        ),
      ),
    ).pipe(
      tap(() => this.points = [...new Set(this.points)]),
      repeat(),
    ).subscribe()





  }


  duration = (ms: number) => defer(() => {
    const start = Date.now();
    return interval(0, animationFrameScheduler).pipe(
      map(() => (Date.now() - start) / ms),
      takeWhile(n => n <= 1)
    )
  })


}

function sineInOut(t: number) {
  return Math.cos(Math.PI * t) * 10
}


function bounceOut(t: number) {
  var a = 4.0 / 11.0
  var b = 8.0 / 11.0
  var c = 9.0 / 10.0

  var ca = 4356.0 / 361.0
  var cb = 35442.0 / 1805.0
  var cc = 16061.0 / 1805.0

  var t2 = t * t

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72
}

function elasticOut(t: number) {
  return Math.sin(-13.0 * (t + 1.0) * Math.PI / 2) * Math.pow(2.0, -10.0 * t) + 1.0
}