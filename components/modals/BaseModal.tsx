import React, { FunctionComponent, ReactNode } from "react";

import Modal from "react-native-modal";

interface Props {
  children: ReactNode;
  onClose: () => void;
  isVisible: boolean;
  avoidKeyboard?: boolean;
}

const BaseModal: FunctionComponent<Props> = ({
  children,
  onClose,
  isVisible,
  avoidKeyboard = true,
}) => {
  return (
    <Modal
      onBackdropPress={onClose}
      isVisible={isVisible}
      avoidKeyboard={avoidKeyboard}
      backdropOpacity={0.7}
      animationIn={"bounceIn"}
      animationInTiming={1000}
      animationOut={"bounceOut"}
      animationOutTiming={1000}
      style={{ margin: 0, padding: 0 }}
    >
      {children}
    </Modal>
  );
};

export default BaseModal;
