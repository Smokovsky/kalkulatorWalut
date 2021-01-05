import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export class DOMHelper<T> {
  private fixture: ComponentFixture<T>;

  constructor(fixture: ComponentFixture<T>) {
    this.fixture = fixture;
  }

  queryOne(tagName: string) {
    return this.fixture.debugElement.query(By.css(tagName));
  }

  queryAll(tagName: string) {
    return this.fixture.debugElement.queryAll(By.css(tagName));
  }

  count(tagName: string): number {
    const elements = this.fixture.debugElement.queryAll(By.css(tagName));
    return elements.length;
  }

}
