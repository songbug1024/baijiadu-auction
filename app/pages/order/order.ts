import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {UserService} from '../../providers/user/user.service'
import {OrderService} from '../../providers/order/order.service'
import {Str2DatePipe} from '../../pipes/str2date';
import {OrderDetailPage} from './order-detail';

@Page({
  templateUrl: 'build/pages/order/order.html',
  providers: [UserService, OrderService],
  pipes: [Str2DatePipe]
})
export class OrderListPage {
  orders: Array<any> = [];
  userId: string;
  statusMode: string = 'all';
  roleMode: string = 'buyer';
  noMore: boolean = false;
  loading: boolean = false;

  constructor(
    private nav: NavController,
    private userService: UserService,
    private orderService: OrderService,
    private params: NavParams
  ) {
    this.statusMode = this.params.get('statusMode');
    this.roleMode = this.params.get('roleMode');
    this.userId = this.params.get('userId');
  }
  onPageLoaded() {
    this.queryOrders();
  }
  queryOrders(reset: boolean = false) {
    let status;
    let sinceId;

    this.loading = true;
    if (!reset && this.orders && this.orders.length > 0) {
      sinceId = this.orders[this.orders.length - 1].id;
    }
    if (this.statusMode !== 'all') status = this.statusMode;

    let observable;
    if (this.roleMode === 'buyer') {
      observable = this.userService.getBuyerAllOrders(this.userId, {status, sinceId});
    } else if (this.roleMode === 'seller') {
      observable = this.userService.getSellerAllOrders(this.userId, {status, sinceId});
    }
    observable
      .subscribe(orders => {
        if (reset) this.orders = [];
        this.orders.push.apply(this.orders, orders);
        if (orders.length < 20) this.noMore = true;
        this.loading = false;
      },
        error => console.error(error));
  }
  switchStatusMode(mode) {
    if (mode !== this.statusMode) {
      this.statusMode = mode;
      this.noMore = false;
      this.queryOrders(true);
    }
  }
  showDetail(order) {
    this.orderService.getOrderById(order.id)
      .subscribe(order => {
        this.nav.push(OrderDetailPage, {
          order: order,
          userId: this.userId,
          statusMode: this.statusMode,
          roleMode: this.roleMode
        });
      },
        error => console.error(error));
  }
}
