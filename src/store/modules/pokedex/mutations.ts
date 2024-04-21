import { PokemonDetails, Pokemons, State } from "../../../types/pokedex";
export default {
  SET_POKEMONS(state: State, pokemons: Pokemons) {
    state.pokemons = pokemons;
  },
  SET_ACTIVE_CARD(state: State, pokemon?: PokemonDetails) {
    state.active_card = pokemon;
  },
  RESET_ACTIVE_CARD(state: State) {
    state.active_card = undefined;
  },
  ADD_VISITED(state: State, visited: PokemonDetails) {
    state.visited_pokemons.push(visited);
  },
};
