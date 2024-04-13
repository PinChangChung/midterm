import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Navigation from "./src/navigation";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";

import { store } from "./src/redux/store";
import { Provider } from "react-redux";


const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <GluestackUIProvider config={config}>
          <Navigation />
        </GluestackUIProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
