import { createStore } from "vuex";
import pokedex from "./modules/pokedex";

export default createStore({
  //
  modules: {
    pokedex,
  },
});
