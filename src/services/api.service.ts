import axios from "axios";

export default class ServicesAPI {
  baseURL = "https://pokeapi.co/api/v2/";
  timeout = 10000;

  async get(url: string): Promise<any> {
    const config = {
      baseURL: this.baseURL,
      timeout: this.timeout,
    };
    let response: any | undefined = undefined;
    let tryCount = 0;
    while (tryCount < 3) {
      try {
        response = await axios.get(url, config);
        break;
      } catch (error: any) {
        tryCount += 1;
        if (tryCount === 3) {
          response = undefined;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        throw error;
      }
    }
    return response.data;
  }

  async getPassingTheUrl(url: string): Promise<any> {
    const config = {
      baseURL: url,
      timeout: this.timeout,
    };
    let response: any | undefined = undefined;
    let tryCount = 0;
    while (tryCount < 3) {
      try {
        response = await axios.get(url, config);
        break;
      } catch (error: any) {
        tryCount += 1;
        if (tryCount === 3) {
          response = undefined;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        throw error;
      }
    }
    return response.data;
  }
}
