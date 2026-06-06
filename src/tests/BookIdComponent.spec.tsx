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
    },
  ];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("BookId", () => {
  it("BookId title",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <BookId />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(await screen.getByRole("heading", { name: "本詳細" })).toBeInTheDocument();
  });

  it("全項目入力して行動に変換ボタンを押すとダイアログが表示される", async () => {
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
    await waitFor(() => {
      expect(screen.getByTestId("add-title")).toBeInTheDocument();
    });
    
  });

  it("titleを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <BookId />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const inputTitle = await screen.getByLabelText("本のタイトル");
    await user.clear(inputTitle);
    const button = await screen.getByRole("button", { name: "行動に変換" });
    await user.click(button);
    expect(await screen.findByTestId("title")).toHaveTextContent("内容の入力は必須です");
  });

  it("contentを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <BookId />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const contentTitle = await screen.getByLabelText("本のタイトル");
    await user.type(contentTitle, "A");
    const inputContent = await screen.getByLabelText("学んだ内容");
    await user.clear(inputContent);
    const button = await screen.getByRole("button", { name: "行動に変換" });
    await user.click(button);
    expect(await screen.findByTestId("content")).toHaveTextContent("内容の入力は必須です");
  });
});