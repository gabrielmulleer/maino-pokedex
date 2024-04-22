import { Store } from "vuex/types/index.js";
import ServicesAPI from "./api.service";
import {
  PokemonDetails,
  PokemonEvolution,
  Pokemons,
  PokemonsResult,
  State,
} from "../types/pokedex";

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
      PokedexService.instance.getPokemons();
    } else if (!PokedexService.store) {
      throw new Error("The application requires a Vuex store");
    }
    return PokedexService.instance;
  }

  async getPokemons() {
    try {
      const res = await this.get("/pokemon");

      if (PokedexService.store) {
        PokedexService.store.dispatch("pokedex/addToPokemons", res);
        PokedexService.store.dispatch("pokedex/addToPokemonsList", res.results);
      }
    } catch (error) {
      console.error("Erro ao buscar pokemons:", error);
    }
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
  getPokemonsList() {
    return PokedexService.store.getters["pokedex/getPokemonsList"];
  }
  public getNextList = async (url: string | null) => {
    const data_next = await this.get(url);
    const next_pokemons_list = data_next.results;
    PokedexService.store.dispatch("pokedex/addToPokemons", data_next);
    PokedexService.store.dispatch(
      "pokedex/addToPokemonsList",
      next_pokemons_list
    );
  };

  async filterByName(name: string) {
    const nameFiltered = await this.get(`pokemon/${name}`);
    return nameFiltered;
  }
  async filterById(id: number) {
    const idFiltered = await this.get(`pokemon/${id}`);
    return idFiltered;
  }
  async filterByType(type: number | string) {
    const typeFiltered = await this.get(`type/${type}`);
    return typeFiltered.pokemon;
  }
  async filterBySpecies(species: number | string) {
    const speciesFiltered = await this.get(`pokemon-species/${species}`);
    return speciesFiltered;
  }
}
export default PokedexService;
