import {IonicApp, Page, Modal, Alert, NavController} from 'ionic-framework/ionic';
import {UserProductGrid} from '../../components/user-products/product-grid';
import {ProductDetailPage} from '../../pages/product-detail/product-detail';
import {UserInfoPage} from '../../pages/my/user-info';
import {OrderListPage} from '../../pages/order/order';
import {ProductService} from '../../providers/product/product.service';
import {UserService} from '../../providers/user/user.service';

declare var Auction;
@Page({
  templateUrl: 'build/pages/my/my.html',
  directives: [UserProductGrid],
  providers: [ProductService, UserService],
})
export class MyPage {
  roleMode: string = 'buyer';
  productsMode: string = 'attended';
  user: any;

  constructor(
    private app: IonicApp,
    private nav: NavController,
    private productService: ProductService,
    private userService: UserService
  ) {
    this.user = Auction.__currentUser;
    this.user.orderCount = this.user.orderCount || 0;
    this.user.messageCount = this.user.messageCount || 0;
    this.user._attendedProducts = this.user._attendedProducts || [];
    this.user._followedProducts = this.user._followedProducts || [];
    this.user._viewedProducts = this.user._viewedProducts || [];
  }
  onPageDidEnter() {
    if (this.roleMode === 'buyer') {
      this.loadBuyerData();
    } else if (this.roleMode === 'seller') {
      this.loadSellerData();
    }
    // loadCommonData
  }
  loadBuyerData() {
    // 加载总订单数量
    this.userService.getBuyerAllOrderCount(this.user.id)
      .subscribe(data => {
        this.user.orderCount = data.count;
      },
        error => console.error(error));

  }
  loadSellerData() {

  }
  showOrderListPage(statusMode) {
    this.nav.push(OrderListPage, {
      userId: this.user.id,
      statusMode,
      roleMode: this.roleMode
    });
  }
  showProductDetail(product) {
    this.productService.queryProductById(product.productId)
      .do(product => {
        product._auctionInfo && product._auctionInfo.reverse()
      })
      .subscribe(p => {
        this.nav.push(ProductDetailPage, {product: p});
      },
        error => console.error(error));
  }
  showUserInfo() {
    this.nav.push(UserInfoPage);
  }
}
