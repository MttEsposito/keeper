import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()

export class ThemeService {

    constructor(private auth: AuthService) { }

    public setTheme(): void {
        const { uid } = this.auth.get();
        const theme = localStorage.getItem(uid);
        document.querySelector("body").className = theme;
    }

    public changeTheme(theme: string): void {
        const { uid } = this.auth.get();
        localStorage.setItem(uid, theme);
        this.setTheme();
    }

    public getTheme(): string {
        const { uid } = this.auth.get();
        return localStorage.getItem(uid) || "";
    }

    public defaultTheme(): void {
        document.querySelector("body").className = "";
    }
}
