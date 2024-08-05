import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { coffeeContext } from "../store/store";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { COLORS, SPACING } from "../theme/theme";
import { HeaderBar } from "../components/HeaderBar";
import { EmptyListAnimation } from "../components/EmptyListAnimation";
import { FavoritesItemCard } from "../components/FavoritesItemCard";
import { useStore } from "zustand";

export default function Favorites({ navigation }: any) {
  const tabBarHeight = useBottomTabBarHeight();
  const { favoritesList, addToFavoriteList, deleteFromFavoriteList } =
    useStore(coffeeContext);
  type TypeProduct = "Bean" | "Coffee";

  const Togglefavorites = (
    favorites: boolean,
    type: TypeProduct,
    id: string,
  ) => {
    favorites ? deleteFromFavoriteList(type, id) : addToFavoriteList(type, id);
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
      >
        <View
          style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight }]}
        >
          <View style={styles.ItemContainer}>
            <HeaderBar title="favorites" />

            {favoritesList.length == 0 ? (
              <EmptyListAnimation title={"No favorites"} />
            ) : (
              <View style={styles.ListItemContainer}>
                {favoritesList.map((data: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push("Details", {
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}
                  >
                    <FavoritesItemCard
                      id={data.id}
                      imagelink_portrait={data.imagelink_portrait}
                      name={data.name}
                      special_ingredient={data.special_ingredient}
                      type={data.type}
                      ingredients={data.ingredients}
                      average_rating={data.average_rating}
                      ratings_count={data.ratings_count}
                      roasted={data.roasted}
                      description={data.description}
                      favorites={data.favorites}
                      TogglefavoritesItem={Togglefavorites}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: "space-between",
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_20,
  },
});
