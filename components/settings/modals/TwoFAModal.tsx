import React, { FunctionComponent, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import BackdropBlur from "@/components/modals/BackdropBlur";
import BaseModal from "@/components/modals/BaseModal";
import { useThemeColors } from "@/hooks/useThemeColor";
import { X } from "lucide-react-native";
import tw from "twrnc";
import { ResponsiveUi } from "../../ResponsiveUi";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

interface SelectorItem {
  title: string;
  subtext: string;
}

interface SelectorProps extends SelectorItem {
  onPress: () => void;
  selected: boolean;
}

const options: SelectorItem[] = [
  {
    title: "Authenticator app",
    subtext: "Use an authenticator app to generate a one-time code",
  },
  {
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
  const borderColor = selected ? colors.slate : colors.gray_hover;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        tw`justify-between border-[0.5px] border-gray-hover py-6 rounded-2xl  mb-4`,
        { borderColor },
      ]}
    >
      <ResponsiveUi.Text xs medium tailwind="ml-4">
        {title}
      </ResponsiveUi.Text>
      <ResponsiveUi.Text
        xxs
        regular
        tailwind="ml-4"
        style={{ width: "80%", marginTop: 7 }}
      >
        {subtext}
      </ResponsiveUi.Text>
    </TouchableOpacity>
  );
};

const TwoFAModal: FunctionComponent<Props> = ({ isVisible, onClose }) => {
  const colors = useThemeColors();

  const [selected2FA, setSelected2FA] = useState<string>("");
  return (
    <BaseModal onClose={onClose} isVisible={isVisible}>
      <BackdropBlur onClose={onClose} />
      <View
        style={{
          height: "50%",
          position: "absolute",
          width: "92%",
          bottom: 10,
          borderRadius: 40,
          backgroundColor: colors.surface_overlay,
          padding: 20,
          marginHorizontal: 40,
          marginBottom: 20,
          alignSelf: "center",
        }}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <ResponsiveUi.Text semiBold>Add 2-Factor auth</ResponsiveUi.Text>
          <X onPress={onClose} size={20} color={colors.secondary} />
        </View>
        <View className="mt-4">
          <ResponsiveUi.Text xxs regular secondary>
            Add extra layer of security with unique access codes via SMS or an
            authenticator app
          </ResponsiveUi.Text>
        </View>
        <View className="mt-6">
          {options.map((option) => (
            <Selector
              key={option.title}
              {...option}
              onPress={() => setSelected2FA(option.title)}
              selected={option.title === selected2FA}
            />
          ))}
        </View>
        <ResponsiveUi.Button
          title="Continue with app"
          containerStyle="mt-8"
          action={() => {}}
          disabled={selected2FA.length === 0}
        />
      </View>
    </BaseModal>
  );
};

export default TwoFAModal;
