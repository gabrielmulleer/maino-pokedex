<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
import CardComponent from "./components/globalComponents/Card/CardComponent.vue";

const store = useStore();
const isLoading = ref(false);
const pokemons = ref([]);
const urlSvg = ref(
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/"
);

const fetchPokemons = async () => {
  isLoading.value = true;
  try {
    await store.dispatch("getPokemons");
    pokemons.value = store.state.pokemons;
  } catch (error) {
    console.error("Erro ao buscar pokemons:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPokemons);
</script>

<template>
  <div>
    <div v-if="isLoading">Carregando...</div>

    <div v-else class="row">
      <CardComponent
        v-for="pokemon in pokemons.results"
        :key="pokemon.name"
        :name="pokemon.name"
        :urlSvg="urlSvg + pokemon.url.split('/')[6] + '.svg'"
      />
    </div>
  </div>
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
