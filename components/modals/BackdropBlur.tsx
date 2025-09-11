import React, { FunctionComponent } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { BlurView } from "expo-blur";

interface Props {
  onClose: () => void;
}

const BackdropBlur: FunctionComponent<Props> = ({ onClose }) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onClose}
      style={StyleSheet.absoluteFill}
    >
      <BlurView intensity={10} tint="dark" style={StyleSheet.absoluteFill} />
    </TouchableOpacity>
  );
};

export default BackdropBlur;
