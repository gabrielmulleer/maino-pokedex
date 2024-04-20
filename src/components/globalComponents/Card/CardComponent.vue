<script setup lang="ts">
import { ref } from "vue";
import ModalComponent from "../Modal/ModalComponent.vue";

const pokemon = defineProps(["name", "urlSvg"]);
const showModal = ref(false);
</script>
<template>
  <div
    class="card col-6"
    style="width: 18rem"
    type="button"
    data-bs-toggle="modal"
    :data-bs-target="'#' + pokemon.name + 'Modal'"
  >
    <img :src="urlSvg" class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">{{ pokemon.name }}</h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk
        of the card's content.
      </p>
    </div>
  </div>
  <ModalComponent
    :id="pokemon.name + 'Modal'"
    :label="pokemon.name + 'ModalLabel'"
    >{{ pokemon.name }}</ModalComponent
  >
</template>

<style></style>
