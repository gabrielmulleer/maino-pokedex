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
  <div
    class="px-2 bg-info bg-gradient card col-6"
    style="width: 11rem"
    type="button"
  >
    <div class="card-body">
      <h5 class="card-title fw-bold fs-5 text-capitalize">
        {{ pokemon.name }}
      </h5>
    </div>
    <img :src="urlSvg" class="" height="100" alt="..." />
  </div>
</template>

<style></style>
