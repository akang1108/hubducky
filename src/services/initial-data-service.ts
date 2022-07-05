import {LinksData} from "@/store/model";

export class InitialDataService {
  retrieve(): Promise<LinksData> {
    return fetch('links.json').then(response => response.json() as Promise<LinksData>);
  }
}

export const initialDataService = new InitialDataService();
