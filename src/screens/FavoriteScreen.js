import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { toggleFavorite } from "../redux/favoritesSlice";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function FavoriteScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get favorite recipes from Redux store
  const favoriteRecipes = useSelector(
    (state) => state.favorites
  );

  const favoriteRecipesList =
    favoriteRecipes?.favoriterecipes || [];

  // Remove recipe from favorites
  const handleUnfavorite = (item) => {
    dispatch(toggleFavorite(item));
  };

  // Empty Favorites Screen
  if (favoriteRecipesList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No favorite recipes yet!
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Heading */}
      <View testID="FavoriteRecipes">
        <Text style={styles.heading}>
          My Favorite Recipes
        </Text>
      </View>

      {/* Back to Home */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>
          Back to Home
        </Text>
      </TouchableOpacity>

      {/* Favorite Recipes List */}
      <FlatList
        data={favoriteRecipesList}
        contentContainerStyle={styles.listContentContainer}
        keyExtractor={(item) => item.idFood.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>

            {/* Recipe */}
            <TouchableOpacity
              style={styles.recipeInfo}
              onPress={() =>
                navigation.navigate("RecipeDetail", item)
              }
            >
              <Image
                source={{ uri: item.recipeImage }}
                style={styles.recipeImage}
              />

              <Text style={styles.recipeTitle}>
                {item.recipeName.length > 20
                  ? item.recipeName.substring(0, 20) + "..."
                  : item.recipeName}
              </Text>
            </TouchableOpacity>

            {/* Unfavorite Button */}
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleUnfavorite(item)}
            >
              <Text style={styles.heart}>♥</Text>
              <Text style={styles.removeText}>
                Remove
              </Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  emptyText: {
    fontSize: hp(2.5),
    color: "#6B7280",
    marginBottom: hp(2),
  },

  heading: {
    fontSize: hp(3.8),
    marginTop: hp(4),
    textAlign: "center",
    fontWeight: "600",
    color: "#4B5563",
  },

  backButton: {
    backgroundColor: "#4F75FF",
    padding: wp(0.7),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: 300,
    alignSelf: "center",
    marginTop: hp(2),
    marginBottom: hp(1.5),
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(2.2),
  },

  listContentContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },

  cardContainer: {
    backgroundColor: "#fff",
    marginBottom: hp(2),
    padding: wp(4),
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  recipeInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  recipeImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 10,
    marginRight: wp(4),
  },

  recipeTitle: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "#4B5563",
    flexShrink: 1,
  },

  favoriteButton: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(2),
  },

  heart: {
    fontSize: hp(3.5),
    color: "#EF4444",
  },

  removeText: {
    fontSize: hp(1.5),
    color: "#EF4444",
    fontWeight: "600",
  },
});