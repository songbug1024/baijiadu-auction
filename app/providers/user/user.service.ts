import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'

@Injectable()
export class UserService {
  private _userUrl = '/api/auction-users';
  private _telVerifyUrl = '/auction/tel-verify';
  private _telVerifyCodeUrl = '/auction/tel-verify-code';

  constructor(private http: Http) {}

  createTelVerify (userId: string, tel: string) : Observable<any>  {
    let body = JSON.stringify({
      userId,
      tel,
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this._telVerifyUrl, body, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

  telVerifyCode (userId: string, verifyId: string, code: string) : Observable<any>  {
    let body = JSON.stringify({
      userId,
      verifyId,
      code,
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this._telVerifyCodeUrl, body, options)
        .map(res => res.json())
        .catch(this.handleError)
  }

  getBuyerAllOrderCount(userId) {
    return this.http.get(this._userUrl + '/' + userId + '/buyOrders/count')
      .map(res => res.json())
      .catch(this.handleError);
  }

  getSellerAllOrderCount(userId) {
    return this.http.get(this._userUrl + '/' + userId + '/sellOrders/count')
      .map(res => res.json())
      .catch(this.handleError);
  }

  getBuyerAllOrders(userId, opts = <{
    status: string,
    sinceId: string
  }>{}) {
    let where = <{
      status: string,
      id: any
    }>{};
    if (opts.status) where.status = opts.status;
    if (opts.sinceId) where.id = {lt: opts.sinceId};

    let filter = {
      fields: {
        _trackingRecords: false,
        _buyerInfo: false
      },
      where,
      order: 'id DESC',
      limit: 20
    };

    return this.http.get(this._userUrl + '/' + userId + '/buyOrders?filter=' + JSON.stringify(filter))
      .map(res => res.json())
      .catch(this.handleError);
  }

  getSellerAllOrders(userId, opts = <{
    status: string,
    sinceId: string
  }>{}) {
    let where = <{
      status: string,
      id: any
    }>{};
    if (opts.status) where.status = opts.status;
    if (opts.sinceId) where.id = {lt: opts.sinceId};

    let filter = {
      fields: {
        _trackingRecords: false,
        _sellerInfo: false
      },
      where,
      order: 'id DESC',
      limit: 20
    };

    return this.http.get(this._userUrl + '/' + userId + '/sellOrders?filter=' + JSON.stringify(filter))
      .map(res => res.json())
      .catch(this.handleError);
  }

  getUserProducts(userId) {
    return this.http.get(this._userUrl + '/' + userId + '/buyOrders/count')
      .map(res => res.json())
      .catch(this.handleError);
  }

  updateProperty(userId, property, value) {
    let body = JSON.stringify({
      [property]: value
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.put(this._userUrl + '/' + userId, body, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

  createOrUpdateDeliveryAddress(userId, deliveryAddress) {
    let body = JSON.stringify(deliveryAddress);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    if (!deliveryAddress.id) {
      return this.http.post(this._userUrl + '/' + userId + '/deliveryAddresses', body, options)
        .map(res => res.json())
        .catch(this.handleError)
    } else {
      deliveryAddress.modified = new Date();
      return this.http.put(this._userUrl + '/' + userId + '/deliveryAddresses/' + deliveryAddress.id, body, options)
        .map(res => res.json())
        .catch(this.handleError)
    }
  }

  deleteDeliveryAddress(userId, deliveryAddressId) {
    return this.http.delete(this._userUrl + '/' + userId + '/deliveryAddresses/' + deliveryAddressId);
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

