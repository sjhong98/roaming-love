declare module 'expo-image-picker' {
  export enum MediaTypeOptions {
    All = "All",
    Videos = "Videos",
    Images = "Images",
  }

  export type ImagePickerAsset = {
    uri: string;
    width?: number;
    height?: number;
    fileName?: string;
    fileSize?: number;
    type?: string;
  };

  export type ImagePickerResult = {
    canceled: boolean;
    assets?: ImagePickerAsset[];
  };

  export type MediaLibraryPermissionResponse = {
    status: string;
    granted: boolean;
    canAskAgain: boolean;
  };

  export type ImagePickerOptions = {
    mediaTypes?: MediaTypeOptions;
    allowsMultipleSelection?: boolean;
    quality?: number;
    selectionLimit?: number;
  };

  export function requestMediaLibraryPermissionsAsync(): Promise<MediaLibraryPermissionResponse>;
  export function launchImageLibraryAsync(options?: ImagePickerOptions): Promise<ImagePickerResult>;
}

