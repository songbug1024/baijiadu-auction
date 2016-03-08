import {NavController, IONIC_DIRECTIVES} from 'ionic-framework/ionic';
import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {ProductItem} from './product-item';
import {ProductService} from '../../providers/product/product.service';
import {ProductDetailPage} from '../../pages/product-detail/product-detail';

@Component({
  selector: 'auction-product-list',
  template: `
    <auction-product-item *ngFor="#p of products"
      (detail)="showDetail($event)"
      [product]="p"
      [nowInterval]="nowInterval"
      [productService]="productService">
    </auction-product-item>
    <!--<ion-list-header [hidden]="products.length > 0">-->
      <!--无拍卖数据-->
    <!--</ion-list-header>-->
    <button block clear small dark [hidden]="noMore" (click)="loadMoreProducts()">加载更多</button>
  `,
  directives: [ProductItem, IONIC_DIRECTIVES],
})
export class ProductList {
  products: Array<any> = [];
  noMore: boolean = false;

  @Input() productService: ProductService;
  @Input() nowInterval: Date = new Date();
  @Output() loadMore = new EventEmitter();

  constructor(
    private nav: NavController
  ) {}
  queryProducts(filter) {
    this.productService.queryProducts(filter)
      .do(products => {
        products.forEach(product => product._auctionInfo && product._auctionInfo.reverse());
      })
      .subscribe(products => {
          this.products.push.apply(this.products, products);
          if (products.length < 20) this.noMore = true;
        },
        error => console.error(error));
  }
  loadMoreProducts() {
    this.loadMore.emit(null);
  }
  showDetail(product) {
    this.productService.queryProductById(product.id)
      .do(product => {
        product._auctionInfo && product._auctionInfo.reverse()
      })
      .subscribe(p => {
        this.nav.push(ProductDetailPage, {product: p});

        let index = this.products.findIndex(v => v.id === product.id);
        if (index !== -1) this.products[index] = p;
      },
        error => console.error(error));
  }
}
