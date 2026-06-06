import { Analysis } from "../components/Analysis";
import { PrivateRoute } from "../router/PrivateRoute";
import { render, screen } from "@testing-library/react";
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

vi.mock("../lib/GetActionsLogTableLib", () => ({
  getActionsLogTableLib: async () => ({
    data: [
      {
        id: 1,
        action_id: 1,
        executed_at: new Date().toISOString(),
        is_done: true,
        actions: {
          content: "A",
        }
      }
    ],
    error: null
  })
}));

vi.mock("../lib/GetActionsTableLib", () => ({
  getActionsTableLib: async () => ({
    data: [
      {
        id: 1,
        learning_id: 1,
        content: "A",
        frequency: "daily",
      },
    ],
    error: null
  })
}));

beforeEach(() => {
  mockData = [
    {
        id: 1,
        content: "A",
    },
  ];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Analysis", () => {
  it("Analysis title",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Analysis />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(await screen.getByRole("heading", { name: "継続分析" })).toBeInTheDocument();
    expect(await screen.getByText("全体分析")).toBeInTheDocument();

  });

  it("Analysis 全体分析",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Analysis />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText("総継続日数: 1日")).toBeInTheDocument();
    expect(await screen.findByText("総行動数: 1")).toBeInTheDocument();
    expect(await screen.findByText("今日の実行率: 100%")).toBeInTheDocument();
  });

  it("Analysis 行動別分析",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Analysis />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(await screen.findByText("行動内容: A")).toBeInTheDocument();
    expect(await screen.findByText("継続日数: 1日")).toBeInTheDocument();
    expect(await screen.findByText("実行率: 100%")).toBeInTheDocument();
    expect(await screen.findByText("実行回数: 1")).toBeInTheDocument();
  });

  it("Navigate to book",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Analysis />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const linkBook = await screen.getByRole("link", { name: "本一覧画面はこちら" });
    await user.click(linkBook);
    expect(linkBook).toHaveAttribute("href", "/book");
  });
}); 