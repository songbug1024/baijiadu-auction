import {App, IonicApp, Events} from 'ionic-framework/ionic';
import {TabsPage} from './pages/tabs/tabs';
import {Type} from 'angular2/core';
//import {HTTP_PROVIDERS} from 'angular2/http';
//import {IMAGELAZYLOAD_PROVIDERS, WebWorker} from 'ng2-image-lazy-load/ng2-image-lazy-load';

@App({
  templateUrl: 'build/app.html',
  config: {
    tabbarPlacement: 'bottom'
  },
  //providers: [HTTP_PROVIDERS, IMAGELAZYLOAD_PROVIDERS]
})
class ConferenceApp {
  rootPage: Type = TabsPage;

  constructor(
    private app: IonicApp,
    private events: Events
  ) {
    //WebWorker.workerUrl = '/static/js/xhrWorker.js';
  }
}
