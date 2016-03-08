import {Page, NavController, NavParams} from 'ionic-framework/ionic';
import {Str2DatePipe} from '../../pipes/str2date';

@Page({
  templateUrl: 'build/pages/order/order-detail.html',
  pipes: [Str2DatePipe]
})
export class OrderDetailPage {
  order: any;
  userId: string;
  statusMode: string;
  roleMode: string;

  constructor(
    private nav: NavController,
    private params: NavParams
  ) {
    this.order = this.params.get('order');
    this.statusMode = this.params.get('statusMode');
    this.roleMode = this.params.get('roleMode');
    this.userId = this.params.get('userId');
  }
}
