import * as React from "react";

import Svg, { G, Path, SvgProps } from "react-native-svg";

import { useSelector } from "@/app/store/Store";
import { useThemeColors } from "@/hooks/useThemeColor";

function HomeIcon(props: SvgProps) {
  const { appTheme } = useSelector(["appTheme"]);
  const colors = useThemeColors();
  return (
    <Svg width={32} height={33} viewBox="0 0 32 33" fill="none" {...props}>
      <G opacity={1}>
        <Path
          d="M12.041 2.817l10.917 1.331a4.599 4.599 0 013.978 5.321l-2.113 12.683a4.599 4.599 0 01-4.75 3.838L9.618 25.5a4.599 4.599 0 01-4.349-5.15L6.92 6.825a4.599 4.599 0 015.121-4.008z"
          stroke={props.color ?? "#fff"}
          strokeOpacity={1}
          strokeWidth={2.05321}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M.742 13.853A9.123 9.123 0 019.865 4.73h10.329a5.39 5.39 0 015.39 5.39v16.874a5.39 5.39 0 01-5.39 5.39H6.132a5.39 5.39 0 01-5.39-5.39v-13.14zm9.123-6.78a6.78 6.78 0 00-6.78 6.78v13.141a3.047 3.047 0 003.047 3.047h14.062a3.047 3.047 0 003.047-3.047V10.12a3.047 3.047 0 00-3.047-3.047H9.864z"
        />
        <Path
          d="M19.393 5.69a5.245 5.245 0 015.244 5.245v13.963a5.245 5.245 0 01-5.244 5.245H8.23a5.246 5.246 0 01-5.245-5.245V10.935A5.245 5.245 0 018.23 5.69h11.163z"
          fill={colors.background}
          stroke={props.color ?? "#898989"}
          strokeWidth={2.05321}
        />
      </G>
    </Svg>
  );
}

export default HomeIcon;
