import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

test("optimistic add then rollback", async () => {
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText(/new task title/i), {
    target: { value: "Temp Task" },
  });

  fireEvent.click(screen.getByText(/add task/i));

  expect(screen.getByText("Temp Task")).toBeInTheDocument();
});
