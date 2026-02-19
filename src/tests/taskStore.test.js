import { useTaskStore } from "../store/taskStore";
import * as api from "../services/mockApi";

vi.mock("../services/mockApi");

test("optimistic add rolls back on failure", async () => {
  api.addTaskApi.mockRejectedValueOnce(new Error("Fail"));

  const store = useTaskStore.getState();

  await expect(
    store.addTask("todo", "Test", "Fail case")
  ).rejects.toThrow();

  expect(useTaskStore.getState().tasks).toHaveLength(2);
});
