import { Module } from "vuex";
import { State } from "../../../types/pokedex";
import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const pokedex: Module<State, State> = {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
export default pokedex;
