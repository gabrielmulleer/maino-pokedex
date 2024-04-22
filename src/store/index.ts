import { createStore } from "vuex";
import pokedex from "./modules/pokedex";

export default createStore({
  //   state: {
  //     // Seus estados iniciais aqui
  //     isLoading: false,
  //     pokemons: [],
  //   },
  //   mutations: {
  //     // Suas mutações aqui
  //     SET_IS_LOADING(state, isLoading) {
  //       state.isLoading = isLoading;
  //     },
  //     SET_POKEMONS(state, pokemons) {
  //       state.pokemons = pokemons;
  //     },
  //   },
  //   getters:{

  //   },
  //   actions: {
  //     // Suas ações aqui
  //     async getPokemons(context) {
  //       context.commit("SET_IS_LOADING", true);
  //       try {
  //         const res = await fetch("https://pokeapi.co/api/v2/pokemon");
  //         const data = await res.json();
  //         context.commit("SET_POKEMONS", data);
  //       } catch (error) {
  //         console.error("Erro ao buscar pokemons:", error);
  //       } finally {
  //         context.commit("SET_IS_LOADING", false);
  //       }
  //     },
  //   },
  modules: {
    pokedex,
  },
});
