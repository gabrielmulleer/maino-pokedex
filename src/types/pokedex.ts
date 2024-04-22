export interface State {
  pokemons?: Pokemons;
  visited_pokemons: PokemonDetails[];
  pokemons_list: PokemonsResult[];
  active_card?: PokemonDetails;
}
export interface Pokemons {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonsResult[];
}
export interface PokemonsResult {
  name: string;
  url: string;
}
export interface PokemonDetails {
  id: number;
  name: string;
  moves: PokemonMoves[];
  game_indices: PokemonGameIndices[];
  types: PokemonTypes[];
  evolution_chain: string;
  evolution: PokemonEvolution;
  evolutions: string[];
}
export interface PokemonEvolution {
  evolves_to: PokemonEvolution[];
  species: PokemonsResult;
}
interface PokemonMoves {
  move: PokemonsResult;
}
interface PokemonGameIndices {
  version: PokemonsResult;
}
interface PokemonTypes {
  type: PokemonsResult;
}
