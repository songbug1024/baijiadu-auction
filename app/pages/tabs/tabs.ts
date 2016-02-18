import {Page, Modal, NavController} from 'ionic-framework/ionic';
import {HomePage} from '../home/home';
import {PublishPage} from '../publish/publish';
import {DiscoveryPage} from '../discovery/discovery';
import {MyPage} from '../my/my';

import {Type} from 'angular2/core';

@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  tab1Root: Type = HomePage;
  tab2Root: Type = PublishPage;
  tab3Root: Type = DiscoveryPage;
  tab4Root: Type = MyPage;

  constructor(private nav: NavController) {}
  publish() {
    let modal = Modal.create(PublishPage);
    this.nav.present(modal);
  }
}
