import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {NavController, Alert, IONIC_DIRECTIVES} from 'ionic-framework/ionic';
import {GridImg} from '../grid-img/grid-img';
import {Str2DatePipe} from '../../pipes/str2date';
import {TimeDiff} from '../../pipes/time-diff';
import {ProductService} from '../../providers/product/product.service';

declare var Auction;
@Component({
  selector: 'auction-product-item',
  template: `
    <ion-card class="auction-product">
      <ion-item>
        <ion-avatar item-left>
          <img class="avatar" src="{{product.owner.avatar}}">
        </ion-avatar>
        <h2>{{product.owner.username}}</h2>
        <p gray>{{product.owner.location}}</p>
      </ion-item>

      <ion-card-content>
        <p class="content {{isDetail ? 'detail' : ''}}" (click)="showDetail(product)">{{product.content}}</p>
        <ion-grid-img cells="4" [editable]="false" url-name="yasuo" preview-url-name="normal" [imgs]="product.uploadImages"></ion-grid-img>
      </ion-card-content>

      <ion-item class="opt1">
        <button primary small [hidden]="!product.isFreeReturn" item-right>包退</button>
        <button secondary small item-right>{{product.isFreeDelivery ? '包邮' : '邮费' + product.deliveryPrice}}</button>
        <button clear dark item-right>{{product.created | str2date | date: "MMdd"}}</button>

        <button clear dark item-left>
          <ion-icon name="eye"></ion-icon>
          <div>{{product.viewersNum}}</div>
        </button>
        <button clear dark item-left>
          <ion-icon name="heart-outline"></ion-icon>
          <div>{{product.followersNum}}</div>
        </button>
        <button clear dark item-left>
          <ion-icon name="share"></ion-icon>
          <div>分享</div>
        </button>
      </ion-item>
      <ion-item class="opt2" *ngIf="nowInterval - (product.blockingTime | str2date) < 0 && product.status === 'online'">
        <button danger item-left>
          正在拍卖
        </button>
        <button clear dark item-right>
          距离结束：{{product.blockingTime | str2date | timediff:nowInterval}}
        </button>
      </ion-item>
      <ion-item class="opt3">
        <template [ngIf]="nowInterval - (product.blockingTime | str2date) < 0">
          <template [ngIf]="!!product.isBid && product.status === 'online'">
            <ion-row>
              <ion-col width-67>
                <button secondary block (click)="auctionBid(product)" class="item-button">出价</button>
              </ion-col>
              <ion-col width-33>
                <button danger block (click)="auctionQuickBid(product)" class="item-button">快速出价</button>
              </ion-col>
            </ion-row>
          </template>
          <template [ngIf]="!product.isBid && product.status === 'online'">
            <button secondary block (click)="auctionBid(product)" class="item-button">出价</button>
          </template>
          <template [ngIf]="product.status === 'over'">
            <button secondary disabled block class="item-button">已结束</button>
          </template>
        </template>
        <template [ngIf]="nowInterval - (product.blockingTime | str2date) >= 0">
          <template [ngIf]="product.status === 'success'">
            <button secondary disabled block class="item-button">{{product.blockingTime | str2date | date: "MM/dd HH:mm"}} 结束</button>
          </template>
          <template [ngIf]="product.status != 'success'">
            <button gray disabled block class="item-button">{{product.blockingTime | str2date | date: "MM/dd HH:mm"}} 结束</button>
          </template>
        </template>
      </ion-item>
      <ion-item class="opt4">
        <ion-row center class="r1">
          <ion-col><button small clear dark block>起：￥{{product.beginningPrice}}元</button></ion-col>
          <ion-col><button small clear dark block>加：￥{{product.increasePrice}}元</button></ion-col>
          <ion-col><button small clear dark block>保：￥{{product.guaranteePrice}}元</button></ion-col>
        </ion-row>
        <ion-row center class="r2" *ngIf="product.dealPrice || product.referencePrice">
          <ion-col *ngIf="product.dealPrice"><button small clear dark block>一口：￥{{product.dealPrice}}元</button></ion-col>
          <ion-col *ngIf="product.referencePrice"><button small clear dark block>参考：￥{{product.referencePrice}}元</button></ion-col>
        </ion-row>
      </ion-item>

      <ion-list inset [hidden]="product._auctionInfo.length <= 0" class="opt5">
        <template ngFor #ai [ngForOf]="product._auctionInfo" #i="index">
          <template [ngIf]="i < (product._auctionInfoShowIndex || 3)">
            <ion-item>
              <ion-avatar item-left>
                <img src="{{ai.avatar}}">
              </ion-avatar>
              <h2>{{ai.username}}</h2>
              <h3>￥{{ai.price}}</h3>
              <p>{{ai.created | str2date | date: "MM/dd HH:mm:ss"}}</p>
              <div item-right [ngSwitch]="i === 0">
                <template [ngIf]="i === 0">
                  <template [ngIf]="nowInterval - (product.blockingTime | str2date) < 0 && product.status === 'online'">
                    <button clear danger>
                      <ion-icon name="checkmark"></ion-icon>
                      领先
                    </button>
                  </template>
                  <template [ngIf]="nowInterval - (product.blockingTime | str2date) > 0 || product.status === 'over'">
                    <button clear secondary>
                      <ion-icon name="checkmark"></ion-icon>
                      成交
                    </button>
                  </template>
                </template>
                <template [ngIf]="i != 0">
                  <button clear gray>
                    <ion-icon name="close"></ion-icon>
                    出局
                  </button>
                </template>
              </div>
            </ion-item>
          </template>
          <template [ngIf]="i === (product._auctionInfoShowIndex || 3)">
            <ion-list-header (click)="showMoreAuctionInfo(product)" text-center>查看更多（{{product._auctionInfoShowIndex || 3}}/{{product._auctionInfo.length}}）</ion-list-header>
          </template>
        </template>
        <template [ngIf]="(product._auctionInfoShowIndex || 3) >= product._auctionInfo.length">
          <ion-list-header text-center>共{{product._auctionInfo.length}}人出价</ion-list-header>
        </template>
      </ion-list>
    </ion-card>
  `,
  directives: [IONIC_DIRECTIVES, GridImg],
  pipes: [Str2DatePipe, TimeDiff]
})
export class ProductItem {
  @Input() product: any;
  @Input() nowInterval: Date = new Date();
  @Input() productService: ProductService;
  @Input() isDetail: boolean = false;

  @Output() detail = new EventEmitter();

  constructor(
    private nav: NavController
  ) {}
  showMoreAuctionInfo(product) {
    product._auctionInfoShowIndex = product._auctionInfoShowIndex || 3;
    product._auctionInfoShowIndex += 3;
  }
  showDetail(product) {
    this.detail.emit(product);
  }
  auctionBid(product) {
    this.productService.getAuctionInfo(product.id)
      .subscribe(auctionInfo => {
          this.auctionProduct(product, auctionInfo.reverse());
        },
          error => console.error(error));
  }
  auctionQuickBid(product) {
    this.productService.getAuctionInfo(product.id)
      .subscribe(auctionInfo => {
        this.auctionProductQuickBid(product, auctionInfo.reverse());
      },
        error => console.error(error));
  }
  auctionProduct(product, auctionInfo) {
    product._auctionInfo = auctionInfo;
    var currentUser = Auction.__currentUser;
    if (currentUser.id === product.ownerId) return this.__alertAuctionError();

    var guaranteePrice = product.guaranteePrice; // 保证金
    let increasePrice = product.increasePrice; // 加价
    let highestPrice = product.beginningPrice; // 默认为起拍价

    if (auctionInfo && auctionInfo.length > 0) {
      let finalAuctionInfo = auctionInfo[0];
      if (finalAuctionInfo) {
        if (currentUser.id === finalAuctionInfo.userId) return this.__alertAuctionError('温馨提示', '您已经领先了，请勿重拍');
        highestPrice = finalAuctionInfo.price;
      }
      // 查看是否已出价
      if (!product.isBid) {
        product.isBid = !!auctionInfo.find(info => info.userId === currentUser.id);
      }
    }
    var minPrice = highestPrice + increasePrice;
    var alert = Alert.create({
      title: '填写出价金额',
      message: '当前拍品的领先价为：￥' + highestPrice + '<br/>' + (guaranteePrice > 0 ? '需支付保证金：￥' + guaranteePrice : '无需保证金' ) ,
      inputs: [
        {
          name: 'auctionPrice',
          type: 'number',
          placeholder: '请输入您的出价',
          value: minPrice
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
            console.log('用户取消');
          }
        },
        {
          text: '确认',
          handler: data => {
            let auctionPrice = data.auctionPrice;

            if (auctionPrice >= minPrice) {
              if (guaranteePrice > 0 && !product.isGuarantee) {
                // TODO 去支付保证金
                this.__payGuaranteePrice(product, currentUser.id, gi => {
                  product.isGuarantee = true;
                  this.__submitAuctionInfo(alert, product, auctionPrice);
                });
              } else {
                this.__submitAuctionInfo(alert, product, auctionPrice);
              }
            }
            return false;
          }
        }
      ]
    });
    this.nav.present(alert);
  }
  auctionProductQuickBid(product, auctionInfo) {
    product._auctionInfo = auctionInfo;

    let currentUser = Auction.__currentUser;
    let highestPrice = product.beginningPrice; // 默认为起拍价
    if (auctionInfo && auctionInfo.length > 0) {
      let finalAuctionInfo = auctionInfo[0];
      if (finalAuctionInfo) {
        highestPrice = finalAuctionInfo.price;
        if (currentUser.id === finalAuctionInfo.userId) return this.__alertAuctionError('温馨提示', '您已经领先了，请勿重拍');
      }

    }
    if (currentUser.id === product.ownerId) return this.__alertAuctionError();

    let newAuctionInfo = {
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      price: highestPrice + product.increasePrice
    };

    this.productService.auctionProduct(product.id, newAuctionInfo).subscribe(
      result => {
        if (result.error) {
          return this.__BidErrorResult(result.error);
        }
        result.ai && product._auctionInfo.unshift(result.ai);
        result.status && (product.status = result.status);
      },
        error => {
        console.error(error);
      });
  }
  __payGuaranteePrice(product, userId, callback) {
    this.productService.getGuaranteeInfo(product.id)
      .subscribe(guaranteeInfo => {
        product._guaranteeInfo = guaranteeInfo;
        let userGi = guaranteeInfo.find(gi => gi.userId === userId);
        if (!userGi) {
          // TODO
          console.log('去支付保证金');

          let payOrder = 'sxdfsdfs13sdasdasda';
          this.productService.createGuaranteeInfo(product.id, { userId, payOrder })
            .subscribe(gi => callback(gi),
              error => console.error(error) );
        } else {
          callback(userGi);
        }
      },
        error => console.error(error));
  }
  __submitAuctionInfo(alert, product, price) {
    let currentUser = Auction.__currentUser;
    let auctionInfo = {
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      price,
    };

    this.productService.auctionProduct(product.id, auctionInfo).subscribe(
      result => {
        alert.dismiss(null);
        if (result.error) {
          return this.__BidErrorResult(result.error);
        }
        result.ai && product._auctionInfo.unshift(result.ai);
        result.status && (product.status = result.status);
      },
      error => {
        console.error(error);
        alert.dismiss(null);
      });
  }
  __alertAuctionError(title = null, message = null) {
    var alert = Alert.create({
      title: title || '温馨提示',
      message: message || '这是你自己的拍品哦...',
      buttons: [
        {
          text: '知道了',
          handler: () => {
            alert.dismiss(null);
          }
        }
      ]
    });
    this.nav.present(alert);
  }
  __BidErrorResult(err) {
    let errStr = '服务器繁忙，请稍后再试';
    switch (err) {
      case 'param invalid':
        errStr = '参数无效';
        break;
      case 'owner product':
        errStr = '这是你自己的拍品哦...';
        break;
      case 'blocked':
        errStr = '竞拍已截止';
        break;
      case 'over':
        errStr = '竞拍已结束';
        break;
      case 'no guarantee':
        errStr = '未支付保证金';
        break;
      case 'price invalid':
        errStr = '目前竞拍比较火爆，请重新出价';
        break;
      case 'already ahead':
        errStr = '您已经领先了，请勿重拍';
        break;
    }
    this.__alertAuctionError('出价失败', errStr);
  }
}
