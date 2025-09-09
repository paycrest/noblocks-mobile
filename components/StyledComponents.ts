import { remapProps } from "nativewind";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const StyledKeyboardAwareScrollView = remapProps(
  KeyboardAwareScrollView,
  {
    contentContainerStyle: "contentContainerClassName",
  }
);
