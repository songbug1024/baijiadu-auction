export interface Product {
  id: string;
  content: string;
  uploadImages: Array<any>;
  certificateImages: Array<any>;
  blockingTime: Date;
  beginningPrice: number;
  increasePrice: number;
  guaranteePrice: number;
  isFreeDelivery: boolean;
  deliveryPrice: number;
  isFreeReturn: boolean;
  dealPrice: number;
  referencePrice: number;
  viewersNum: number;
  followersNum: number;
  status: string;
  created: Date;
  modified: Date;
  ownerId: string;
  categoryId: string;
  subCategoryId: string;
  _followers: Array<{id: string, avatar: string}>;
  _viewers: Array<{id: string}>;
  _auctionInfo: Array<{id: string, username: string; avatar: string, price: number; status: string, created: Date}>;
}
