import { Book } from "../components/Book";
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


vi.mock("../lib/GetBookTableLib", () => ({
  getBookTableLib: async () => ({
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

vi.mock("../lib/DeleteBookTableLib", () => ({
  deleteBookTableLib: async () => ({
    data: null,
    error: null
  })
}));


beforeEach(() => {
  mockData = [
    {
      id: 1,
      title: "A",
    },
  ];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Book", () => {
  it("Book title",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Book />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(await screen.getByRole("heading", { name: "本一覧" })).toBeInTheDocument();
  });

  it("ChangeButton Click",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Book />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const changebox = await screen.findByRole("button", { name: "変更" });
    await user.click(changebox);
    expect(mockedNavigator).toHaveBeenCalledWith(`/book/${mockData[0].id}`);
  });

  it("DeleteButton Click",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <PrivateRoute>
          <Book />
        </PrivateRoute>
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const deletebox = await screen.findByRole("button", { name: "削除" });
    await user.click(deletebox);
    expect(screen.queryByText("A")).not.toBeInTheDocument();
  });
});