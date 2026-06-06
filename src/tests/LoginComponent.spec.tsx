import { Login } from "../components/Login";
import { Signup  } from "../components/Signup";
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
  const actual = await vi.importActual<typeof import("firebase/auth")>(
    "firebase/auth"
  );
  return {
    ...actual,
    signInWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({
        user: {
          uid: "testA",
        },
      })
    ),
  };
});

beforeEach(() => {
  mockData = [
    {
      user_id: "testA",
      firebase_id: "testA",
      email: "test@example.com",
      name: "テストユーザーA",
    },
  ];
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Login", () => {
  it("Login title", () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <Login />
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Book-Action-App Login" })).toBeInTheDocument();
  });

  it("メールアドレスを入力してボタンを押すと/home に遷移する(useNavigateのパスをみる)", async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <Login />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const emailInput = await screen.getByLabelText("メールアドレス");
    await user.type(emailInput, "test@example.com");
    const passwordInput = await screen.getByLabelText("パスワード");
    await user.type(passwordInput, "123456");
    const button = await screen.getByRole("button", { name: "送信" });
    await user.click(button);
    expect(mockedNavigator).toHaveBeenCalledWith("/home");
  });

  it("メールアドレスを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <Login />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const emailInput = await screen.getByLabelText("メールアドレス");
    await user.clear(emailInput);
    const passwordInput = await screen.getByLabelText("パスワード");
    await user.type(passwordInput, "123456");
    const button = await screen.getByRole("button", { name: "送信" });
    await user.click(button);
    expect(await screen.findByTestId("email-error")).toHaveTextContent("内容の入力は必須です");
  });

  it("パスワードを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <Login />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const emailInput = await screen.getByLabelText("メールアドレス");
    await user.type(emailInput, "test@example.com");
    const passwordInput = await screen.getByLabelText("パスワード");
    await user.clear(passwordInput);
    const button = await screen.getByRole("button", { name: "送信" });
    await user.click(button);
    expect(await screen.findByTestId("password-error")).toHaveTextContent("内容の入力は必須です");
  });

  it("新規登録リンクをクリックすると/signupに遷移する", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <ChakraProvider value={defaultSystem}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const signupLink = await screen.getByRole("link", {name: "新規登録はこちら"});
    await user.click(signupLink);
    expect(screen.getByRole("heading", { name: "新規登録" })).toBeInTheDocument();
  });
});