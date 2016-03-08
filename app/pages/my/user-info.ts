import {Page, NavController, NavParams, Modal, ViewController, Alert} from 'ionic-framework/ionic';
import {UserService} from '../../providers/user/user.service';

declare var Auction;
@Page({
  templateUrl: 'build/pages/my/user-info.html',
  providers: [UserService],
})
class UserInfoPage {
  user: any;

  constructor(
    private nav: NavController,
    private params: NavParams,
    private userService: UserService
  ) {
    this.user = Auction.__currentUser;
  }
  editAutograph() {
    let modal = Modal.create(AutographPage, {autograph: this.user.autograph || ""});
    modal.onDismiss(autograph => {
      if (autograph) {
        this.userService.updateProperty(this.user.id, 'autograph', autograph)
          .subscribe(user => {
            this.user.autograph = user.autograph;
          },
            error => console.error(error));
      }
    });
    this.nav.present(modal);
  }
  editRealName() {
    let modal = Modal.create(RealNamePage, {realname: this.user.realname || ""});
    modal.onDismiss(realname => {
      if (realname) {
        this.userService.updateProperty(this.user.id, 'realname', realname)
          .subscribe(user => {
            this.user.realname = user.realname;
          },
            error => console.error(error));
      }
    });
    this.nav.present(modal);
  }
  editDeliveryAddresses() {
    this.nav.push(DeliveryAddressesPage, {
      defaultDeliveryAddress: this.user.defaultDeliveryAddress,
      deliveryAddresses: this.user._deliveryAddresses || []
    });
  }
}

@Page({
  templateUrl: 'build/pages/my/user-info-autograph.html'
})
class AutographPage {
  autograph: string = "";

  constructor(
    private viewCtl: ViewController,
    private params: NavParams
  ) {
    this.autograph = this.params.get('autograph');
  }
  dismiss(autograph = null) {
    this.viewCtl.dismiss(autograph);
  }
}

@Page({
  templateUrl: 'build/pages/my/user-info-realname.html'
})
class RealNamePage {
  realname: string = "";

  constructor(
    private viewCtl: ViewController,
    private params: NavParams
  ) {
    this.realname = this.params.get('realname');
  }
  dismiss(realname = null) {
    this.viewCtl.dismiss(realname);
  }
}

@Page({
  templateUrl: 'build/pages/my/user-info-delivery-addresses.html'
})
class DeliveryAddressesPage {
  user: any;
  defaultDeliveryAddress: string;
  deliveryAddresses: Array<any> = [];

  constructor(
    private nav: NavController,
    private params: NavParams,
    private userService: UserService
  ) {
    this.user = Auction.__currentUser;
    this.defaultDeliveryAddress = this.params.get('defaultDeliveryAddress');
    this.deliveryAddresses = this.params.get('deliveryAddresses');
  }
  createOrEdit(deliveryAddress) {
    let modal = Modal.create(DeliveryAddressPage, {deliveryAddress: deliveryAddress || {}});
    modal.onDismiss(deliveryAddress => {
      if (deliveryAddress) {
        this.userService.createOrUpdateDeliveryAddress(this.user.id, deliveryAddress)
          .subscribe(deliveryAddress => {
            let index = this.deliveryAddresses.findIndex((da) => da.id === deliveryAddress.id);
            if (index != -1) {
              this.deliveryAddresses[index] = deliveryAddress;
            } else {
              this.deliveryAddresses.push(deliveryAddress);
            }
            this.checkDefaultDeliveryAddress(deliveryAddress);
          },
            error => console.error(error));
      }
    });
    this.nav.present(modal);
  }
  checkDefaultDeliveryAddress(deliveryAddress) {
    if (!this.defaultDeliveryAddress) {
      this.saveAsDefault(deliveryAddress);
    }
  }
  resetDefaultDeliveryAddress() {
    if (this.deliveryAddresses.length <= 0) {
      this.saveAsDefault(null);
    }
  }
  confirmDelete(deliveryAddress) {
    let confirm = Alert.create({
      title: '删除确认',
      message: '删除后的收货地址不能再恢复，您确认要删除吗？',
      buttons: [
        {
          text: '点错了',
          handler: () => {
            console.log('点错了');
          }
        },
        {
          text: '删除',
          handler: () => {
            this.remove(deliveryAddress);
          }
        }
      ]
    });
    this.nav.present(confirm);
  }
  remove(deliveryAddress) {
    if (deliveryAddress && deliveryAddress.id) {
      this.userService.deleteDeliveryAddress(this.user.id, deliveryAddress.id)
        .subscribe(res => {
          if (res.statusText === 'Ok') {
            let index = this.deliveryAddresses.findIndex((da) => da.id === deliveryAddress.id);
            this.deliveryAddresses.splice(index, 1);

            this.resetDefaultDeliveryAddress();
          }
        },
          error => console.error(error));
    }
  }
  saveAsDefault(deliveryAddress) {
    let deliveryAddressId = deliveryAddress && deliveryAddress.id;
    deliveryAddressId = deliveryAddressId || null;

    this.userService.updateProperty(this.user.id, 'defaultDeliveryAddress', deliveryAddressId)
      .subscribe(user => {
        this.user.defaultDeliveryAddress = user.defaultDeliveryAddress;
        this.defaultDeliveryAddress = user.defaultDeliveryAddress;
      },
        error => console.error(error));
  }
}

@Page({
  templateUrl: 'build/pages/my/user-info-delivery-address.html'
})
class DeliveryAddressPage {
  deliveryAddress: any;

  constructor(
    private viewCtl: ViewController,
    private params: NavParams
  ) {
    this.deliveryAddress = this.params.get('deliveryAddress');
  }
  dismiss(deliveryAddress = null) {
    this.viewCtl.dismiss(deliveryAddress);
  }
}
export {UserInfoPage, AutographPage, DeliveryAddressesPage};
