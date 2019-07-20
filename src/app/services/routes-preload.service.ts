import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, EMPTY, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
// ***************************

class OnDemandPreloadOptions {
  constructor(public routePath: string, public preload = true) { }
}

@Injectable()
export class OnDemandPreloadStrategy implements PreloadingStrategy {
  private subject = new Subject<OnDemandPreloadOptions>();
  public state = this.subject.asObservable();

  private preloadOnDemand$: Observable<OnDemandPreloadOptions>;

  constructor() {
    this.preloadOnDemand$ = this.state;
  }

  public startPreload(routePath: string): void {
    const message = new OnDemandPreloadOptions(routePath, true);
    this.subject.next(message);
  }

  public preload(route: Route, load: () => Observable<any>): Observable<any> {
    return this.preloadOnDemand$.pipe(
      mergeMap(preloadOptions => {
        const shouldPreload = this.preloadCheck(route, preloadOptions);
        return shouldPreload ? load() : EMPTY;
      })
    );
  }

  private preloadCheck(route: Route, preloadOptions: OnDemandPreloadOptions): boolean {
    return (route && preloadOptions && preloadOptions.preload);
  }
}
