import {IonicApp, Page, NavController} from 'ionic-framework/ionic';

@Page({
  templateUrl: 'build/pages/discovery/discovery.html'
})
export class DiscoveryPage {
  constructor(
    private app: IonicApp,
    private nav: NavController
  ) {}
}
