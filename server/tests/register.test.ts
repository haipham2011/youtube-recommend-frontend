// tslint:disable-next-line: no-implicit-dependencies
import { request } from "graphql-request";
import { TEST_VAR } from "./utils";

describe("Test the registration", () => {
  const { host, email, password } = TEST_VAR;
  const mutation = `
    mutation {
        register(email: "${email}", password: "${password}") {
          id
          email
          errors
          message
        }
    }
`;

  test("Test Register user", async () => {
    const response = await request(host, mutation);
    expect(response.register.email).toEqual(email);
    expect(response.register.errors).toEqual(null);
    expect(response.register.message.length).toBeGreaterThan(0);
    expect(response.register.message[1]).toEqual("Test message Id");
  });

  test("Test register with the existing email", async () => {
    const response2 = await request(host, mutation);
    expect(response2.register.errors.length).toBeGreaterThan(0);
  });

  test("Test register with bad password", async () => {
    const badPass = "badpassword";
    const email = "test@bad.password";
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
