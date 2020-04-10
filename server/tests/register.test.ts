import { startServer } from "../src/server";
// tslint:disable-next-line: no-implicit-dependencies
import { request } from "graphql-request";

const email = "test@jest.com";
const password = "testpassword";

const mutation = `
    mutation {
        register(email: "${email}", password: "${password}")
    }
`;

const host = "http://localhost:4000";

beforeAll(async () => {
  await startServer();
});

test("Test Register user", async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
});
