export interface Data {
  [key: string]: any;
}

export interface ChooseEvent {
  target: {
    value: string;
  };
}

export interface NewFileUpload {
  target: {
    files: File[];
  };
}

export interface InputChangeEvent {
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
  ListingRole,
  ListingFormat,
  ListingPreview,
  ListingThumbnailHydrated,
  isListingThumbnailHydrated,
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
} from '@/@types/sharetribe';

export {
  UploadedFile,
  GenericAsset,
  Asset,
  Thumbnail,
  ProfilePicture,
  PreviewSetting,
  PreviewSettings,
  ThumbnailSetting,
  ThumbnailSettings,
  AssetMetadata,
  UploadParams,
  Publisher,
} from '@/@types/scoreshelf';
