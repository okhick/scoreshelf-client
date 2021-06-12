import { Data } from '@/@types';
import { UploadedFile, ProfilePicture, Publisher } from '../scoreshelf';

export interface Listing {
  id: { uuid: string };
  type: 'listing';
  attributes: ListingAttributes;
  relationships?: {
    author: AuthorRelationship;
  };
}

export interface AuthorRelationship {
  data: {
    id: { uuid: string };
    type: string;
  };
}

export interface ListingSearch {
  data: Listing[];
  meta: SearchResultsMeta;
  included: CurrentUser[];
}

export interface ListingQuery {
  data: Listing;
  meta: SearchResultsMeta;
  included: CurrentUser[];
}

export interface SearchResultsMeta {
  page: number;
  prePage: number;
  totalItems: number;
  totalPages: number;
}

export interface ListingAttributes extends Data {
  title: string;
  createdAt: Date;
  publicData: ListingPublicData;
  state: string;
  deleted: boolean;
}

export interface ListingPublicData extends Data {
  commission: string;
  subtitle: string;
  role: ListingRole[];
  duration: string;
  ensemble: string;
  instrumentation: string[];
  year: string;
  preview: ListingPreview;
  formats: ListingFormat[];
  thumbnail: { thumbnail_id: string } | ListingThumbnailHydrated;
  audioPreview: { asset_id: string };
}

export interface ListingRole {
  role: string;
  name: string;
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
export function isListingThumbnailHydrated(
  listingThumbnail: any
): listingThumbnail is ListingThumbnailHydrated {
  return listingThumbnail._id !== undefined;
}

export interface CreateDraftResponse {
  data: ListingEditData;
}

export interface GetOwnListingsResponse {
  data: ListingEditData[];
}

export interface ListingEditData {
  id: { uuid: string };
  type: string;
  attributes: ListingEditDataAttributes;
  isBlankDraft: boolean;
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
  assetData: ListingAssetData[];
}

export interface ListingAssetData {
  scoreshelf_id: string | null;
  thumbnail_id?: string | null;
}

export interface CurrentUserResponse {
  data: CurrentUser;
}

export interface CurrentUser {
  id: { uuid: string };
  type: string;
  attributes: CurrentUserAttributes;
}

export interface CurrentUserAttributes {
  banned: boolean;
  createdAt: Date;
  deleted: false;
  email: string;
  emailVeified: boolean;
  profile: CurrentUserAttributesProfile;
  // sort these out when the time comes...
  stripeChargesEnabled: boolean;
  stripeConnected: boolean;
  stripePayoutsEnabled: boolean;
}

export interface CurrentUserAttributesProfile {
  abbreviatedName: string;
  bio: string | null;
  displayName: string;
  firstName: string;
  lastName: string;
  // sort these out when the time comes...
  metadata: any;
  privateData: any;
  protectedData: any;
  publicData: {
    profilePicture: string | undefined;
    publisher: string | undefined;
  };
}

export interface EditUserProfile {
  firstName: string;
  lastName: string;
  displayName: string;
  bio: string;
  email: string;
  profilePicture: UploadedFile | ProfilePicture | undefined;
  publisher: Publisher;
}
