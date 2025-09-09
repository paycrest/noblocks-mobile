import React, { FunctionComponent, useMemo, useState } from "react";
import { Pressable, View } from "react-native";

import Check from "@/components/Check";
import GradientText from "@/components/GradientText";
import AppLayout from "@/components/layouts/AppLayout";
import { ResponsiveUi } from "@/components/ResponsiveUi";
import TropicalIndigo from "@/components/svgs/tropical-indigo";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { FileText } from "lucide-react-native";

const Kyc: FunctionComponent = () => {
  const [terms, setTerms] = useState([
    {
      id: 1,
      text: "I understand we are committed to protecting your privacy and will not share your personal information without",
      checked: false,
    },
    {
      id: 2,
      text: "I agree to comply with all KYC requirements to verify my identity",
      checked: false,
    },
    {
      id: 3,
      text: "I consent to the processing of my data for identity verification purposes",
      checked: false,
    },
  ]);

  const toggleCheck = (id: number) => {
    setTerms((prev) =>
      prev.map((term) =>
        term.id === id ? { ...term, checked: !term.checked } : term
      )
    );
  };

  const allChecked = useMemo(() => {
    return terms.every((t) => t.checked);
  }, [terms]);

  return (
    <AppLayout>
      <View className="flex-1 items-center justify-center">
        <View className="items-center flex-1 justify-center">
          <View>
            <View className="bg-gray border-gray-hover border-[0.6px] dark:border-0 p-4 rounded-full">
              <TropicalIndigo />
            </View>
          </View>
          <View className="flex-row mt-12">
            <ResponsiveUi.Text semiBold>
              Verify your identity in{" "}
            </ResponsiveUi.Text>
            <GradientText style={{ marginTop: 2, fontWeight: "600" }}>
              2 Minutes
            </GradientText>
          </View>
          <View className="mt-10">
            <ResponsiveUi.Text medium>
              Accept terms to get started
            </ResponsiveUi.Text>
          </View>
          <View className="mt-8 mx-8">
            {terms.map((item) => (
              <Pressable
                onPress={() => toggleCheck(item.id)}
                className="mb-8 flex-row"
                key={item.id}
              >
                <Check checked={item.checked} />
                <ResponsiveUi.Text small tailwind="ml-4" secondary>
                  {item.text}
                </ResponsiveUi.Text>
              </Pressable>
            ))}
          </View>
          <View className="flex-row mt-4 justify-start mr-4 items-center">
            <FileText color={Colors.slate} />
            <ResponsiveUi.Text
              style={{
                color: Colors.slate,
                marginLeft: 10,
              }}
            >
              Read full Terms and Conditions
            </ResponsiveUi.Text>
          </View>
        </View>
        <View className="flex-1  justify-end mt-3 w-full">
          <ResponsiveUi.Button
            btnClassName="mt-4"
            title="Get started"
            action={() => router.replace("/(tabs)")}
            disabled={!allChecked}
          />
        </View>
      </View>
    </AppLayout>
  );
};

export default Kyc;
