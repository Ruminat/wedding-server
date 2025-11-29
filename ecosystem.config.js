module.exports = {
  apps: [
    {
      name: "wedding-server",
      script: "./dist/wedding.js",
      instances: 1,
      watch: false,
    },
  ],
};
