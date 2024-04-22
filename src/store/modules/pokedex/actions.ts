import { PokemonDetails, State } from "../../../types/pokedex";

export default {
  async getPokemons({ commit }: { commit: Function }) {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon");
      const data = await res.json();
      commit("SET_POKEMONS", data);
    } catch (error) {
      console.error("Erro ao buscar pokemons:", error);
    }
  },
  addToVisited(
    { commit, state }: { commit: Function; state: State },
    pokemon: PokemonDetails
  ) {
    commit("ADD_VISITED", pokemon);
  },
  setActiveCard(
    { commit, state }: { commit: Function; state: State },
    pokemon: PokemonDetails
  ) {
    commit("SET_ACTIVE_CARD", pokemon);
  },
  resetActiveCard({ commit, state }: { commit: Function; state: State }) {
    commit("RESET_ACTIVE_CARD");
  },
};
