import {
  PokemonDetails,
  Pokemons,
  PokemonsResult,
  State,
} from "../../../types/pokedex";
export default {
  SET_POKEMONS(state: State, pokemons: Pokemons) {
    state.pokemons = pokemons;
  },
  ADD_POKEMONS_LIST(state: State, pokemons: PokemonsResult[]) {
    state.pokemons_list.push(...pokemons);
  },
  SET_ACTIVE_CARD(state: State, pokemon?: PokemonDetails) {
    state.active_card = pokemon;
  },
  ADD_VISITED(state: State, visited: PokemonDetails) {
    state.visited_pokemons.push(visited);
  },
};
