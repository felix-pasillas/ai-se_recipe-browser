import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import App from "../../src/components/App/App";

describe("Lesson 04 — loading state behavior", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows a loading indicator before recipes are fetched", () => {
    vi.useFakeTimers();
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("hides the loading indicator after the fetch resolves", async () => {
    vi.useFakeTimers();
    render(<App />);
    await vi.runAllTimersAsync();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});
