import {
  PokemonDetails,
  Pokemons,
  PokemonsResult,
  State,
} from "../../../types/pokedex";

export default {
  getAllPokemons: (state: State): Pokemons | undefined => state.pokemons,
  getPokemonsList: (state: State): PokemonsResult[] => state.pokemons_list,
  getVisitedPokemons: (state: State): PokemonDetails[] =>
    state.visited_pokemons,
  getActiveCard: (state: State): PokemonDetails | undefined =>
    state.active_card,
};
