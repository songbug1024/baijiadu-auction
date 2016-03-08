import {Page, Modal, NavController, Alert, Events} from 'ionic-framework/ionic';
import {HomePage} from '../home/home';
import {PublishPage} from '../publish/publish';
import {DiscoveryPage} from '../discovery/discovery';
import {MyPage} from '../my/my';
import {UserService} from '../../providers/user/user.service'

declare var Auction;
@Page({
  templateUrl: 'build/pages/tabs/tabs.html',
  providers: [UserService]
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = PublishPage;
  tab3Root: any = DiscoveryPage;
  tab4Root: any = MyPage;

  constructor(
      private nav: NavController,
      private userService: UserService,
      private events: Events
  ) {}

  publish() {
    var currentUser = Auction.__currentUser;
    if (!currentUser && currentUser.id) return console.error('not login.');

    if (!currentUser.tel) {
      // 要求输入手机号
      var step = 1;
      var verifyId;
      var alert = Alert.create({
        title: '填写手机号',
        message: '在发布拍品之前，填写手机号可以让您的拍品更真实！',
        inputs: [
          {
            name: 'tel',
            type: 'tel',
            placeholder: '请输入11位手机号'
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
              if (step === 1) {
                // 第一步，输入手机号
                if (data.tel && /^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(data.tel)) {
                  this.userService.createTelVerify(currentUser.id, data.tel)
                      .subscribe(
                          data => {
                            if (data.err) return console.error(data.err);

                            verifyId = data.result;
                            step = 2;
                            alert.addInput({
                              name: 'code',
                              type: 'number',
                              placeholder: '请输入验证码'
                            });
                            alert.setMessage('请在验证码框中输入您手机上收到的验证码...');
                          },
                          error => console.error(error));
                }
              } else if (step === 2) {
                if (data.code && /^[0-9]{4}$/.test(data.code) && verifyId) {
                  this.userService.telVerifyCode(currentUser.id, verifyId, data.code)
                      .subscribe(
                          data => {
                            if (data.err) return console.error(data.err);

                            currentUser.tel = data.result;
                            alert.dismiss(null);
                            setTimeout(() => this.startPublishPage(), 600);
                          },
                          error => console.error(error));
                }
              }
              return false;
            }
          }
        ]
      });
      this.nav.present(alert);
    } else {
      this.startPublishPage();
    }
  }
  startPublishPage() {
    let modal = Modal.create(PublishPage);
    modal.onDismiss(product => {
      if (product) {
        let currentUser = Auction.__currentUser;

        product.owner = {
          id: currentUser.id,
          avatar: currentUser.avatar,
          username: currentUser.username
        };
        setTimeout(() => this.events.publish('product:created', product), 100);
      }
    });
    this.nav.present(modal);
  }
}
