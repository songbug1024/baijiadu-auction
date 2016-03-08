import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {IONIC_DIRECTIVES} from 'ionic-framework/ionic';

@Component({
  selector: 'user-product-grid',
  template: `
    <template ngFor [ngForOf]="products" #i="index">
      <ion-row *ngIf="(i % cells === 0)">
        <template ngFor #p [ngForOf]="products" #j="index">
          <ion-col center width-50 *ngIf="j >= i && j < i + cells" (click)="showDetail(p)">
            <div class="bg-center-img {{p.previewImage.orientation}}" [ngStyle]="{ 'background-image': 'url(' + p.previewImage.yasuo + ')' }"></div>
            <p class="title" *ngIf="p.title">{{p.title}}</p>
            <ion-item>
              <button clear dark item-right large>￥{{p.price}}</button>
              <button clear dark item-left large>
                <ion-icon name="eye"></ion-icon>
                <div>{{p.viewersNum}}</div>
              </button>
            </ion-item>
          </ion-col>
        </template>
      </ion-row>
    </template>
  `,
  directives: [IONIC_DIRECTIVES]
})
export class UserProductGrid {
  @Input() products: Array<any> = [];
  @Input() cells: number = 2;
  @Output() detail = new EventEmitter();
  constructor() {}
  showDetail(product) {
    this.detail.emit(product);
  }
}
