import { Copy, X } from "lucide-react-native";
import React, { FunctionComponent } from "react";
import { FlatList, View } from "react-native";

import tw from "@/app/lib/tailwind";
import BackdropBlur from "@/components/modals/BackdropBlur";
import BaseModal from "@/components/modals/BaseModal";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const sampleCodes = [
  "1234 5678 9012",
  "3456 7890 1234",
  "4567 8901 2345",
  "5678 9012 3456",
  "7890 1234 5678",
  "5823 7462 8954",
  "9012 3456 7890",
  "2345 6789 0123",
  "2947 8635 6728",
  "7392 4856 2187",
];

const BackupCodesModal: FunctionComponent<Props> = ({ ...props }) => {
  const colors = useThemeColors();
  const { hp } = useAppDimensions();
  return (
    <BaseModal {...props}>
      <BackdropBlur onClose={props.onClose} />
      <View
        style={{
          height: "68%",
          position: "absolute",
          width: "92%",
          bottom: 10,
          borderRadius: 40,
          backgroundColor: colors.surface_overlay,
          padding: 30,
          marginHorizontal: 40,
          marginBottom: 20,
          alignSelf: "center",
        }}
      >
        <View style={tw`flex-row items-center justify-between`}>
          <ResponsiveUi.Text semiBold>Add 2-Factor auth</ResponsiveUi.Text>
          <X onPress={props.onClose} size={20} color={colors.secondary} />
        </View>
        <View className="mt-4">
          <ResponsiveUi.Text xxs regular secondary>
            Backup these codes
          </ResponsiveUi.Text>
          <ResponsiveUi.Text xxs regular secondary tailwind="mt-3">
            Use these unique codes to recover your account in case you lose
            access to your device.
          </ResponsiveUi.Text>
        </View>

        <FlatList
          data={sampleCodes}
          renderItem={(item) => (
            <View
              className={`border-2 px-3 py-1 rounded-lg border-white   dark:border-white dark:bg-gray`}
            >
              <ResponsiveUi.Text xs>{item.item}</ResponsiveUi.Text>
            </View>
          )}
          numColumns={2}
          columnWrapperStyle={tw`justify-around py-2`}
          contentContainerStyle={{
            borderWidth: 0.2,
            marginTop: 20,
            borderColor: colors.secondary,
            borderRadius: 20,
            paddingVertical: 10,
            height: hp(30),
            justifyContent: "center",
          }}
        />
        <ResponsiveUi.Text xxs regular secondary tailwind="mt-2">
          Take a screenshot or save the codes in your vault manager.
        </ResponsiveUi.Text>
        <View className="mt-4">
          <ResponsiveUi.Button
            title="Copy codes"
            action={() => {}}
            color="black"
            style={tw`mb-4 bg-gray border-accent-gray dark:border-0`}
            iconMiddle={<Copy className="ml-4" color={colors.text} />}
          />
          <ResponsiveUi.Button title="Done" action={() => {}} />
        </View>
      </View>
    </BaseModal>
  );
};

export default BackupCodesModal;
