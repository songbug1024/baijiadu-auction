import {Page, ViewController, Alert, NavController, Modal, Storage, LocalStorage} from 'ionic-framework/ionic';
import {Uploader} from '../../components/uploader/uploader';
import {CategoryService} from '../../providers/category/category.service'
import {ProductService} from '../../providers/product/product.service'
import {Category} from '../../providers/category/category'
import {Product} from '../../providers/product/product'
import {GridImg} from '../../components/grid-img/grid-img'

declare var Auction;
@Page({
  templateUrl: 'build/pages/publish/publish.html',
  directives: [Uploader, GridImg],
  providers: [CategoryService, ProductService]
})
export class PublishPage {
  private product: any;
  private categories: Array<Category>;
  private subCategories: Array<Category>;
  private blockingTimeAlertOptions = {
    title: '截止时间',
    subTitle: '请选择拍品的截止时间'
  };
  private categoryIdAlertOptions = {
    title: '分类',
    subTitle: '请选择拍品的分类信息'
  };
  private subCategoryIdAlertOptions = {
    title: '详细分类',
    subTitle: '请选择拍品的详细分类信息'
  };
  private blockingTimeOptions: Array<{key: Date, value: string}> = [];
  private errorMessage: any;
  private isSubmiting: boolean = false;
  private localStorage: Storage = new Storage(LocalStorage);

  constructor(
    private viewCtrl: ViewController,
    private nav: NavController,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {
    this.product = {
      uploadImages: [],
      isFreeDelivery: true,
      ownerId: Auction.__currentUser.id
    };

    this.__resetBlockingTimeOptions();

    this.localStorage.getJson('categories')
      .then(categories => {
        categories = categories && JSON.parse(categories);
        if (categories && categories.length > 0) this.categories = categories;
        else this.__getCategories();
      });
  }
  dismiss(data) {
    let confirm = Alert.create({
      title: '取消确认',
      message: '当前填写的数据可能会丢失，您是否要取消该拍品？',
      buttons: [
        {
          text: '返回填写',
          handler: () => {
            console.log('返回填写');
          }
        },
        {
          text: '离开关闭',
          handler: () => {
            this.viewCtrl.dismiss(null);
          }
        }
      ]
    });
    this.nav.present(confirm);
  }
  categoryChanged(categoryId) {
    this.product.categoryId = categoryId;
    if (categoryId) {
      let category = this.categories.find(c => c.id === categoryId);
      if (category && category.subs && category.subs.length > 0) this.subCategories = category.subs;
      else this.subCategories = null;
    } else this.subCategories = null;

    this.product.subCategoryId = null;
  }
  uploadImageAppended(data) {
    data.forEach(item => {
      if (!item.err && item.results) {
        let image = item.results['file'][0];
        if (image && this.product.uploadImages.length < 8) {
          this.product.uploadImages.push(image);
        }
      }
    });
  }
  delUploadImage(item) {
    let temp = [];
    this.product.uploadImages.forEach(_item => {
      if (_item !== item) temp.push(_item);
    });
    this.product.uploadImages = temp;
  }
  onSubmit() {
    console.log('onSubmit', this.product);
    this.isSubmiting = true;
    if (this.product.uploadImages.length <= 0) return;

    this.product.status = 'coming'; // 即将开拍
    this.productService.addProduct(this.product)
      .subscribe(
        product  => {
          console.log(product);
          this.viewCtrl.dismiss(product);
        },
        error =>  this.errorMessage = <any>error);
  }
  confirmDraft() {
    let confirm = Alert.create({
      title: '温馨提示',
      message: '存为草稿可以在我的拍品中继续编辑...',
      buttons: [
        {
          text: '好的',
          handler: () => {
            this.viewCtrl.dismiss(null);
          }
        }
      ]
    });
    this.nav.present(confirm);
  }
  saveAsDraft() {
    this.isSubmiting = false;
    this.product.status = 'editing'; // 草稿、编辑中

    if (this.product.blockingTime && this.product.blockingTime.length === 0) this.product.blockingTime = undefined;
    if (this.product.categoryId && this.product.categoryId.length === 0) this.product.categoryId = undefined;
    if (this.product.subCategoryId && this.product.subCategoryId.length === 0) this.product.subCategoryId = undefined;

    this.productService.addProduct(this.product)
      .subscribe(
        product  => {
          this.confirmDraft();
        },
        error =>  this.errorMessage = <any>error);
  }
  __getCategories() {
    this.categoryService.getAllCategories().subscribe(
      categories => {
        this.categories = categories;
        this.localStorage.setJson('categories', categories);
      },
      error => this.errorMessage = <any> error);
  }
  __resetBlockingTimeOptions() {
    let now = new Date();
    let parts = [10, 12, 14, 16, 18, 19, 20, 21, 22, 23];
    let hours = now.getHours() + 1;
    let isFirstPart = false;
    this.blockingTimeOptions = [];

    // 当天
    for (let p of parts) {
      if (hours < p) {
        let opt = (now.getMonth() + 1) + '月' + now.getDate() + '日';
        if (!isFirstPart) {
          isFirstPart = true;
          opt += '（今天）';
        } else {
          opt += ' ';
        }
        opt += (p + ':00');
        this.blockingTimeOptions.push({
          key: new Date(now.getFullYear(), now.getMonth(), now.getDate(), p - 1, 0, 0),
          value: opt
        });
      }
    }
    // 第二天
    isFirstPart = false;
    let tomorrow = new Date(now.getTime() + (1000 * 60 * 60 * 24));
    for (let p of parts) {
      if (this.blockingTimeOptions.length < parts.length) {
        let opt = (tomorrow.getMonth() + 1) + '月' + tomorrow.getDate() + '日';
        if (!isFirstPart) {
          isFirstPart = true;
          opt += '（明天）';
        } else {
          opt += ' ';
        }
        opt += (p + ':00');
        this.blockingTimeOptions.push({
          key: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), p - 1, 0, 0),
          value: opt
        });
      } else {
        break;
      }
    }
  }
}
