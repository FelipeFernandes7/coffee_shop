import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/theme";
import { useStore } from "zustand";
import { coffeeContext } from "../store/store";
import { Coffee } from "../data/CoffeeData";
import { useRef, useState } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import CoffeeCard from "../components/CoffeeCard";
import Icon from "../components/icon";
import { HeaderBar } from "../components/HeaderBar";

interface CategoryIndex {
  index: number;
  category: string;
}

type DataItem = {
  name: string;
};

const getCategoriesFromData = (data: DataItem[]): string[] => {
  const temp: Record<string, number> = {};

  for (const item of data) {
    if (temp[item.name] === undefined) {
      temp[item.name] = 1;
    } else {
      temp[item.name]++;
    }
  }

  const categories = Object.keys(temp);
  categories.unshift("All");

  return categories;
};

function getCoffeeList(category: string, data: Coffee[]) {
  if (category === "All") {
    return data;
  } else {
    return data.filter((item) => item.name === category);
  }
}

export default function Home({ navigation }: any) {
  const { coffeeList, beanList, addToCart, calculateCartPrice } =
    useStore(coffeeContext);
  const [categories, setCategories] = useState<string[]>(
    getCategoriesFromData(coffeeList),
  );
  const [searchText, setSearchText] = useState<string>("");
  const [categoryIndex, setCategoryIndex] = useState<CategoryIndex>({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState<Coffee[]>(
    getCoffeeList(categoryIndex.category, coffeeList),
  );

  const ListRef = useRef<FlatList<Coffee> | null>(null);
  const tabBarHeight = useBottomTabBarHeight();

  // Funções
  function searchCoffee(search: string) {
    if (search !== "") {
      ListRef.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({ index: 0, category: categories[0] });
      setSortedCoffee(
        coffeeList.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }

  function resetSearchCoffee() {
    ListRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({ index: 0, category: categories[0] });
    setSortedCoffee(coffeeList);
    setSearchText("");
  }

  function coffeeCardAddToCart({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: Coffee) {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    });
    calculateCartPrice();
    ToastAndroid.showWithGravity(
      `${name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  }
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
      >
        {/* App Header */}
        <HeaderBar />

        <Text style={styles.ScreenTitle}>
          Find the best{"\n"}coffee for you
        </Text>

        {/* Search Input */}

        <View style={styles.InputContainerComponent}>
          <TouchableOpacity
            onPress={() => {
              searchCoffee(searchText);
            }}
          >
            <Icon
              style={styles.InputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput
            placeholder="Find Your Coffee..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              searchCoffee(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
            <TouchableOpacity
              onPress={() => {
                resetSearchCoffee();
              }}
            >
              <Icon
                style={styles.InputIcon}
                name="close"
                size={FONTSIZE.size_16}
                color={COLORS.primaryLightGreyHex}
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}
        >
          {categories.map((data, index) => (
            <View
              key={index.toString()}
              style={styles.CategoryScrollViewContainer}
            >
              <TouchableOpacity
                style={styles.CategoryScrollViewItem}
                onPress={() => {
                  ListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                  setCategoryIndex({
                    index: index,
                    category: categories[index],
                  });
                  setSortedCoffee([
                    ...getCoffeeList(categories[index], coffeeList),
                  ]);
                }}
              >
                <Text
                  style={[
                    styles.CategoryText,
                    categoryIndex.index == index
                      ? { color: COLORS.primaryOrangeHex }
                      : {},
                  ]}
                >
                  {data}
                </Text>
                {categoryIndex.index == index ? (
                  <View style={styles.ActiveCategory} />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Coffee Flatlist */}

        <FlatList
          ref={ListRef}
          horizontal
          ListEmptyComponent={
            <View style={styles.EmptyListContainer}>
              <Text style={styles.CategoryText}>No Coffee Available</Text>
            </View>
          }
          showsHorizontalScrollIndicator={false}
          data={sortedCoffee}
          contentContainerStyle={styles.FlatListContainer}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Details", {
                    index: item.index,
                    id: item.id,
                    type: item.type,
                  });
                }}
              >
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  buttonPressHandler={coffeeCardAddToCart}
                />
              </TouchableOpacity>
            );
          }}
        />

        <Text style={styles.CoffeeBeansTitle}>Coffee Beans</Text>

        {/* Beans Flatlist */}

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={beanList}
          contentContainerStyle={[
            styles.FlatListContainer,
            { marginBottom: tabBarHeight },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Details", {
                    index: item.index,
                    id: item.id,
                    type: item.type,
                  });
                }}
              >
                <CoffeeCard
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  roasted={item.roasted}
                  imagelink_square={item.imagelink_square}
                  name={item.name}
                  special_ingredient={item.special_ingredient}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  buttonPressHandler={coffeeCardAddToCart}
                />
              </TouchableOpacity>
            );
          }}
        />
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
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: "row",
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: "center",
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: "center",
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get("window").width - SPACING.space_30 * 2,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});
