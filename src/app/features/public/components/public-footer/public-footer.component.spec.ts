import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { PublicFooterComponent } from './public-footer.component';

describe('PublicFooterComponent', () => {
  let fixture: ComponentFixture<PublicFooterComponent>;
  let component: PublicFooterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicFooterComponent);
    component = fixture.componentInstance;
  });

  it('opens and closes the mobile download modal from documentation link', () => {
    component.openDownloadModal();
    expect(component.isDownloadModalOpen).toBe(true);

    component.closeDownloadModal();
    expect(component.isDownloadModalOpen).toBe(false);
  });
});
