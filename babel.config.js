module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "transform-import-meta",
      [
        "transform-define",
        {
          "import.meta.env.MODE": "process.env.NODE_ENV",
          "import.meta.env": "process.env",
        },
      ],
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./src",
          },
        },
      ],
    ],
  };
};
