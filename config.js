module.exports = {
  prod: {
    env: JSON.stringify({
      NODE_ENV: "production",
      SERVICE_URL: "",
    }),
  },
  local: {
    env: JSON.stringify({
      NODE_ENV: "local",
      SERVICE_URL: "",
    }),
  },
  dev: {
    env: JSON.stringify({
      NODE_ENV: "development",
      SERVICE_URL: "",
    }),
  },
  test: {
    env: JSON.stringify({
      NODE_ENV: "test",
      SERVICE_URL: "",
    }),
  }
};