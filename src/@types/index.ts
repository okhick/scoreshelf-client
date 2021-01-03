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

export interface SharetribeAssetData {
  scoreshelf_id: string;
  thumbnail_id: string;
}

export interface UploadedFile extends File {
  isStored: boolean;
  asset_name: string;
}

export interface GenericAsset {
  _id: string;
  sharetribe_user_id: string;
  sharetribe_listing_id: string;
  date_added: Date;
  asset_name: string;
  isStored: boolean;
}

export interface Asset extends GenericAsset {
  size: number;
  link?: string | null;
  thumbnail_settings?: Thumbnail;
}

export interface Thumbnail extends GenericAsset {
  page: number;
  height: number;
  width: number;
}

export interface PreviewSetting {
  isPreview: boolean;
}

export interface PreviewSettings {
  [key: string]: PreviewSetting;
}

export interface ThumbnailSettings {
  [key: string]: ThumbnailSetting;
}

export interface ThumbnailSetting {
  isThumbnail: boolean;
  page: number | null;
}

export interface AssetMetadata {
  sharetribe_listing_id: string;
  sharetribe_user_id: string;
  metadata: {
    [key: string]: {
      thumbnailSettings: ThumbnailSetting;
    };
  };
}

export interface UploadParams {
  thumbnailSettings: ThumbnailSettings;
}
