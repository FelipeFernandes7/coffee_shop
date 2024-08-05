import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { coffeeContext } from "../store/store";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { COLORS, SPACING } from "../theme/theme";
import { HeaderBar } from "../components/HeaderBar";
import { EmptyListAnimation } from "../components/EmptyListAnimation";
import { PaymentFooter } from "../components/PaymentFooter";
import { CartItem } from "../components/CartItem";
import { useStore } from "zustand";

export default function Cart({ navigation }: any) {
  const {
    cartList,
    cartPrice,
    decrementCartItemQuantity,
    calculateCartPrice,
    incrementCartItemQuantity,
  } = useStore(coffeeContext);

  const tabBarHeight = useBottomTabBarHeight();

  const buttonPressHandler = () => {
    navigation.push("Payment", { amount: cartPrice });
  };

  const incrementCartItemQuantityHandler = (id: string, size: string) => {
    incrementCartItemQuantity(id, size);
    calculateCartPrice();
  };

  const decrementCartItemQuantityHandler = (id: string, size: string) => {
    decrementCartItemQuantity(id, size);
    calculateCartPrice();
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
            <HeaderBar title="Cart" />

            {cartList.length == 0 ? (
              <EmptyListAnimation title={"Cart is Empty"} />
            ) : (
              <View style={styles.ListItemContainer}>
                {cartList.map((data: any) => (
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
                    <CartItem
                      id={data.id}
                      name={data.name}
                      imagelink_square={data.imagelink_square}
                      special_ingredient={data.special_ingredient}
                      roasted={data.roasted}
                      prices={data.prices}
                      type={data.type}
                      incrementCartItemQuantityHandler={
                        incrementCartItemQuantityHandler
                      }
                      decrementCartItemQuantityHandler={
                        decrementCartItemQuantityHandler
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {cartList.length != 0 ? (
            <PaymentFooter
              buttonPressHandler={buttonPressHandler}
              buttonTitle="Pay"
              price={{ price: cartPrice, currency: "$" }}
            />
          ) : (
            <></>
          )}
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
