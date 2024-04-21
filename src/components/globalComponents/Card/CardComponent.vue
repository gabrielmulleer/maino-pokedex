<script lang="ts">
import { defineComponent } from "vue";
import { type PokemonsResult } from "../../../types/pokedex";

export default defineComponent({
  props: {
    pokemon: { type: Object as () => PokemonsResult, required: true },
    urlSvg: { type: String, required: true },
  },
});
</script>
<template>
  <div class="card col-6" style="width: 18rem" type="button">
    <img :src="urlSvg" class="card-img-top" height="100" alt="..." />
    <div class="card-body">
      <h5 class="card-title">{{ pokemon.name }}</h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </p>
    </div>
  </div>
</template>

<style></style>
