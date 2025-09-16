import { Href, Redirect } from "expo-router";
import React, { FunctionComponent } from "react";

import { useSelector } from "./store/Store";

const Index: FunctionComponent = () => {
  const { user, newInstall } = useSelector(["user", "newInstall"]);

  const initialRoute: Href = newInstall
    ? "/(onboarding)"
    : user
      ? "/(tabs)"
      : "/(auth)/login";
  return <Redirect href={initialRoute} />;
};

export default Index;
