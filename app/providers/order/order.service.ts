import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'

@Injectable()
export class OrderService {
  private _orderUrl = '/api/auction-orders';

  constructor(private http: Http) {}

  getOrderById(orderId) {
    return this.http.get(this._orderUrl + '/' + orderId)
      .map(res => res.json())
      .catch(this.handleError);
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

