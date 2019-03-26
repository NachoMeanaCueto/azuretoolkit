export interface ComputerVisionRequest {
  url: string;
}

export interface ComputerVisionResponse {
  description: {
    captions: Array<{
      confidence: number;
      text: string;
    }>;
  }
  tags: Array<{
    confidence: number;
    name: string;
  }>;
}
