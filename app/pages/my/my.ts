import {IonicApp, Page, Modal, Alert, NavController} from 'ionic-framework/ionic';

@Page({
  templateUrl: 'build/pages/my/my.html'
})
export class MyPage {
  constructor(
    private app: IonicApp,
    private nav: NavController
  ) {}
}
