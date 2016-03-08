import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {ProductService} from '../../providers/product/product.service'
import {ProductItem} from '../../components/product-list/product-item';
import {UserProductGrid} from '../../components/user-products/product-grid';

@Page({
  templateUrl: 'build/pages/product-detail/product-detail.html',
  providers: [ProductService],
  directives: [ProductItem, UserProductGrid]
})
export class ProductDetailPage {
  product: any;
  ownerProducts: Array<any> = [];
  nowInterval: Date = new Date();

  constructor(
    private nav: NavController,
    private productService: ProductService,
    private params: NavParams
  ) {
    this.product = this.params.get('product');
  }
  onPageLoaded() {
    setInterval(() => {
      this.nowInterval = new Date();
    }, 1000);
  }
  onPageDidEnter() {
    // 更新查看人数

    // 查询当前用户的最热拍品
    this.queryOwnerProducts();
  }
  queryOwnerProducts() {
    let filter = {
      fields: {
        id: true,
        content: true,
        uploadImages: true,
        viewersNum: true,
        beginningPrice: true
      },
      where: {
        ownerId: this.product.ownerId,
        //blockingTime: {gt: Date.now()}
      },
      order: 'viewersNum DESC',
      limit: 6
    };
    this.productService.queryProducts(filter)
      .do(products => {
        products.forEach(product => {
          product.previewImage = {};
          if (product.uploadImages && product.uploadImages.length > 0) {
            product.previewImage = product.uploadImages[0];
          }
          product.title = (product.content.length > 20 ? product.content.substr(0, 20) : product.content) + '...';
          product.price = product.beginningPrice;
        });
      })
      .subscribe(products => {
          this.ownerProducts = products;
        },
        error => console.error(error));
  }
  showOwnerProductDetail(product) {
    this.productService.queryProductById(product.id)
      .do(product => {
        product._auctionInfo && product._auctionInfo.reverse()
      })
      .subscribe(product => {
          this.nav.push(ProductDetailPage, {product});
          setTimeout(() => this.nav.remove(1), 1000);
        },
        error => console.error(error));
  }
}
