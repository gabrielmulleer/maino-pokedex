<script lang="ts">
import { defineComponent } from "vue";
import { PokemonDetails, type PokemonsResult } from "../../../types/pokedex";

export default defineComponent({
  setup() {},
  props: {
    pokemon: {
      type: Object as () => PokemonsResult | PokemonDetails,
      required: true,
    },
    urlSvg: { type: String, required: true },
  },
});
</script>
<template>
  <div class="card col-6" style="width: 18rem" type="button">
    <img :src="urlSvg" class="card-img-top" height="100" alt="..." />
    <div class="card-body">
      <h5 class="card-title text-capitalize">{{ pokemon.name }}</h5>
    </div>
  </div>
</template>

<style></style>
