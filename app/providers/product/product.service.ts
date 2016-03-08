import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'

@Injectable()
export class ProductService {
  private _productsUrl = '/api/auction-products';

  constructor(private http: Http) {}

  queryProducts(filter) {
    return this.http.get(this._productsUrl + '?filter=' + JSON.stringify(filter))
      .map(res => res.json())
      .catch(this.handleError);
  }

  addProduct(product: any) : Observable<any>  {
    let body = JSON.stringify(product);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this._productsUrl, body, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

  auctionProduct(productId, auctionInfo) {
    let body = JSON.stringify({
      productId,
      ai: auctionInfo
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let url = this._productsUrl + '/bid';
    return this.http.post(url, body, options)
        .map(res => res.json())
        .catch(this.handleError)
  }

  getAuctionInfo(productId) {
    return this.http.get(this._productsUrl + '/' + productId + '/auctionInfo')
        .map(res => res.json())
        .catch(this.handleError);
  }

  getGuaranteeInfo(productId) {
    return this.http.get(this._productsUrl + '/' + productId + '/guaranteeInfo')
      .map(res => res.json())
      .catch(this.handleError);
  }

  createGuaranteeInfo(productId, guaranteeInfo: any) : Observable<any> {
    let body = JSON.stringify(guaranteeInfo);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this._productsUrl + '/' + productId + '/guaranteeInfo', body, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

  queryProductById(id) {
    let filter = {
      fields: {
        _viewers: false
      },
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
    return this.http.get(this._productsUrl + '/' + id + '?filter=' + JSON.stringify(filter))
      .map(res => res.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

