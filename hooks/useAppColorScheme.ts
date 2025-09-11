import { useSelector } from "@/app/store/Store";

export const useAppColorScheme = () => {
  const { appTheme } = useSelector(["appTheme"]);
  return appTheme;
};
