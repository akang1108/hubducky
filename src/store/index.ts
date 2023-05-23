import { createStore } from 'vuex'
import {Ducky, Data, Tab} from "@/store/model";
import {initialDataService} from "@/services/initial-data-service";
import _ from "lodash";

export interface State {
  ducky: Ducky,
  tabIndex: number,
  editMode: boolean,
}

const keys = {
  DUCKY: 'ducky',
  TAB_INDEX: 'tab-index',
  EDIT_MODE: 'false',
};

export default createStore<State>({
  state: {
    ducky: Ducky.blank(),
    tabIndex: 0,
    editMode: false,
  },
  getters: {
  },
  mutations: {
    setDucky(state, ducky: Ducky) {
      state.ducky = ducky;
      localStorage.setItem(keys.DUCKY, JSON.stringify(ducky));
    },
    setData(state, data: Data) {
      state.ducky.data = data;
      state.ducky.lastUpdated = new Date();
      localStorage.setItem(keys.DUCKY, JSON.stringify(state.ducky));
    },
    setTabIndex(state, tabIndex: number) {
      state.tabIndex = tabIndex;
      localStorage.setItem(keys.TAB_INDEX, tabIndex.toString());
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

      const ducky = localStorage.getItem(keys.DUCKY);
      if (ducky) {
        context.commit('setDucky', JSON.parse(ducky));
      } else {
        context.commit('setDucky', Ducky.blank());
      }
    },
    deleteStorage(context) {
      localStorage.clear();
      context.dispatch('init');
    },
  },
  modules: {
  }
})
