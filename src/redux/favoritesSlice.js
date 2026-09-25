import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite articles
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
        // Recipe already exists, so remove it from favorites
        state.favoriterecipes.splice(existingIndex, 1);
      } else {
        // Recipe does not exist, so add it to favorites
        state.favoriterecipes.push(food);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;