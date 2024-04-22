import {
  PokemonDetails,
  Pokemons,
  PokemonsResult,
  State,
} from "../../../types/pokedex";

export default {
  addToPokemons(
    { commit, state }: { commit: Function; state: State },
    pokemon: Pokemons
  ) {
    commit("SET_POKEMONS", pokemon);
  },
  addToPokemonsList(
    { commit, state }: { commit: Function; state: State },
    pokemon: PokemonsResult
  ) {
    commit("ADD_POKEMONS_LIST", pokemon);
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
};
