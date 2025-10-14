module.exports = function (api) {
  api.cache(true);
  return {
   presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: ["nativewind/babel"],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  };
};
