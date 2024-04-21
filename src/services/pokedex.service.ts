import { Store } from "vuex/types/index.js";
import ServicesAPI from "./api.service";
import { PokemonDetails, PokemonEvolution, State } from "../types/pokedex";

class PokedexService extends ServicesAPI {
  private static instance: PokedexService;
  private static store: Store<State>;

  private constructor() {
    super();
  }

  static getInstance(store?: Store<State>): PokedexService {
    if (store) {
      PokedexService.store = store;
    }
    if (!PokedexService.instance && PokedexService.store) {
      PokedexService.instance = new PokedexService();
    } else if (!PokedexService.store) {
      throw new Error("The application requires a Vuex store");
    }
    return PokedexService.instance;
  }

  static initialize(store: Store<State>) {
    PokedexService.store = store;
    store.dispatch("pokedex/getPokemons");
  }

  public getPokemonById = async (id: number) => {
    const pokemon = this.validateVisitedPokemon(id);

    if (pokemon) {
      return pokemon;
    }
    const data_pokemon = await this.get(`pokemon/${id}`);
    const data_species = await this.get(`pokemon-species/${id}`);
    const data_evolution = await this.getPassingTheUrl(
      data_species?.evolution_chain?.url
    );

    const object_to_add = {
      ...data_pokemon,
      evolution_chain: data_species?.evolution_chain,
      evolution: {
        evolves_to: data_evolution?.chain?.evolves_to,
        species: data_evolution?.chain?.species,
      },
    };
    this.addToVisited(object_to_add);
    return object_to_add;
  };

  getAllVisitedPokemons() {
    return PokedexService.store.getters["pokedex/getVisitedPokemons"];
  }
  addToVisited(pokemon: PokemonDetails) {
    PokedexService.store.dispatch("pokedex/addToVisited", pokemon);
  }

  public validateVisitedPokemon = (id: number) => {
    return this.getAllVisitedPokemons().find(
      (item: PokemonDetails) => item.id === id
    );
  };

  collectSpeciesNames(evolutionData: PokemonEvolution) {
    let names: string[] = [];
    // console.log(evolutionData.species);
    // console.log(names);
    function traverse(evolution: PokemonEvolution) {
      if (evolution.species && evolution.species.name) {
        names.push(evolution.species.name);
      }

      if (evolution.evolves_to && evolution.evolves_to.length > 0) {
        evolution.evolves_to.forEach((subEvolution) => {
          traverse(subEvolution);
        });
      }
    }

    traverse(evolutionData);

    return names;
  }
}
export default PokedexService;
