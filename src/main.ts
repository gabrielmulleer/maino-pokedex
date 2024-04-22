import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import store from "./store";
import PokedexService from "./services/pokedex.service";

PokedexService.initialize(store);

const app = createApp(App);

app.use(store);
app.mount("#app");
