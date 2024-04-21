import { PokemonDetails, Pokemons, State } from "../../../types/pokedex";

export default {
  getAllPokemons: (state: State): Pokemons | undefined => state.pokemons,
  getVisitedPokemons: (state: State): PokemonDetails[] =>
    state.visited_pokemons,
  getActiveCard: (state: State): PokemonDetails | undefined =>
    state.active_card,
};
