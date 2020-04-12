import { startServer } from "../src/server";
// tslint:disable-next-line: no-implicit-dependencies
import { request } from "graphql-request";
import { TEST_VAR } from "./utils";

describe("Test the registration", () => {
  const { host, email, password } = TEST_VAR;
  const mutation = `
    mutation {
        register(email: "${email}", password: "${password}") {
          email
          errors
        }
    }
`;

  beforeAll(async () => {
    await startServer();
  });

  test("Test Register user", async () => {
    const response = await request(host, mutation);
    expect(response.register.email).toEqual(email);
    expect(response.register.errors).toEqual(null);
  });

  test("Test register with the existing email", async () => {
    const response1 = await request(host, mutation);
    expect(response1.register.email).toEqual(email);

    const response2 = await request(host, mutation);
    expect(response2.register.errors.length).toBeGreaterThan(0);
  });

  test("Test register with bad password", async () => {
    const badPass = "badpassword";
    const baddMutation = `
  mutation {
    register(email: "${email}", password: "${badPass}") {
      email
      errors
    }
}
  `;
    const response = await request(host, baddMutation);
    expect(response.register.errors.length).toBeGreaterThan(0);
    expect(response.register.errors[0]).toContain("Password must be");
  });
});
