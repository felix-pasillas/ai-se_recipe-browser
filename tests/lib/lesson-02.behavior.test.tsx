import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import App from "../../src/components/App/App";

describe("Lesson 02 — favorite toggle behavior", () => {
  it("renders a favorite button for each recipe card", async () => {
    render(<App />);
    const buttons = await screen.findAllByRole("button", { name: /favorites/i });
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("clicking a favorite button adds the recipe to favorites", async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButton = (await screen.findAllByRole("button", {
      name: /add to favorites/i,
    }))[0];
    await user.click(addButton);

    expect(
      screen.getByRole("button", { name: /remove from favorites/i })
    ).toBeInTheDocument();
  });

  it("clicking a favorited recipe removes it from favorites", async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButton = (await screen.findAllByRole("button", {
      name: /add to favorites/i,
    }))[0];
    await user.click(addButton);

    const removeButton = screen.getByRole("button", {
      name: /remove from favorites/i,
    });
    await user.click(removeButton);

    expect(
      screen.queryByRole("button", { name: /remove from favorites/i })
    ).not.toBeInTheDocument();
  });

  it("toggling one recipe does not affect other recipes", async () => {
    const user = userEvent.setup();
    render(<App />);

    const addButtons = await screen.findAllByRole("button", {
      name: /add to favorites/i,
    });
    expect(addButtons.length).toBeGreaterThanOrEqual(2);

    await user.click(addButtons[0]);

    const remaining = screen.getAllByRole("button", {
      name: /add to favorites/i,
    });
    expect(remaining.length).toBe(addButtons.length - 1);
  });
});
