import React, { FunctionComponent, useEffect, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";

import BaseModal from "@/components/modals/BaseModal";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useThemeColors } from "@/hooks/useThemeColor";
import { X } from "lucide-react-native";

export type TwoFAMethod = "authenticator" | "sms";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onContinue: (method: TwoFAMethod) => void;
}

interface SelectorItem {
  id: TwoFAMethod;
  title: string;
  subtext: string;
}

interface SelectorProps extends SelectorItem {
  onPress: () => void;
  selected: boolean;
}

const options: SelectorItem[] = [
  {
    id: "authenticator",
    title: "Authenticator app",
    subtext: "Use an authenticator app to generate a one-time code",
  },
  {
    id: "sms",
    title: "SMS",
    subtext: "Receive a text message with one-time code",
  },
];

const Selector: FunctionComponent<SelectorProps> = ({
  title,
  subtext,
  onPress,
  selected,
}) => {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        {
          borderColor: selected ? colors.slate : colors.gray_hover,
          backgroundColor: colors.surface_overlay,
        },
      ]}
    >
      <ResponsiveUi.Text
        medium
        style={{ fontSize: 14, lineHeight: 20, marginLeft: 16 }}
      >
        {title}
      </ResponsiveUi.Text>
      <ResponsiveUi.Text
        regular
        secondary
        style={{ width: "82%", marginTop: 7, marginLeft: 16, fontSize: 12 }}
      >
        {subtext}
      </ResponsiveUi.Text>
    </Pressable>
  );
};

const TwoFAModal: FunctionComponent<Props> = ({
  isVisible,
  onClose,
  onContinue,
}) => {
  const colors = useThemeColors();
  const [selectedMethod, setSelectedMethod] = useState<TwoFAMethod | null>(
    null,
  );

  useEffect(() => {
    if (isVisible) {
      setSelectedMethod(null);
    }
  }, [isVisible]);

  const handleContinue = () => {
    if (!selectedMethod) {
      return;
    }

    onContinue(selectedMethod);
  };

  return (
    <BaseModal
      isVisible={isVisible}
      onClose={onClose}
      presentation="bottom"
    >
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.surface_overlay,
            borderColor: colors.gray_hover,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <ResponsiveUi.Text semiBold style={{ fontSize: 18, lineHeight: 24 }}>
            Add 2-Factor auth
          </ResponsiveUi.Text>
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <X size={20} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <ResponsiveUi.Text
          regular
          secondary
          style={{ marginTop: 12, fontSize: 12, lineHeight: 18 }}
        >
          Add extra layer of security with unique access codes via SMS or an
          authenticator app
        </ResponsiveUi.Text>

        <View style={{ marginTop: 24 }}>
          {options.map((option) => (
            <Selector
              key={option.id}
              {...option}
              onPress={() => setSelectedMethod(option.id)}
              selected={option.id === selectedMethod}
            />
          ))}
        </View>

        <ResponsiveUi.Button
          title={
            selectedMethod === "sms" ? "Continue with SMS" : "Continue with app"
          }
          containerStyle="mt-8"
          action={handleContinue}
          disabled={!selectedMethod}
        />
      </View>
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 0.5,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 28,
    minHeight: "52%",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  option: {
    borderWidth: 0.5,
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 12,
  },
});

export default TwoFAModal;
