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
  sharetribe_listing_id: string | undefined;
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