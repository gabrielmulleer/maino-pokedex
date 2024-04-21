<script lang="ts">
import { defineComponent, SetupContext } from "vue";
import { PokemonDetails } from "../../../types/pokedex";
export default defineComponent({
  setup(props, { emit }: SetupContext) {
    const close = () => {
      emit("close");
    };
    return { close };
  },
  props: {
    activeCard: { type: Object as () => PokemonDetails, required: true },
    modalActive: { type: Boolean, required: true },
  },
});
</script>
<template>
  <div v-show="modalActive" class="modal fade show" style="display: block">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button type="button" @click="close">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
