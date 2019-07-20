// IMPORTS
// ANGULAR CORE MODULES
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
// ***************************

@Injectable({ providedIn: "root" })

export class TitleService {


  constructor(
    private titleService: Title
  ) { }

  // CHANGE THE TITLE FOR THE PAGE
  public setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }

}
