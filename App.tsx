import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import Details from "./src/screens/Details";
import Payment from "./src/screens/Payment";
import TabNavigator from "./src/navigators/TabNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="Payment"
          component={Payment}
          options={{ animation: "slide_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
