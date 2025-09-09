import React, { FunctionComponent } from "react";

import { Redirect } from "expo-router";

const Index: FunctionComponent = () => {
  return <Redirect href={"/(onboarding)"} />;
};

export default Index;
