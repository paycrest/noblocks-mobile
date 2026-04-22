import { ResponsiveUi, ResponsiveUiTextProps } from "@/components/ResponsiveUi";
import {
  cn,
  formatNumbers,
  formatPhoneNumber,
  parseDigits,
} from "@/utils/general";
import _, { omit } from "lodash";
import { EyeClosedIcon, EyeIcon } from "lucide-react-native";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  KeyboardTypeOptions,
  Platform,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

import { Radius } from "@/constants/Size";
import { useAppDimensions } from "@/hooks/useAppDimensions";
import { useThemeColors } from "@/hooks/useThemeColor";
import { SvgProps } from "react-native-svg";

interface FormInputProps {
  rootContainerProps?: ViewProps;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  clearStyle?: ViewStyle;
  leftIcon?: number | React.FC<SvgProps> | any;
  label?: string;
  placeholder?: string;
  important?: string;
  onChangeText: (value: string) => void;
  keyboardType?: KeyboardTypeOptions | undefined;
  iconStyle?: {};
  inputProps?: TextInputProps;
  hasError?: boolean;
  inputType?: "phone" | "numeric" | string;
  value: string | undefined;
  rightAction?: ReactElement | null;
  customErrorMsg?: string | undefined;
  onFocus?: () => void;
  readonly?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  labelViewProps?: ResponsiveUiTextProps;
  errorViewProps?: ResponsiveUiTextProps;
  autoFocus?: boolean;
  isProtected?: boolean;
  inputComponent?: any;
}

export const FormInput = ({
  rootContainerProps,
  style,
  containerStyle,
  leftIcon: LeftIcon,
  rightAction,
  label,
  placeholder,
  important,
  onChangeText,
  keyboardType,
  iconStyle,
  hasError,
  inputType,
  value,
  inputProps,
  customErrorMsg,
  onFocus,
  readonly,
  clearStyle,
  inputClassName,
  containerClassName,
  labelViewProps,
  errorViewProps,
  autoFocus,
  isProtected,
  inputComponent: _InputComponent,
}: FormInputProps) => {
  const colors = useThemeColors();
  const { fontPercentageToDP, wp, hp } = useAppDimensions();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isSecuredEntry, setSecuredEntry] = useState(isProtected || false);

  const inputRef = useRef<TextInput>(null);

  const InputComponent = _InputComponent || TextInput;

  useEffect(() => {
    const error =
      (hasError && _.isEmpty(value)) ||
      (hasError && !_.isEmpty(customErrorMsg));
    setShowError(error || false);
  }, [customErrorMsg, hasError, showError, value]);

  return (
    <View
      style={{ ...style }}
      className={containerClassName}
      {...rootContainerProps}
    >
      {label ? (
        <ResponsiveUi.Text
          light
          paragraph={!labelViewProps?.h6}
          danger={showError}
          tailwind="mb-2"
          {...labelViewProps}
        >
          {label}{" "}
          <ResponsiveUi.Text
            fontSize={fontPercentageToDP(3.5)}
            tailwind="mb-2 text-secondary"
          >
            {important}
          </ResponsiveUi.Text>
        </ResponsiveUi.Text>
      ) : null}
      <View
        pointerEvents={readonly ? "none" : undefined}
        className={cn(
          " flex-row items-center px-2.5 max-h-12   rounded-lg border-[0.5px] border-black",
          isFocused && "border border-gray-hover dark:bg-dark-gray-hover",
          showError && "border border-red",
          inputClassName,
        )}
        style={[
          containerStyle,
          {
            backgroundColor: colors.neutral ?? colors.black,
            borderRadius: Radius.large,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.gray_hover,
          },
        ]}
      >
        <InputComponent
          ref={inputRef}
          className="flex-1  rounded-lg text-white font-inter-regular"
          style={[
            {
              fontSize: fontPercentageToDP(3),

              width: "100%",
              color: colors.text,
              height: hp(Platform.OS === "android" ? 5.4 : 5),
            },
            inputProps?.style,
          ]}
          keyboardType={keyboardType}
          placeholder={placeholder || "Enter " + _.lowerCase(label)}
          placeholderTextColor={colors.place_holder}
          value={
            inputType === "phone"
              ? formatPhoneNumber(value || "") || ""
              : inputProps?.inputMode === "numeric" ||
                  inputProps?.keyboardType === "numeric" ||
                  inputType === "numeric" ||
                  keyboardType === "numeric"
                ? formatNumbers(value)
                : value
          }
          onChangeText={(_value: any) => {
            if (
              inputType === "phone" ||
              inputProps?.inputMode === "numeric" ||
              inputProps?.keyboardType === "numeric" ||
              keyboardType === "numeric"
            ) {
              onChangeText(parseDigits(_value));
            } else {
              onChangeText(_value);
            }
          }}
          autoCorrect={false}
          autoCapitalize="none"
          allowFontScaling={false}
          clearButtonMode="never"
          selectionColor={colors.tint}
          secureTextEntry={isSecuredEntry}
          {...omit(inputProps, ["style", "isSecuredEntry"])}
          autoFocus={autoFocus}
          onBlur={(e: any) => {
            setIsFocused(false);
            inputProps?.onBlur && inputProps?.onBlur(e);
          }}
          onFocus={(e: any) => {
            setIsFocused(true);
            inputProps?.onFocus && inputProps?.onFocus(e);
            onFocus && onFocus();
          }}
        />
        {isProtected && (
          <TouchableOpacity
            className="w-[15%] h-full -mr-3 bg-red- items-center justify-center"
            onPress={() => {
              setSecuredEntry(!isSecuredEntry);
            }}
          >
            {!isSecuredEntry ? (
              <EyeIcon width={wp(5)} height={wp(5)} color={colors.text} />
            ) : (
              <EyeClosedIcon width={wp(5)} height={wp(5)} color={colors.text} />
            )}
          </TouchableOpacity>
        )}
        {rightAction}
      </View>
      {showError ? (
        <ResponsiveUi.Text
          small
          danger
          light
          tailwind="mt-2"
          {...errorViewProps}
        >
          {customErrorMsg ||
            "Please enter a valid " + _.lowerCase(_.startCase(label))}
        </ResponsiveUi.Text>
      ) : null}
    </View>
  );
};
