"use client";

import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return "/";
  },
}));

global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});
