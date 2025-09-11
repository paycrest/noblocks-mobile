import React, { FunctionComponent } from "react";

import { formatWalletAddress } from "@/utils/general";
import { View } from "react-native";
import { ResponsiveUi } from "../ResponsiveUi";
import DefaultImage from "../svgs/default-image";

interface Props {
  imageUrl?: string;
  walletAddress: string;
}

const ProfileHeader: FunctionComponent<Props> = ({
  imageUrl,
  walletAddress,
}) => {
  return (
    <View className="flex flex-row items-center">
      <DefaultImage />
      <View className="ml-4">
        <ResponsiveUi.Text small semiBold>
          {formatWalletAddress(walletAddress)}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text small secondary>
          Noblocks
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
