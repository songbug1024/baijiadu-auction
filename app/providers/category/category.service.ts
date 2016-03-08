import {Injectable}     from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {Category}     from './category';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'

/*
  Generated class for the CategoryService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CategoryService {

  private _categoriesUrl = '/api/auction-categories';

  constructor(private http: Http) {}

  load() {
    return this.http.get(this._categoriesUrl)
      .map(res => <Category[]> res.json())
      .catch(this.handleError);
  }

  getAllCategories() {
    return this.load()
      .map(categories => {
        let noParentCats: Array<Category> = [];
        let hasParentCats: Array<Category> = [];

        categories.forEach(category => {
          if (category.parentId) {
            hasParentCats.push(category);
          } else {
            noParentCats.push(category);
          }
        });

        noParentCats.map(noParentCat => {
          noParentCat.subs = [];
          hasParentCats.forEach(hasParentCat => {
            if (noParentCat.id === hasParentCat.parentId) {
              noParentCat.subs.push(hasParentCat);
            }
          });
        });

        return noParentCats;
      });
  }

  private handleError (error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

