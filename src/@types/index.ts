export interface Data {
  [key: string]: any;
}

export interface ChooseEvent {
  target: {
    value: string;
  };
}

export {
  Listing,
  ListingSearch,
  ListingQuery,
  SearchResultsMeta,
  ListingAttributes,
  ListingPublicData,
  ListingFormat,
  ListingPreview,
  ListingThumbnailHydrated,
  CreateDraftResponse,
  GetOwnListingsResponse,
  ListingEditData,
  ListingEditDataAttributes,
  ListingPrivateData,
  ListingAssetData,
  CurrentUser,
  CurrentUserAttributes,
  CurrentUserAttributesProfile,
} from './sharetribe';

export {
  UploadedFile,
  GenericAsset,
  Asset,
  Thumbnail,
  PreviewSetting,
  PreviewSettings,
  ThumbnailSetting,
  ThumbnailSettings,
  AssetMetadata,
  UploadParams,
} from './scoreshelf';
