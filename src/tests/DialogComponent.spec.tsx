import { BookId } from "../components/BookId";
import { PrivateRoute } from "../router/PrivateRoute";
import { render, screen, waitFor } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";

let mockData: any[] = [];
// Navigatorモック準備
const mockedNavigator = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigator,
  };
});

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    Portal: ({ children }: any) => children,
  };
});

vi.mock("firebase/auth", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual
    signInWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({
        user: {
          uid: "testA",
        },
      })
    ),
  };
});

vi.mock("../context/AuthContext", () => ({
  useAuthContext: () => ({
    user: {
      uid: "testA",
      email: "test@test.com",
    },
  }),
}));

vi.mock("../router/PrivateRoute", () => ({
  PrivateRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock("../lib/InsertBookTableLib", () => ({
  insertBookTableLib: vi.fn(),
}));

vi.mock("../lib/InsertLearningsTableLib", () => ({
  insertLearningsTableLib: vi.fn().mockResolvedValue({
    data: {
      id: 1,
    },
  }),
}));

vi.mock("../lib/InsertActionsTableLib", () => ({
  insertActionsTableLib: vi.fn(),
}));


vi.mock("../lib/GetBookTitleTableLib", () => ({
  getBookTitleTableLib: async () => ({
    data: [
      {
        id: 1,
        firebase_uid: "testA",
        title: "A",
      },
    ],
    error: null
  })
}));

vi.mock("../lib/GetLearningsContentTableLib", () => ({
  getLearningsContentTableLib: async () => ({
    data: [
      {
        id: 1,
        book_id: 1,
        content: "contentA",
      },
    ],
    error: null
  })
}));

beforeEach(() => {
  mockData = [
    {
      title: "A",
      content: "contentA",
      actionContent: "contentA",
      learning_Id: 1,
      frequency: "daily",
    },
  ];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Dialog", () => {
  it("Dialog title",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <BookId />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const inputTitle = await screen.getByLabelText("本のタイトル");
    await user.type(inputTitle, "A");
    const inputContent = await screen.getByLabelText("学んだ内容");
    await user.type(inputContent, "contentA");
    const button = await screen.getByRole("button", { name: "行動に変換" });
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText("行動記録")).toBeInTheDocument();
    });
  });

  it("actionContentと頻度が入力でき登録できる", async () => {
    render(
      <MemoryRouter>
        <ChakraProvider value={defaultSystem}>
          <BookId />
        </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const inputTitle = await screen.getByLabelText("本のタイトル");
    await user.type(inputTitle, "A");
    const inputContent = await screen.getByLabelText("学んだ内容");
    await user.type(inputContent, "contentA");
    const button = await screen.getByRole("button", { name: "行動に変換" });
    await user.click(button);
    await waitFor(async () => {
      const contentInput = await screen.getByTestId("content-input");
      await user.type(contentInput, "contentA");
      const frequency = await screen.getByLabelText("頻度:");
      await user.selectOptions(frequency, "daily");
      const insertButton = await screen.getByRole("button", { name: "登録" });
      await user.click(insertButton);
      expect(mockData).toHaveLength(1);
    });
    
  });

  it("actionContentを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <BookId />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const inputTitle = await screen.getByLabelText("本のタイトル");
    await user.type(inputTitle, "A");
    const inputContent = await screen.getByLabelText("学んだ内容");
    await user.type(inputContent, "contentA");
    const button = await screen.getByRole("button", { name: "行動に変換" });
    await user.click(button);
    await waitFor(async () => {
      const contentInput = await screen.getByTestId("content-input");
      await user.clear(contentInput);
      const insertButton = await screen.getByRole("button", { name: "登録" });
      await user.click(insertButton);
      const errorMessage = await screen.findByTestId("actionContent-error");
      expect(errorMessage).toHaveTextContent("内容の入力は必須です");
    });
  });
});