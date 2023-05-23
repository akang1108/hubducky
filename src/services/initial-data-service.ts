import {Data} from "@/store/model";

export class InitialDataService {
  retrieve(): Promise<Data> {
    return fetch('links.json').then(response => response.json() as Promise<Data>);
  }
}

export const initialDataService = new InitialDataService();
