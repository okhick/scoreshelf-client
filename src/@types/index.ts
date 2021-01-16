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
  CurrentUserResponse,
  CurrentUser,
  CurrentUserAttributes,
  CurrentUserAttributesProfile,
  EditUserProfile,
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
