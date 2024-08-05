import AsyncStorage from "@react-native-async-storage/async-storage";
import CoffeeData, { Coffee } from "../data/CoffeeData";
import BeansData, { Bean } from "../data/BeansData";
import { persist, createJSONStorage } from "zustand/middleware";
import { create } from "zustand";
import { produce } from "immer";

interface Price {
  size: string;
  price: string;
  currency: string;
  quantity?: number;
}

type CartItem = {
  id: string;
  index: number;
  name: string;
  roasted: string;
  imagelink_square: any;
  special_ingredient: string;
  type: string;
  prices: {
    size: string;
    price: string;
    currency: string;
    quantity?: number;
  }[];
};

interface FavoriteItem {
  id: string;
  favourite: boolean;
}

interface OrderHistoryItem {
  OrderDate: string;
  CartList: CartItem[];
  CartListPrice: string;
}

type Store = {
  coffeeList: Coffee[];
  beanList: Bean[];
  cartList: CartItem[];
  cartPrice: string;
  favoritesList: FavoriteItem[];
  orderHistoryList: OrderHistoryItem[];
  addToCart: (cartItem: CartItem) => void;
  calculateCartPrice: () => void;
  addToFavoriteList: (type: "Coffee" | "Bean", id: string) => void;
  deleteFromFavoriteList: (type: "Coffee" | "Bean", id: string) => void;
  incrementCartItemQuantity: (id: string, size: string) => void;
  decrementCartItemQuantity: (id: string, size: string) => void;
  addToOrderHistoryListFromCart: () => void;
};

export const coffeeContext = create<Store>()(
  persist(
    (set) => ({
      coffeeList: CoffeeData,
      beanList: BeansData,
      cartList: [],
      favoritesList: [],
      orderHistoryList: [],
      cartPrice: "",
      addToCart: (cartItem) =>
        set(
          produce((state: Store) => {
            let found = false;
            for (const item of state.cartList) {
              if (item.id === cartItem.id) {
                found = true;
                let sizeFound = false;
                for (const price of item.prices) {
                  if (price.size === cartItem.prices[0].size) {
                    sizeFound = true;
                    price.quantity = (price.quantity || 0) + 1;
                    break;
                  }
                }
                if (!sizeFound) {
                  cartItem.prices[0].quantity = 1;
                  item.prices.push(cartItem.prices[0]);
                }
                item.prices.sort((a, b) => a.size.localeCompare(b.size));
                break;
              }
            }
            if (!found) {
              cartItem.prices[0].quantity = 1;
              state.cartList.push(cartItem);
            }
          }),
        ),
      calculateCartPrice: () =>
        set(
          produce((state: Store) => {
            let totalPrice = 0;
            for (const item of state.cartList) {
              let tempPrice = 0;
              for (const price of item.prices) {
                tempPrice += parseFloat(price.price) * (price.quantity || 1);
              }
              item.prices[0].price = tempPrice.toFixed(2).toString();
              totalPrice += tempPrice;
            }
            state.cartPrice = totalPrice.toFixed(2).toString();
          }),
        ),
      addToFavoriteList: (type, id) =>
        set(
          produce((state: Store) => {
            if (type === "Coffee") {
              const coffee = state.coffeeList.find((item) => item.id === id);
              if (coffee) {
                coffee.favourite = !coffee.favourite;
                if (coffee.favourite) {
                  state.favoritesList.unshift(coffee);
                } else {
                  state.favoritesList = state.favoritesList.filter(
                    (item) => item.id !== id,
                  );
                }
              }
            } else if (type === "Bean") {
              const bean = state.beanList.find((item) => item.id === id);
              if (bean) {
                bean.favourite = !bean.favourite;
                if (bean.favourite) {
                  state.favoritesList.unshift(bean);
                } else {
                  state.favoritesList = state.favoritesList.filter(
                    (item) => item.id !== id,
                  );
                }
              }
            }
          }),
        ),
      deleteFromFavoriteList: (type, id) =>
        set(
          produce((state: Store) => {
            if (type === "Coffee") {
              const coffee = state.coffeeList.find((item) => item.id === id);
              if (coffee) {
                coffee.favourite = false;
              }
            } else if (type === "Bean") {
              const bean = state.beanList.find((item) => item.id === id);
              if (bean) {
                bean.favourite = false;
              }
            }
            state.favoritesList = state.favoritesList.filter(
              (item) => item.id !== id,
            );
          }),
        ),
      incrementCartItemQuantity: (id, size) =>
        set(
          produce((state: Store) => {
            const item = state.cartList.find((item) => item.id === id);
            if (item) {
              const price = item.prices.find((price) => price.size === size);
              if (price) {
                price.quantity = (price.quantity || 1) + 1;
              }
            }
          }),
        ),
      decrementCartItemQuantity: (id, size) =>
        set(
          produce((state: Store) => {
            const item = state.cartList.find((item) => item.id === id);
            if (item) {
              const priceIndex = item.prices.findIndex(
                (price) => price.size === size,
              );
              if (priceIndex !== -1) {
                const price = item.prices[priceIndex];
                if (price.quantity && price.quantity > 1) {
                  price.quantity--;
                } else {
                  item.prices.splice(priceIndex, 1);
                }
                if (item.prices.length === 0) {
                  state.cartList = state.cartList.filter(
                    (cartItem) => cartItem.id !== id,
                  );
                }
              }
            }
          }),
        ),
      addToOrderHistoryListFromCart: () =>
        set(
          produce((state: Store) => {
            const totalPrice = state.cartList.reduce(
              (accumulator, item) =>
                accumulator + parseFloat(item.prices[0].price || "0"),
              0,
            );
            const newOrder: OrderHistoryItem = {
              OrderDate: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`,
              CartList: state.cartList,
              CartListPrice: totalPrice.toFixed(2).toString(),
            };
            state.orderHistoryList.unshift(newOrder);
            state.cartList = [];
          }),
        ),
    }),
    {
      name: "coffee-app",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
