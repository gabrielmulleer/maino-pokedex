<script lang="ts">
import { useStore } from "vuex";
import { ref, defineComponent, computed } from "vue";
import CardComponent from "./components/globalComponents/Card/CardComponent.vue";
import { PokemonDetails, PokemonsResult } from "./types/pokedex";
import ModalComponent from "./components/globalComponents/Modal/ModalComponent.vue";
import PokedexService from "./services/pokedex.service";

export default defineComponent({
  setup() {
    const store = useStore();
    const pokemons = computed(() => store.getters["pokedex/getAllPokemons"]);
    const modalActive = ref<boolean>(false);
    const urlSvg = ref(
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"
    );
    const spriteUrls = ref<string[]>([]);
    const pokemonDetails = ref<PokemonDetails | null>(null);
    const evolutionChain = ref<any>(null);
    const pokedexService = PokedexService.getInstance();
    const activeCard = computed(() => store.getters["pokedex/getActiveCard"]);

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

    const modalOpen = async (url: PokemonsResult) => {
      modalActive.value = true;
      await fetchData(url);
      getSpritesUrls();
    };
    const modalClose = () => {
      modalActive.value = false;
      store.dispatch("pokedex/resetActiveCard");
    };
    const getSpritesUrls = () => {
      if (activeCard?.value.sprites) {
        spriteUrls.value = Object.values(activeCard.value.sprites)
          .filter((url) => url !== null)
          .map((url) => url as string);
      }
    };

    return {
      pokemons,
      urlSvg,
      modalActive,
      pokemonDetails,
      evolutionChain,
      modalOpen,
      modalClose,
      activeCard,
      spriteUrls,
    };
  },
  components: {
    CardComponent,
    ModalComponent,
  },
});
</script>

<template>
  <div>
    <div v-if="pokemons" class="row">
      <CardComponent
        @click="modalOpen(pokemon)"
        v-for="(pokemon, index) in pokemons.results"
        :key="index"
        :pokemon="pokemon"
        :urlSvg="urlSvg + pokemon.url.split('/')[6] + '.svg'"
      />
      {{ console.log(pokemons) }}
    </div>
    <div v-else>Carregando...</div>
  </div>

  <ModalComponent
    v-if="activeCard"
    @close="modalClose"
    :modalActive="modalActive"
    :activeCard="activeCard"
  >
    <div>
      <h1>{{ activeCard.name }}</h1>
      <img
        height="150"
        :src="activeCard?.sprites?.other?.dream_world?.front_default"
        :alt="activeCard.name"
      />
      <div>
        <h4>Sprites</h4>
        <img
          v-for="(url, index) in spriteUrls"
          :key="index"
          :src="url"
          alt=""
        />
      </div>
      <div>
        <h4>Moves</h4>
        <div
          class="d-flex flex-wrap flex-fill gap-2 align-items-center justify-content-center"
        >
          <span v-for="(move, index) in activeCard.moves" :key="index">{{
            move.move.name
          }}</span>
        </div>
      </div>
      <div>
        <h4>Evolution</h4>
        <span v-for="(evolution, index) in activeCard.evolutions" :key="index">
          {{ evolution }}
          <span v-if="index < activeCard.evolutions.length - 1"> > </span>
        </span>
      </div>
      <div>
        <h4>Games</h4>
        <div
          class="d-flex flex-wrap flex-fill gap-2 align-items-center justify-content-center"
        >
          <span
            v-for="(gameIndices, index) in activeCard.game_indices"
            :key="index"
          >
            {{ gameIndices.version.name }}
          </span>
        </div>
      </div>
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
