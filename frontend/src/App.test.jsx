import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App.jsx";

beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [], total: 0 }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ total_articles: 0, total_views: 0, categories: [] }) });
});

describe("Performance Optimization interface", () => {
  it("shows a friendly empty state", async () => {
    render(<App />);
    expect(await screen.findByText("No data found")).toBeInTheDocument();
  });

  it("provides accessible labels and keyboard-operable controls", async () => {
    render(<App />);
    expect(screen.getByRole("textbox", { name: "Search articles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh dashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish article" })).toBeInTheDocument();
  });

  it("highlights missing required inputs and prevents submission", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Publish article" }));
    expect(await screen.findByText(/at least 3 characters/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Article title")).toHaveAttribute("aria-invalid", "true");
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
