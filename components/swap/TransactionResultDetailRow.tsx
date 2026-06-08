import { ResponsiveUi } from "@/components/ResponsiveUi";
import React from "react";
import { View } from "react-native";

interface TransactionResultDetailRowProps {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
  valueMedium?: boolean;
}

const TransactionResultDetailRow: React.FC<TransactionResultDetailRowProps> = ({
  label,
  value,
  labelColor,
  valueColor,
  valueMedium = false,
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <ResponsiveUi.Text fontSize={14} color={labelColor} style={{ lineHeight: 20 }}>
      {label}
    </ResponsiveUi.Text>
    <ResponsiveUi.Text
      fontSize={14}
      color={valueColor}
      medium={valueMedium}
      style={{ lineHeight: 20, textAlign: "right" }}
    >
      {value}
    </ResponsiveUi.Text>
  </View>
);

export default TransactionResultDetailRow;
