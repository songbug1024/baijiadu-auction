import {IonicApp, Page, Modal, Alert, NavController} from 'ionic-framework/ionic';
import {ProductService} from '../../providers/product/product.service'
import {Product} from '../../providers/product/product'
import {GridImg} from '../../components/grid-img/grid-img'
import {Str2DatePipe} from '../../pipes/str2date'

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [ProductService],
  directives: [GridImg],
  pipes: [Str2DatePipe]
})
export class HomePage {
  products: Array<Product> = [];
  sinceId: string
  errorMessage: any;
  noMoreProducts: boolean = false;

  constructor(
    private app: IonicApp,
    private nav: NavController,
    private productService: ProductService
  ) {
    this.queryProducts();
  }

  showDetail(product) {

  }

  queryProducts() {
    this.productService.queryPage(this.sinceId).subscribe(
      products => {
        this.products = products;
        if (this.products.length <= 20) this.noMoreProducts = true;

        let lastProduct = this.products[this.products.length - 1];
        if (lastProduct) this.sinceId = lastProduct.id;
      },
      error => this.errorMessage = <any> error);
  }
  doStarting() {
    console.log('doStarting');
  }
  doRefresh($event) {
    console.log('doRefresh', $event);
  }
  doPulling($event) {
    console.log('doPulling', $event);
  }
}
