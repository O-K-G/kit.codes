/** @jest-environment node */
import { createRateLimiter } from "@utils/rateLimit";

describe("createRateLimiter", () => {
  it("allows `limit` hits per key per window, then turns them down until it resets", () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => time });

    expect(limiter.hit("a")).toBe(true);
    expect(limiter.hit("a")).toBe(true);
    expect(limiter.hit("a")).toBe(false);
    expect(limiter.hit("b")).toBe(true);

    time = 999;
    expect(limiter.hit("a")).toBe(false);

    time = 1000;
    expect(limiter.hit("a")).toBe(true);
  });

  it("sweeps out expired keys once there are many", () => {
    let time = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 10, now: () => time });

    for (let i = 0; i < 1000; i += 1) limiter.hit(`ip-${i}`);
    time = 10;

    // Still counts correctly after a sweep
    expect(limiter.hit("new")).toBe(true);
    expect(limiter.hit("new")).toBe(false);
    expect(limiter.hit("ip-0")).toBe(true);
  });
});
