import assert from "node:assert";
import test from "node:test";

import { sum } from "./add";

test("should add two numbers", () => {
  assert.strictEqual(sum(40, 2), 42);
});
