import {
  CrimsonPro_400Regular,
  CrimsonPro_400Regular_Italic,
} from "@expo-google-fonts/crimson-pro";
import {
  Inter_100Thin,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";

const useCustomFonts = () => {
  const [loaded, error] = useFonts({
    Inter_100Thin,
    Inter_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_600SemiBold,
    CrimsonPro_400Regular,
    CrimsonPro_400Regular_Italic,
  });
  return { loaded, error };
};

export default useCustomFonts;
