import test from "node:test";
import assert from "node:assert/strict";
import { createAuthToken, verifyPassword, hashPassword } from "./auth";

test("hash and verify password works", async () => {
  const hashed = await hashPassword("super-secret");
  assert.notEqual(hashed, "super-secret");
  const verified = await verifyPassword("super-secret", hashed);
  assert.equal(verified, true);
});

test("createAuthToken returns unsigned payload", () => {
  const token = createAuthToken(
    {
      id: "123",
      email: "recruiter@example.com",
      name: "Recruiter",
      role: "recruiter",
    },
    "1h",
  );
  assert.match(token, /^eyJ/);
});
