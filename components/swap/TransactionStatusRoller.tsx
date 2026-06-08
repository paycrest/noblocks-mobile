import LoadingSunburstIcon from "@/components/swap/LoadingSunburstIcon";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { CheckCircle2 } from "lucide-react-native";
import React, { useMemo } from "react";
import { View } from "react-native";

type StatusVariant = "yellow" | "green" | "neutral";

type StatusItem = {
  label: string;
  variant: StatusVariant;
  showSpinner?: boolean;
  showCheck?: boolean;
};

const INDEXING_STATUSES = new Set(["pending", "initiated", "deposited"]);

const SUCCESS_STATUSES = new Set(["validated", "settled", "fulfilled"]);

function resolveStatusItem(status?: string | null): StatusItem {
  const normalized = status?.trim().toLowerCase();

  if (!normalized || INDEXING_STATUSES.has(normalized)) {
    return { label: "indexing", variant: "yellow", showSpinner: true };
  }

  if (SUCCESS_STATUSES.has(normalized)) {
    return { label: normalized, variant: "green", showCheck: true };
  }

  return { label: normalized, variant: "neutral" };
}

interface TransactionStatusRollerProps {
  status?: string | null;
}

const TransactionStatusRoller: React.FC<TransactionStatusRollerProps> = ({
  status,
}) => {
  const colors = useThemeColors();
  const item = useMemo(() => resolveStatusItem(status), [status]);

  const variantStyles = useMemo(() => {
    switch (item.variant) {
      case "yellow":
        return {
          backgroundColor: "rgba(242, 199, 28, 0.14)",
          textColor: colors.olive2,
          iconColor: colors.yellow,
        };
      case "green":
        return {
          backgroundColor: "rgba(57, 198, 93, 0.14)",
          textColor: colors.success,
          iconColor: colors.success,
        };
      default:
        return {
          backgroundColor: colors.neutral_surface,
          textColor: colors.text,
          iconColor: colors.text,
        };
    }
  }, [colors.neutral_surface, colors.olive2, colors.success, colors.text, colors.yellow, item.variant]);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: variantStyles.backgroundColor,
        borderRadius: 360,
        paddingHorizontal: 8,
        paddingVertical: 4,
        gap: 4,
        minHeight: 28,
      }}
    >
      {item.showSpinner ? (
        <LoadingSunburstIcon color={variantStyles.iconColor} size={16} />
      ) : item.showCheck ? (
        <CheckCircle2 size={16} color={variantStyles.iconColor} />
      ) : null}
      <ResponsiveUi.Text fontSize={14} color={variantStyles.textColor}>
        {item.label}
      </ResponsiveUi.Text>
    </View>
  );
};

export { INDEXING_STATUSES, resolveStatusItem };
export default TransactionStatusRoller;
