import {ViewChild} from 'angular2/core';
import {IonicApp, Page, Events} from 'ionic-framework/ionic';
import {ProductService} from '../../providers/product/product.service';
import {ProductList} from '../../components/product-list/product-list';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers: [ProductService],
  directives: [ProductList]
})
export class HomePage {
  listMode: string = 'auctioning';
  nowInterval: Date = new Date();

  @ViewChild('auctioningList') auctioningList;
  @ViewChild('blockingList') blockingList;
  @ViewChild('auctioningContent') auctioningContent;
  @ViewChild('blockingContent') blockingContent;

  constructor(
    private app: IonicApp,
    private productService: ProductService,
    private events: Events
  ) {}
  ngAfterViewInit() {
    this.auctioningList.queryProducts(this.__getFilter());
  }
  onPageLoaded() {
    this.events.subscribe('product:created', data => {
      let product = data.length ? data[0] : data;
      this.auctioningList.products.unshift(product);
      this.scrollTop();
    });

    setInterval(() => {
      this.nowInterval = new Date();
    }, 1000);
  }
  showAuctioningList() {
    if (this.auctioningList.products.length <= 0) this.auctioningList.queryProducts(this.__getFilter('auctioning'));
  }
  showBlockingList() {
    if (this.blockingList.products.length <= 0) this.blockingList.queryProducts(this.__getFilter('blocking'));
  }
  loadMore(mode) {
    if (mode === 'auctioning') {
      this.auctioningList.queryProducts(this.__getFilter(mode));
    } else if (mode === 'blocking') {
      this.blockingList.queryProducts(this.__getFilter(mode));
    }
  }
  scrollTop() {
    if (this.listMode === 'auctioning') {
      this.auctioningContent.scrollToTop();
    } else if (this.listMode === 'blocking') {
      this.blockingContent.scrollToTop();
    }
  }
  doRefresh(refresher) {
    console.log('Doing Refresh', refresher)

    setTimeout(() => {
      refresher.complete();
      console.log("Complete");
    }, 3000);
  }
  doStart(refresher) {
    console.log('Doing Start', refresher);
  }
  doPulling(refresher) {
    console.log('Pulling', refresher);
  }
  __getFilter(listMode: string = 'auctioning') {
    let blockingTime;
    let products;
    let status;
    let _listMode = listMode || this.listMode;

    if (_listMode === 'auctioning') {
      blockingTime = {gt: Date.now()};
      status = {inq: ['online', 'over']};
      products = this.auctioningList.products;
    } else if (_listMode === 'blocking') {
      blockingTime = {lt: Date.now()};
      status = {inq: ['online', 'over', 'success', 'no-result']};
      products = this.blockingList.products;
    }

    let sinceId = products.length > 0 && products[products.length - 1].id;
    let filter = {
      fields: {
        certificateImages: false,
        _followers: false,
        _viewers: false
      },
      where: <{
        blockingTime: any,
        status: any,
        id: any
      }>{
        blockingTime,
        status,
      },
      order: 'id DESC',
      limit: 20,
      include: [
        {
          relation: 'followers',
          scope: {
            fields: ['id', 'avatar']
          }
        },
        {
          relation: 'owner',
          scope: {
            fields: ['id', 'username', 'avatar', 'location']
          }
        }
      ]
    };

    if (sinceId) filter.where.id = {lt: sinceId};
    return filter;
  }
}
