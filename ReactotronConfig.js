import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "noblocks",
  host: "192.168.1.2",
}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!
