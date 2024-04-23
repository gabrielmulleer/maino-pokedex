<script lang="ts">
import { useStore } from "vuex";
import { ref, defineComponent, computed, onMounted, onUnmounted } from "vue";
import CardComponent from "./components/globalComponents/Card/CardComponent.vue";
import { PokemonDetails, PokemonsResult } from "./types/pokedex";
import ModalComponent from "./components/globalComponents/Modal/ModalComponent.vue";
import PokedexService from "./services/pokedex.service";
import Header from "./components/globalComponents/Header/Header.vue";

export default defineComponent({
  setup() {
    const store = useStore();
    const pokedexService = PokedexService.getInstance();
    const pokemons = computed(() => store.getters["pokedex/getAllPokemons"]);

    const pokemonsList = computed(
      () => store.getters["pokedex/getPokemonsList"]
    );
    const activeCard = computed(() => store.getters["pokedex/getActiveCard"]);
    const urlSvg = ref(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"
    );
    const imageUrl = ref("");
    const modalActive = ref<boolean>(false);
    const spriteUrls = ref<string[]>([]);
    const pokemonDetails = ref<PokemonDetails | null>(null);
    const evolutionChain = ref<any>(null);
    const scrollComponent = ref<any>(null);
    const searchTerm = ref<any>("");
    const selectedFilter = ref("");
    const pokemonList = ref<any | undefined>("");
    const filterButtonText = ref("Filter");

    const fetchData = async ({ url }: PokemonsResult) => {
      try {
        const segments = url.split("/");
        const id = segments[segments.length - 2];

        const data: PokemonDetails = await pokedexService?.getPokemonById(
          parseInt(id) ?? 0
        );
        if (data) {
          pokemonDetails.value = data;
          evolutionChain.value = pokedexService.collectSpeciesNames(
            data.evolution
          );
          store.dispatch("pokedex/setActiveCard", {
            ...pokemonDetails.value,
            evolutions: evolutionChain.value,
          });
        }
      } catch (error) {
        return;
      }
    };
    const loadMorePokemons = async (nextUrl: string | null) => {
      try {
        await pokedexService.getNextList(nextUrl);
      } catch (error) {
        return;
      }
    };

    const modalOpen = async (url: PokemonsResult) => {
      modalActive.value = true;
      await fetchData(url);
      getSpritesUrls();
    };
    const modalClose = () => {
      modalActive.value = false;
      store.dispatch("pokedex/setActiveCard", undefined);
    };
    const getSpritesUrls = () => {
      if (activeCard?.value?.sprites) {
        spriteUrls.value = Object.values(activeCard?.value?.sprites)
          .filter((url) => url !== null)
          .map((url) => url as string);
      }
    };
    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });
    onUnmounted(() => {
      window.removeEventListener("scroll", handleScroll);
    });
    const handleScroll = () => {
      let element = scrollComponent.value;
      if (element.getBoundingClientRect().bottom < window.innerHeight) {
        loadMorePokemons(pokemons.value.next);
      }
    };

    const updateFilter = (text: string) => {
      filterButtonText.value = text;
      selectedFilter.value = text;
    };

    const pokemonsFiltered = computed(() => {
      if (pokemonsList.value && pokemonList.value) {
        return pokemonList.value;
      }
    });
    const clearInput = () => {
      searchTerm.value = "";
      pokemonList.value = undefined;
    };

    const search = async () => {
      switch (selectedFilter.value) {
        case "Name":
          pokemonList.value = await pokedexService.filterByName(
            searchTerm.value
          );

          break;
        case "ID":
          pokemonList.value = await pokedexService.filterById(
            parseInt(searchTerm.value)
          );

          break;
        case "Type":
          pokemonList.value = await pokedexService.filterByType(
            searchTerm.value
          );

          break;
        case "Specie":
          pokemonList.value = await pokedexService.filterBySpecies(
            parseInt(searchTerm.value)
          );

          break;
        default:
          break;
      }
    };
    function formatNumberToHex(num: number): string {
      // Adiciona zeros à esquerda até o número ter 4 dígitos
      const formattedNumber = num.toString().padStart(4, "0");
      // Retorna a representação hexadecimal do número
      return `#${formattedNumber}`;
    }
    return {
      pokemons,
      pokemonsList,
      urlSvg,
      modalActive,
      pokemonDetails,
      evolutionChain,
      scrollComponent,
      modalOpen,
      modalClose,
      loadMorePokemons,
      activeCard,
      spriteUrls,
      pokemonsFiltered,
      filterButtonText,
      searchTerm,
      updateFilter,
      search,
      pokemonList,
      clearInput,
      imageUrl,
      formatNumberToHex,
    };
  },
  components: {
    Header,
    CardComponent,
    ModalComponent,
  },
});
</script>

<template>
  <div class="px-5" ref="scrollComponent">
    <div
      class="d-flex flex-column flex-md-row align-items-center justify-content-between py-3"
    >
      <Header />
      <div class="container input-group m-0 h-25">
        <button
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ filterButtonText }}
        </button>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" @click="updateFilter('Name')">Name</a>
          </li>
          <li><a class="dropdown-item" @click="updateFilter('ID')">ID</a></li>
          <li>
            <a class="dropdown-item" @click="updateFilter('Type')">Type</a>
          </li>
          <li>
            <a class="dropdown-item" @click="updateFilter('Specie')">Specie</a>
          </li>
        </ul>
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          :placeholder="'Search by ' + filterButtonText.toLowerCase()"
          :aria-label="'Search by ' + filterButtonText.toLowerCase()"
          aria-describedby="button-addon2"
          minlength="1"
        />
        <button
          class="btn btn-secondary"
          type="button"
          id="button-addon2"
          @click="clearInput"
        >
          X
        </button>
        <button
          class="btn btn-secondary"
          type="button"
          id="button-addon2"
          @click="search"
          :disabled="searchTerm.length === 0"
        >
          Search
        </button>
      </div>
    </div>
    <div class="mt-4">
      <div class="container text-center">
        <div
          v-if="pokemonsFiltered"
          class="row row-cols-2 row-cols-lg-5 justify-content-center gap-3"
        >
          <CardComponent
            @click="modalOpen(pokemon)"
            v-for="(pokemon, index) in pokemonsFiltered"
            :key="index"
            :pokemon="pokemon"
            :urlSvg="
              urlSvg + (pokemon?.url?.split('/')[6] ?? pokemon?.id) + '.svg'
            "
          />
        </div>
        <div
          v-else-if="pokemonsList"
          class="row row-cols-3 row-cols-lg-5 justify-content-center gap-3"
        >
          <CardComponent
            @click="modalOpen(pokemon)"
            v-for="(pokemon, index) in pokemonsList"
            :key="index"
            :pokemon="pokemon"
            :urlSvg="urlSvg + pokemon.url.split('/')[6] + '.svg'"
          />
        </div>
        <div v-else>Carregando...</div>
      </div>
    </div>
  </div>
  <ModalComponent
    v-if="activeCard"
    @close="modalClose"
    :modalActive="modalActive"
    :activeCard="activeCard"
  >
    <div>
      <h1 class="text-start text-white fw-bold text-capitalize">
        {{ activeCard.name }}
      </h1>
      <h4 class="text-start text-white fw-bold">
        {{ formatNumberToHex(activeCard.id) }}
      </h4>
      <img
        height="150"
        :src="activeCard?.sprites?.other?.dream_world?.front_default"
        :alt="activeCard.name"
        class="mb-3"
      />
      <!-- Accordion -->
      <div class="accordion" id="accordionModal">
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
            >
              Sprites
            </button>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionModal"
          >
            <div class="accordion-body">
              <img
                v-for="(url, index) in spriteUrls"
                :key="index"
                :src="url"
                alt=""
              />
            </div>
          </div>
        </div>
        <!--  -->

        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Evolution
            </button>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionModal"
          >
            <div class="accordion-body">
              <span
                class="text-capitalize"
                v-for="(evolution, index) in activeCard.evolutions"
                :key="index"
              >
                {{ evolution }}
                <span v-if="index < activeCard.evolutions.length - 1"> > </span>
              </span>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Moves
            </button>
          </h2>
          <div
            id="collapseThree"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionModal"
          >
            <div class="accordion-body">
              <div
                class="d-flex flex-wrap flex-fill gap-2 align-items-center justify-content-center"
              >
                <span
                  class="text-capitalize"
                  v-for="(move, index) in activeCard.moves"
                  :key="index"
                  >{{ move.move.name }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed fw-bold"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              Games
            </button>
          </h2>
          <div
            id="collapseFour"
            class="accordion-collapse collapse"
            data-bs-parent="#accordionModal"
          >
            <div class="accordion-body">
              <div
                class="d-flex flex-wrap flex-fill gap-2 align-items-center justify-content-center"
              >
                <span
                  class="text-capitalize"
                  v-for="(gameIndices, index) in activeCard.game_indices"
                  :key="index"
                >
                  {{ gameIndices.version.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- fim -->
    </div>
  </ModalComponent>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
