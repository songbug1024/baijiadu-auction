import {Page, Modal, ViewController, NavController, NavParams} from 'ionic-framework/ionic';
import {Component, Input, Output, EventEmitter, OnInit} from 'angular2/core';
import {FileUploader, FileSelect} from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'ion-uploader',
  template: `
    <input [name]="name" type="file" ng2-file-select [uploader]="uploader" multiple/>
  `,
  directives: [FileSelect]
})
export class Uploader implements OnInit {
  @Input() name: string = 'images[]';
  @Input() url: string;
  @Input('auto-upload') autoUpload: boolean = true;
  @Input('limit') queueLimit: number = 20;

  @Output() itemAppend = new EventEmitter();

  private uploader: FileUploader;
  private modalShowing: boolean = false;

  constructor(private nav: NavController) {}
  ngOnInit() {
    this.uploader = new FileUploader({url: this.url});
    this.uploader.autoUpload = this.autoUpload;
    this.uploader.queueLimit = this.queueLimit;
    this.uploader.onBeforeUploadItem = (item) => this.onBeforeUploadItem(item);
  }
  onBeforeUploadItem(item) {
    if (!this.modalShowing) {
      this.modalShowing = true;

      let modal = Modal.create(ModalUploading, { uploader: this.uploader });
      this.nav.present(modal);

      modal.onDismiss(data => {
        this.modalShowing = false;
        this.uploader.clearQueue();
        if (data && data.length > 0) this.itemAppend.emit(data);
      });
    }
  }
}

@Page({
  template: `
    <div class="uploader-wrapper">
      <div class="uploader-progress" [ngStyle]="{ 'width': total + '%' }"></div>
      <p light padding-top>资源上传中...（{{uploaded}}/{{uploader.queue.length}}）</p>
      <button (click)="cancel()" light outline small>取消</button>
    </div>
  `
})
class ModalUploading {
  private uploader: FileUploader;
  progress: number = 0;
  total: number = 0;
  uploaded: number = 1;

  constructor(
    private params: NavParams,
    private viewCtrl: ViewController
  ) {
    this.uploader = params.get('uploader');
    this.uploader.onProgressItem = (item, progress) => this.onProgressItem(item, progress);
    this.uploader.onProgressAll = (total) => this.onProgressAll(total);
    this.uploader.onCompleteItem = (item, response, status, headers) => this.onCompleteItem(item, response, status, headers);
    this.uploader.onCompleteAll = () => this.onCompleteAll();
  }
  onProgressItem(item, progress) {
    this.progress = progress;
  }
  onProgressAll(total) {
    this.total = total;
  }
  onCompleteItem(item, response, status, headers) {
    let notUploaded = this.uploader.getNotUploadedItems().length;
    this.uploaded = notUploaded ? this.uploader.queue.length - notUploaded : this.uploader.queue.length;
  }
  onCompleteAll() {
    let data = [];
    this.uploader.queue.forEach(item => {
      data.push(JSON.parse(item._xhr.response));
    });
    setTimeout(() => this.viewCtrl.dismiss(data), 500);
  }
  cancel(data) {
    this.uploader.cancelAll();
    this.viewCtrl.dismiss(data);
  }
}

