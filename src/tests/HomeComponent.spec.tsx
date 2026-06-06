import { Home } from "../components/Home";
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

vi.mock("../lib/InsertActionsLogTableLib", () => ({
  insertActionsLogTableLib: vi.fn(),
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

vi.mock("../lib/GetBookUserTableLib", () => ({
  getBookUserTableLib: async () => ({
    data: [
      {
        user_id: "testA",
        firebase_id: "testA",
        email: "test@test.com",
        name: "テストユーザーA",
      }
    ],
    error: null
  })
}));


beforeEach(() => {
  mockData = [
    {
      user_id: "testA",
      firebase_id: "testA",
      email: "test@test.com",
      name: "テストユーザーA",
    },
  ];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Home", () => {
  it("Home title",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(await screen.getByRole("heading", { name: "ホーム" })).toBeInTheDocument();
    expect(await screen.findByText(`Welcome,${mockData[0].name}`)).toBeInTheDocument();
    expect(await screen.getByText("本日のTODOリスト")).toBeInTheDocument();
  });

  it("Home checkbox",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    await screen.findByText("行動内容: A");
    await screen.debug();
    const checkbox = await screen.getByRole("checkbox");
    await user.click(checkbox);
  });

  it("Logout",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const logoutButton = await screen.getByRole("button", { name: "Logout" });
    await user.click(logoutButton);
    expect(mockedNavigator).toHaveBeenCalledWith("/login");
  });

  it("Navigate to Book List",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const linkBookList = await screen.getByRole("link", { name: "本一覧画面はこちら" });
    await user.click(linkBookList);
    expect(linkBookList).toHaveAttribute("href", "/book");
  });

  it("Navigate to Analysis List",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const linkAnalysis = await screen.getByRole("link", { name: "継続分析画面はこちら" });
    await user.click(linkAnalysis);
    expect(linkAnalysis).toHaveAttribute("href", "/analysis");
  });
}); 