export interface faceSearchRequest {
  url: string;
}

export interface faceSearchResponse {
  value: ImageResult[];
}

export interface ImageResult {
  faceId: string;
  faceRectangle:
  {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}
