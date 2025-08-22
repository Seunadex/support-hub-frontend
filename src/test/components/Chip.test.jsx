import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock humanize function
vi.mock("@/utils/function", () => ({
  humanize: (s) => `H:${s}`,
}));

import { NumberChip, StatusChip, PriorityChip } from "@/components/Chip";

describe("NumberChip", () => {
  it("applies neutral style and label as-is", () => {
    render(<NumberChip label="42" />);
    const el = screen.getByLabelText("42");
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent("42");
    expect(el.className).toMatch(/bg-gray-200/);
    expect(el.className).toMatch(/text-gray-800/);
  });
});

describe("StatusChip", () => {
  it("uses mapped color and humanized text", () => {
    render(<StatusChip label="open" />);
    const el = screen.getByLabelText("H:open");
    expect(el).toHaveTextContent("H:open");
    expect(el.className).toMatch(/bg-green-500/);
    expect(el.className).toMatch(/text-white/);
  });
});

describe("PriorityChip", () => {
  it("uses mapped color and humanized text", () => {
    render(<PriorityChip label="high" />);
    const el = screen.getByLabelText("H:high");
    expect(el).toHaveTextContent("H:high");
    expect(el.className).toMatch(/bg-orange-500/);
    expect(el.className).toMatch(/text-white/);
  });
});
