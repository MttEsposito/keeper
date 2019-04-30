import { Injectable } from '@angular/core';

@Injectable()

export class ThemeService {

    constructor() { }

    public setTheme(): void {
        const theme = localStorage.getItem("User_theme");
        document.querySelector("body").className = theme;
    }

    public changeTheme(theme: string): void {
        localStorage.setItem("User_theme",theme);
        this.setTheme();
    }

    public getTheme(): string {
        return localStorage.getItem("User_theme") || "";
    }
}
