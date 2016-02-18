export interface Category {
  id: string;
  name: string;
  symbol: string;
  desc: string;
  parentId: string;
  subs: Array<Category>;
}
