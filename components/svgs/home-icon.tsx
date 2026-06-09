import * as React from "react";

import Svg, { Path, SvgProps } from "react-native-svg";

import { useThemeColors } from "@/hooks/useThemeColor";

type Props = SvgProps & {
  focused?: boolean;
};

function HomeIcon({ focused = false, color, ...props }: Props) {
  const colors = useThemeColors();
  const tint = color ?? colors.secondary;

  if (focused) {
    return (
      <Svg width={32} height={32} viewBox="0 0 32 32" fill="none" {...props}>
        <Path
          d="M5.90104 6.70046C6.27714 3.6169 9.08174 1.42208 12.1653 1.79818L23.082 3.12968C26.2614 3.51747 28.4757 6.47812 27.9492 9.63752L25.8355 22.3213C25.3671 25.1321 22.8706 27.1486 20.0241 27.0152L9.57138 26.5255C6.3035 26.3724 3.85525 23.4734 4.25133 20.226L5.90104 6.70046Z"
          fill={tint}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.742188 13.8533C0.742188 8.8149 4.82661 4.73047 9.86499 4.73047H20.1935C23.1702 4.73047 25.5833 7.14354 25.5833 10.1202V26.9941C25.5833 29.9708 23.1702 32.3839 20.1935 32.3839H6.13194C3.15526 32.3839 0.742188 29.9708 0.742188 26.9941V13.8533ZM9.86499 7.073C6.12035 7.073 3.08472 10.1086 3.08472 13.8533V26.9941C3.08472 28.6771 4.449 30.0414 6.13194 30.0414H20.1935C21.8765 30.0414 23.2408 28.6771 23.2408 26.9941V10.1202C23.2408 8.43729 21.8765 7.073 20.1935 7.073H9.86499Z"
          fill={colors.background}
        />
        <Path
          d="M4.01172 10.9353C4.01172 8.60547 5.9004 6.7168 8.2302 6.7168H19.3921C21.7219 6.7168 23.6106 8.60548 23.6106 10.9353V24.897C23.6106 27.2268 21.7219 29.1155 19.3921 29.1155H8.2302C5.9004 29.1155 4.01172 27.2268 4.01172 24.897V10.9353Z"
          fill={tint}
        />
      </Svg>
    );
  }

  return (
    <Svg width={32} height={32} viewBox="0 0 32 33" fill="none" {...props}>
      <Path
        d="M12.041 2.817l10.917 1.331a4.599 4.599 0 013.978 5.321l-2.113 12.683a4.599 4.599 0 01-4.75 3.838L9.618 25.5a4.599 4.599 0 01-4.349-5.15L6.92 6.825a4.599 4.599 0 015.121-4.008z"
        stroke={tint}
        strokeWidth={2}
        fill="none"
      />
      <Path
        d="M19.393 5.69a5.245 5.245 0 015.244 5.245v13.963a5.245 5.245 0 01-5.244 5.245H8.23a5.246 5.246 0 01-5.245-5.245V10.935A5.245 5.245 0 018.23 5.69h11.163z"
        fill={colors.background}
        stroke={tint}
        strokeWidth={2}
      />
    </Svg>
  );
}

export default HomeIcon;
