export interface Listing {
  id: { uuid: string };
  type: 'listing';
  attributes: ListingAttributes;
}

export interface ListingSearch {
  data: Listing[];
  meta: SearchResultsMeta;
}

export interface ListingQuery {
  data: Listing;
  meta: SearchResultsMeta;
}

export interface SearchResultsMeta {
  page: number;
  prePage: number;
  totalItems: number;
  totalPages: number;
}

export interface ListingAttributes {
  title: string;
  createdAt: Date;
  publicData: ListingPublicData;
  state: string;
  deleted: boolean;
}

export interface ListingPublicData {
  commission: string;
  subtitle: string;
  composer: string;
  duration: string;
  ensemble: string;
  instrumentation: string[];
  year: string;
  preview: ListingPreview;
  formats: ListingFormat[];
  thumbnail: { thumbnail_id: string } | ListingThumbnailHydrated;
}

export interface ListingFormat {
  assets: string[];
  format: string;
  formatId: number;
  price: string;
}

export interface ListingPreview {
  asset_id: string;
}

export interface ListingThumbnailHydrated {
  _id: string;
  asset_name: string;
  date_added: Date;
  sharetribe_listing_id: string;
  sharetribe_user_id: string;
  width: number;
  height: number;
  page: number;
}

export interface ListingEditData {
  id: { uuid: string };
  type: string;
  attributes: ListingEditDataAttributes;
}

export interface ListingEditDataAttributes {
  title: string;
  createdAt: Date;
  publicData: ListingPublicData;
  privateData: ListingPrivateData;
  state: string;
  deleted: boolean;
}

export interface ListingPrivateData {
  assetData: ListingAssetaData[];
}

export interface ListingAssetaData {
  scoreshelf_id: string;
  thumbnail_id?: string;
}
