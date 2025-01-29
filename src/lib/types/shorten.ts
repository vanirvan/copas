export type SuccessGetShortenAPIResponse = {
  data: {
    id: number;
    original_url: string;
    short_url: string;
    created_at: string;
  }[];
};

export type ErrorGetShortenAPIResponse = {
  error: string;
};

export type SuccessShortenAPIResponse = {
  data: {
    original_url: string;
    short_url: string;
  };
};

export type ErrorShortenAPIResponse = {
  error: {
    original_url: string[];
    short_url: string[];
    general_error: string[];
  };
};
