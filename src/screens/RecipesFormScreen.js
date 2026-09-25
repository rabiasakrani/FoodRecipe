import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } =
    route.params || {};

  const [title, setTitle] = useState(
    recipeToEdit ? recipeToEdit.title : ""
  );

  const [image, setImage] = useState(
    recipeToEdit ? recipeToEdit.image : ""
  );

  const [ingredients, setIngredients] = useState(
    recipeToEdit
      ? recipeToEdit.ingredients || recipeToEdit.description || ""
      : ""
  );

  const [instructions, setInstructions] = useState(
    recipeToEdit ? recipeToEdit.instructions || "" : ""
  );

  const saverecipe = async () => {
    try {
      const newrecipe = {
        title,
        image,
        ingredients,
        instructions,
      };

      const storedRecipes =
        await AsyncStorage.getItem("customrecipes");

      const recipes = storedRecipes
        ? JSON.parse(storedRecipes)
        : [];

      if (recipeToEdit) {
        recipes[recipeIndex] = newrecipe;
      } else {
        recipes.push(newrecipe);
      }

      await AsyncStorage.setItem(
        "customrecipes",
        JSON.stringify(recipes)
      );

      if (onrecipeEdited) {
        onrecipeEdited();
      }

      navigation.goBack();
    } catch (error) {
      console.log("Error saving recipe:", error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>
          Back to My Food
        </Text>
      </TouchableOpacity>

      {/* Recipe Name */}
      <TextInput
        placeholder="Recipe Name"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      {/* Image URL */}
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      {/* Image Preview */}
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      ) : (
        <Text style={styles.imagePlaceholder}>
          Upload Image URL
        </Text>
      )}

      {/* Ingredients */}
      <TextInput
        placeholder="Ingredients"
        value={ingredients}
        onChangeText={setIngredients}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.largeInput]}
      />

      {/* Instructions */}
      <TextInput
        placeholder="Steps / Instructions"
        value={instructions}
        onChangeText={setInstructions}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.largeInput]}
      />

      {/* Save Recipe */}
      <TouchableOpacity
        onPress={saverecipe}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>
          Save Recipe
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  contentContainer: {
    padding: wp(4),
    paddingBottom: hp(5),
  },

  backButton: {
    backgroundColor: "#4F75FF",
    padding: wp(0.7),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: 300,
    alignSelf: "center",
    marginBottom: hp(1.5),
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(2.2),
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(1),
    marginVertical: hp(1),
    borderRadius: 5,
  },

  largeInput: {
    minHeight: hp(15),
    textAlignVertical: "top",
  },

  image: {
    width: 300,
    height: 200,
    marginVertical: hp(1),
    alignSelf: "center",
    borderRadius: 8,
  },

  imagePlaceholder: {
    height: hp(20),
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    paddingTop: hp(8),
    color: "#6B7280",
  },

  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(0.8),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: hp(2),
  },
});