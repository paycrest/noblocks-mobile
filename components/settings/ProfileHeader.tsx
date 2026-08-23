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
    <View className="flex flex-row items-center" style={{ minHeight: 48 }}>
      <DefaultImage width={48} height={48} />
      <View style={{ marginLeft: 16 }}>
        <ResponsiveUi.Text
          semiBold
          style={{ fontSize: 16, lineHeight: 24 }}
        >
          {formatWalletAddress(walletAddress)}
        </ResponsiveUi.Text>
        <ResponsiveUi.Text
          secondary
          style={{ fontSize: 14, lineHeight: 20, marginTop: 2 }}
        >
          Noblocks
        </ResponsiveUi.Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
