import { equal } from "node:assert/strict";
import { describe, it } from "node:test";

import { sum } from "./add.ts";

describe("Dummy test suite", () => {
  it("Dummy test case", () => {
    equal(sum(40, 2), 42);
  });
});
