import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: "root" })

export class LoaderService {

    private _loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public loading: Observable<boolean> = this._loader.asObservable();

    constructor() { }

    // show the loader
    public present(): void {
        this._loader.next(true);
    }

    // hide the loader
    public dismiss(): void {
        this._loader.next(false);
    }

}
