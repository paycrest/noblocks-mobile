import { useColorScheme } from "react-native";

// import {useSelector} from '../store/Store.ts';

export const useAppColorScheme = () => {
  const { appTheme } = { appTheme: null }; // useSelector((state) => state.settings);
  const colorScheme = useColorScheme();

  return appTheme ?? colorScheme ?? "light";
};
