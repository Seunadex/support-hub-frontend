import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, beforeAll, afterEach, describe, it, expect } from "vitest";
import Form from "@/components/Form";

// Mock snackbar once, reuse across tests
const enqueueSnackbarMock = vi.fn();
vi.mock("notistack", () => ({
  useSnackbar: () => ({ enqueueSnackbar: enqueueSnackbarMock }),
}));

beforeAll(() => {
  // jsdom polyfills for file previews
  global.URL.createObjectURL = vi.fn(() => "blob:mock");
  global.URL.revokeObjectURL = vi.fn();
});

afterEach(() => {
  enqueueSnackbarMock.mockClear()
})

const makeFile = (name, size, type) => {
  const blob = new Blob(["x".repeat(size)], { type });
  return new File([blob], name, { type, lastModified: 1 });
};

const fillRequired = async () => {
  const user = userEvent.setup();
  await user.selectOptions(screen.getByLabelText("Category"), "billing");
  await user.selectOptions(screen.getByLabelText("Priority"), "high");
  await user.type(screen.getByLabelText("Title"), "Printer down");
  await user.type(
    screen.getByLabelText("Description"),
    "Paper jam on level three"
  );
};

describe("Form", () => {
  it("disables submit until required fields are filled", async () => {
    render(<Form createTicket={vi.fn()} loading={false} />);
    const submit = screen.getByRole("button", { name: "Submit" });
    expect(submit).toBeDisabled();

    await fillRequired();
    expect(submit).not.toBeDisabled();
  });

  it("adds files with picker, remove single, clear all", async () => {
    render(<Form createTicket={vi.fn()} loading={false} />);
    const user = userEvent.setup();

    await fillRequired();

    const selectBtn = screen.getByRole("button", { name: /select files/i });
    await user.click(selectBtn);
    const input = screen
      .getByLabelText("File drop area")
      .querySelector('input[type="file"]');

    const f1 = makeFile("a.png", 1024, "image/png");
    const f2 = makeFile("b.pdf", 2048, "application/pdf");
    await user.upload(input, [f1, f2]);

    expect(screen.getByText("a.png")).toBeInTheDocument();
    expect(screen.getByText("b.pdf")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Remove a.png"));
    expect(screen.queryByText("a.png")).toBeNull();

    await user.click(screen.getByText("Remove all"));
    expect(screen.getByText("No files selected")).toBeInTheDocument();
  });

  it("validates duplicate", async () => {
    enqueueSnackbarMock.mockClear();
    render(<Form createTicket={vi.fn()} loading={false} />);
    const user = userEvent.setup();

    await fillRequired();
    const input = screen
      .getByLabelText("File drop area")
      .querySelector('input[type="file"]');

    const ok = makeFile("ok.png", 1024, "image/png");
    const dup = makeFile("ok.png", 1024, "image/png");
    const badType = makeFile("bad.txt", 512, "text/plain");
    const tooBig = makeFile("big.png", 10 * 1024 * 1024 + 1, "image/png");

    await user.upload(input, [ok]);
    await user.upload(input, [dup]);
    expect(enqueueSnackbarMock).toHaveBeenNthCalledWith(1, "ok.png already added", {
      variant: "warning",
    });
  });

  it("supports drag and drop add", async () => {
    render(<Form createTicket={vi.fn()} loading={false} />);
    await fillRequired();

    const drop = screen.getByLabelText("File drop area");
    const f = makeFile("drag.png", 1000, "image/png");

    const data = { dataTransfer: { files: [f] } };
    fireEvent.dragOver(drop, data);
    fireEvent.drop(drop, data);

    expect(screen.getByText("drag.png")).toBeInTheDocument();
  });

  it("submits with payload and resets", async () => {
    const createTicket = vi.fn().mockResolvedValueOnce({});
    render(<Form createTicket={createTicket} loading={false} />);
    const user = userEvent.setup();

    await fillRequired();

    const input = screen
      .getByLabelText("File drop area")
      .querySelector('input[type="file"]');
    const f1 = makeFile("a.png", 1024, "image/png");
    await user.upload(input, [f1]);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(createTicket).toHaveBeenCalledTimes(1);
    const args = createTicket.mock.calls[0][0];
    expect(args).toMatchObject({
      category: "billing",
      priority: "high",
      title: "Printer down",
      description: "Paper jam on level three",
    });
    expect(Array.isArray(args.attachments)).toBe(true);
    expect(args.attachments[0].name).toBe("a.png");

    expect(screen.getByLabelText("Category")).toHaveValue("");
    expect(screen.getByLabelText("Priority")).toHaveValue("");
    expect(screen.getByLabelText("Title")).toHaveValue("");
    expect(screen.getByLabelText("Description")).toHaveValue("");
    expect(screen.getByText("No files selected")).toBeInTheDocument();
  });
});
