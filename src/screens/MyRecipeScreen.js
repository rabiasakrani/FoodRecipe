import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { useNavigation } from "@react-navigation/native";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  
  export default function MyRecipeScreen() {
    const navigation = useNavigation();
  
    const [recipes, setrecipes] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchrecipes = async () => {
        try {
          const storedRecipes = await AsyncStorage.getItem("customrecipes");
  
          if (storedRecipes) {
            setrecipes(JSON.parse(storedRecipes));
          } else {
            setrecipes([]);
          }
        } catch (error) {
          console.log("Error fetching recipes:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchrecipes();
    }, []);
  
    const refreshRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem("customrecipes");
  
        if (storedRecipes) {
          setrecipes(JSON.parse(storedRecipes));
        } else {
          setrecipes([]);
        }
      } catch (error) {
        console.log("Error refreshing recipes:", error);
      }
    };
  
    const handleAddrecipe = () => {
      navigation.navigate("RecipesFormScreen", {
        onrecipeEdited: refreshRecipes,
      });
    };
  
    const handlerecipeClick = (recipe) => {
      navigation.navigate("CustomRecipesScreen", {
        recipe: recipe,
      });
    };
  
    const deleterecipe = async (index) => {
      try {
        const updatedRecipes = recipes.filter(
          (_, recipeIndex) => recipeIndex !== index
        );
  
        setrecipes(updatedRecipes);
  
        await AsyncStorage.setItem(
          "customrecipes",
          JSON.stringify(updatedRecipes)
        );
      } catch (error) {
        console.log("Error deleting recipe:", error);
      }
    };
  
    const editrecipe = (recipe, index) => {
      navigation.navigate("RecipesFormScreen", {
        recipeToEdit: recipe,
        recipeIndex: index,
        onrecipeEdited: refreshRecipes,
      });
    };
  
    return (
      <View style={styles.container}>
        {/* Back to Home Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.mainButton}
        >
          <Text style={styles.mainButtonText}>Back to Home</Text>
        </TouchableOpacity>
  
        {/* Add Recipe Button */}
        <TouchableOpacity
          onPress={handleAddrecipe}
          style={styles.mainButton}
        >
          <Text style={styles.mainButtonText}>Add New Recipe</Text>
        </TouchableOpacity>
  
        {loading ? (
          <ActivityIndicator size="large" color="#f59e0b" />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {recipes.length === 0 ? (
              <Text style={styles.norecipesText}>
                No recipes added yet.
              </Text>
            ) : (
              recipes.map((recipe, index) => (
                <View
                  key={index}
                  style={styles.recipeCard}
                  testID="recipeCard"
                >
                  <TouchableOpacity
                    testID="handlerecipeBtn"
                    onPress={() => handlerecipeClick(recipe)}
                  >
                    {recipe.image ? (
                      <Image
                        source={{ uri: recipe.image }}
                        style={styles.recipeImage}
                      />
                    ) : null}
  
                    <Text style={styles.recipeTitle}>
                      {recipe.title}
                    </Text>
  
                    <Text
                      style={styles.recipeDescription}
                      testID="recipeDescp"
                      numberOfLines={2}
                    >
                      <Text style={styles.label}>Ingredients: </Text>
                      {recipe.ingredients || recipe.description}
                    </Text>
  
                    {recipe.instructions ? (
                      <Text
                        style={styles.recipeDescription}
                        numberOfLines={2}
                      >
                        <Text style={styles.label}>Instructions: </Text>
                        {recipe.instructions}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
  
                  {/* Edit and Delete Buttons */}
                  <View
                    style={styles.actionButtonsContainer}
                    testID="editDeleteButtons"
                  >
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => editrecipe(recipe, index)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
  
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleterecipe(index)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: wp(4),
      backgroundColor: "#F9FAFB",
    },
  
    mainButton: {
      backgroundColor: "#4F75FF",
      padding: wp(0.7),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      width: 300,
      alignSelf: "center",
      marginBottom: hp(1.5),
    },
  
    mainButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(2.2),
    },
  
    scrollContainer: {
      paddingBottom: hp(2),
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      flexWrap: "wrap",
    },
  
    norecipesText: {
      textAlign: "center",
      fontSize: hp(2),
      color: "#6B7280",
      marginTop: hp(5),
    },
  
    recipeCard: {
      width: 400,
      minHeight: 300,
      backgroundColor: "#fff",
      padding: wp(3),
      borderRadius: 8,
      marginBottom: hp(2),
      marginHorizontal: wp(1),
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      elevation: 3,
    },
  
    recipeImage: {
      width: 300,
      height: 150,
      borderRadius: 8,
      marginBottom: hp(1),
      alignSelf: "center",
    },
  
    recipeTitle: {
      fontSize: hp(2),
      fontWeight: "600",
      color: "#111827",
      marginBottom: hp(0.5),
    },
  
    recipeDescription: {
      fontSize: hp(1.8),
      color: "#6B7280",
      marginBottom: hp(1),
    },
  
    label: {
      fontWeight: "bold",
      color: "#111827",
    },
  
    actionButtonsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
  
    editButton: {
      backgroundColor: "#34D399",
      padding: wp(0.5),
      borderRadius: 5,
      width: 100,
      alignItems: "center",
    },
  
    editButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
  
    deleteButton: {
      backgroundColor: "#EF4444",
      padding: wp(0.5),
      borderRadius: 5,
      width: 100,
      alignItems: "center",
    },
  
    deleteButtonText: {
      color: "#fff",
      fontWeight: "600",
      fontSize: hp(1.8),
    },
  });