import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import StackNavigator from "./navigation/Navigator";

const PictomindApp = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StackNavigator />
    </GestureHandlerRootView>
  );
};

export default PictomindApp;
