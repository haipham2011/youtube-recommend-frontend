export const TEST_VAR = {
  email: "test@jest.com",
  password: "Testpassword1",
  host: process.env.DOCKER_SETTINGS
    ? "http://localhost:4001"
    : "http://localhost:4003",
};
