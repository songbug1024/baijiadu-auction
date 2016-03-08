import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {Page, Modal, ViewController, NavController, NavParams, IONIC_DIRECTIVES} from 'ionic-framework/ionic';

@Component({
  selector: 'ion-grid-img',
  template: `
    <template ngFor [ngForOf]="imgs" #i="index">
      <ion-row *ngIf="(i % cells === 0)">
        <template ngFor #cell [ngForOf]="imgs" #j="index">
          <ion-col center width-25 *ngIf="j >= i && j < i + cells">
            <ion-icon gray class="del-btn" name="close-circle" *ngIf="editable" (click)="delImg(cell)"></ion-icon>
            <div class="bg-center-img {{cell[orientationName]}}" [ngStyle]="{ 'background-image': 'url(' + cell[urlName] + ')' }" (click)="previewImg(cell)">
            </div>
          </ion-col>
        </template>
      </ion-row>
    </template>
  `,
  directives: [IONIC_DIRECTIVES]
})
export class GridImg implements OnInit {
  @Input() imgs: Array<any> = [];
  @Input('orientation-name') orientationName: string = 'orientation';
  @Input('url-name') urlName: string = 'url';
  @Input('preview-url-name') previewUrlName: string = this.urlName;

  @Input() cells: number = 3;
  @Input() editable: boolean = false;
  @Output() imgDeleted = new EventEmitter();

  colWidth: string = 'width-25';

  constructor(private nav: NavController) {}
  delImg(item) {
    if (item) this.imgDeleted.emit(item);
  }
  ngOnInit() {
    //this.resetColWidth();
  }
  resetColWidth() {
    let r = 'width-25';

    switch (this.cells) {
      case 5:
        r = 'width-20';
        break;
      case 4:
        r = 'width-25';
        break;
      case 3:
        r = 'width-33';
        break;
      case 2:
        r = 'width-50';
        break;
      case 1:
      default:
        r = '';
        break;
    }
    this.colWidth = r;
  }
  previewImg(item) {
    let modal = Modal.create(ModalPreview, {
      index: this.imgs.indexOf(item),
      imgs: this.imgs,
      urlName: this.previewUrlName
    });
    this.nav.present(modal);
  }
}

@Page({
  template: `
    <ion-toolbar>
      <ion-title>
        图片预览
      </ion-title>
      <ion-buttons end>
        <button dark (click)="dismiss()">关闭</button>
      </ion-buttons>
    </ion-toolbar>
    <ion-slides pager [index]="initIndex" bounce zoom="2" zoomMax="3">
      <ion-slide *ngFor="#i of imgs">
        <img src="{{i}}"/>
      </ion-slide>
    </ion-slides>
   `
})

class ModalPreview {
  private initIndex: number = 0;
  private imgs: Array<any> = [];

  constructor(
      private params: NavParams,
      private viewCtrl: ViewController
  ) {
    this.initIndex = params.get('index');
    let imgs = params.get('imgs');
    let urlName = params.get('urlName');

    let temp = imgs.map(img => {
      return img[urlName];
    });
    this.imgs = temp;
  }
  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
