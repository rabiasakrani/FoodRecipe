import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import favoritesReducer, {
  setFavorites,
} from "./favoritesSlice";

const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
  },
});

let favoritesLoaded = false;

// Load saved favorites first
const loadFavorites = async () => {
  try {
    const savedFavorites = await AsyncStorage.getItem(
      "favoriterecipes"
    );

    if (savedFavorites !== null) {
      const parsedFavorites = JSON.parse(savedFavorites);

      store.dispatch(setFavorites(parsedFavorites));
    }
  } catch (error) {
    console.log("Error loading favorites:", error);
  } finally {
    // IMPORTANT:
    // Do not allow Redux to save until old favorites
    // have finished loading.
    favoritesLoaded = true;
  }
};

loadFavorites();

// Save favorites only AFTER initial loading is complete
store.subscribe(async () => {
  if (!favoritesLoaded) {
    return;
  }

  try {
    const state = store.getState();

    await AsyncStorage.setItem(
      "favoriterecipes",
      JSON.stringify(
        state.favorites.favoriterecipes
      )
    );
  } catch (error) {
    console.log("Error saving favorites:", error);
  }
});

export default store;