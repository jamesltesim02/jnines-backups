
interface ApiUrls {
  PULL: string;
  BET: string;
  QUOTE: string;
};

interface ApiContextInitParams {
  onSignRequest: Function;
  onApiError: Function;
  urls: ApiUrls;
}

class ApiContext {

  protected signRequest () {}
  protected apiError () {}

  onSignRequest: Function;
  onApiError: Function;
  urls: ApiUrls;

  init (params: ApiContextInitParams) {
    this.onSignRequest = params.onSignRequest;
    this.onApiError = params.onApiError;
    this.urls = (params.urls || {}) as ApiUrls;
  }
}

export default new ApiContext();