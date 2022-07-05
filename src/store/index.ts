import { createStore } from 'vuex'
import {LinksData, Tab} from "@/store/model";
import {initialDataService} from "@/services/initial-data-service";
import _ from "lodash";

export interface State {
  linksData: LinksData,
  tabIndex: number,
  editMode: boolean,
}

const keys = {
  LINKS_DATA: 'links-data',
  TAB_INDEX: 'tab-index',
  EDIT_MODE: 'false',
};

export default createStore<State>({
  state: {
    linksData: new LinksData([]),
    tabIndex: 0,
    editMode: false,
  },
  getters: {
  },
  mutations: {
    setTabIndex(state, tabIndex: number) {
      state.tabIndex = tabIndex;
      localStorage.setItem(keys.TAB_INDEX, tabIndex.toString());
    },
    setLinksData(state, linksData: LinksData) {
      state.linksData = linksData;
      // _.set(state.linksData, 'tabs', linksData.tabs);
      localStorage.setItem(keys.LINKS_DATA, JSON.stringify(linksData));
    },
    setEditMode(state, editMode: boolean) {
      state.editMode = editMode;
      localStorage.setItem(keys.EDIT_MODE, editMode + '');
    },
  },
  actions: {
    init(context) {
      const tabIndex = localStorage.getItem(keys.TAB_INDEX);
      context.commit('setTabIndex', tabIndex ? parseInt(tabIndex) : 0);

      const editMode = localStorage.getItem(keys.EDIT_MODE);
      context.commit('setEditMode', editMode === 'true');

      const linksDataFromLocalStorage = localStorage.getItem(keys.LINKS_DATA);
      if (linksDataFromLocalStorage) {
        context.commit('setLinksData', JSON.parse(linksDataFromLocalStorage));
      } else {
        context.commit('setLinksData', new LinksData([]));
      }
    },
    resetLinks(context) {
      initialDataService.retrieve().then(linksData => {
        context.commit('setLinksData', linksData);
      });
    },
    clearStorage(context) {
      localStorage.clear();
      context.dispatch('init');
    },
  },
  modules: {
  }
})
