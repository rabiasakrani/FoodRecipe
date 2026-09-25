import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [],
};

const favoritesSlice = createSlice({
  name: "favorites",

  initialState,

  reducers: {
    toggleFavorite: (state, action) => {
      const food = action.payload;

      const existingIndex = state.favoriterecipes.findIndex(
        (item) => item.idFood === food.idFood
      );

      if (existingIndex !== -1) {
        // Remove from favorites
        state.favoriterecipes.splice(existingIndex, 1);
      } else {
        // Add to favorites
        state.favoriterecipes.push(food);
      }
    },

    setFavorites: (state, action) => {
      state.favoriterecipes = action.payload;
    },
  },
});

export const {
  toggleFavorite,
  setFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;