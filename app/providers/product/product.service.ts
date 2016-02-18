import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Product}     from './product';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'

/*
  Generated class for the CategoryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ProductService {

  private _productsUrl = '/api/auction-products';

  constructor(private http: Http) {}

  queryPage(sinceId: string) {
    let filter = {
      fields: {
        certificateImages: false,
        _followers: false,
        _viewers: false,
        _auctionInfo: false
      },
      where: {
        blockingTime: {gt: Date.now()},
        status: {inq: ['coming', 'online']}
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
            fields: ['id', 'username', 'avatar']
          }
        }
      ]
    };
    if (sinceId) filter.where.id = {lt: sinceId};

    return this.http.get(this._productsUrl + '?filter=' + JSON.stringify(filter))
      .map(res => <Product[]> res.json())
      .catch(this.handleError);
  }

  addProduct (product: Product) : Observable<Product>  {
    let body = JSON.stringify(product);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this._productsUrl, body, options)
      .map(res =>  <Product> res.json())
      .catch(this.handleError)
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

