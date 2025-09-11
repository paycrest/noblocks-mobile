import { styled } from "nativewind";
import { FlatList, ScrollView, SectionList } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView, {
  props: {
    contentContainerStyle: true,
  },
});

export const StyledScrollView = styled(ScrollView, {
  props: {
    contentContainerStyle: true,
  },
});

export const StyledFlatList = styled(FlatList<any>, {
  props: {
    contentContainerStyle: true,
    columnWrapperStyle: true,
    ListFooterComponentStyle: true,
  },
});

export const StyledSectionList = styled(SectionList<any>, {
  props: {
    contentContainerStyle: true,
  },
});

export const StyledReanimatedSwipeable = styled(ReanimatedSwipeable, {
  props: {
    containerStyle: true,
  },
});
