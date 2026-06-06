import { Signup } from "../components/Signup";
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
    createUserWithEmailAndPassword: vi.fn(() =>
      Promise.resolve({
        user: {
          uid: "testA",
        },
      })
    ),
  };
});

vi.mock("../router/PrivateRoute", () => ({
  PrivateRoute: ({ children }: any) => <>{children}</>,
}));

vi.mock("../lib/InsertBookUsersTableLib", () => ({
  insertBookUsersTableLib: vi.fn().mockResolvedValue({
    status: "success",
  }),
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

describe("Signup", () => {
  it("Signup title",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
          <Signup />
      </ChakraProvider>
      </MemoryRouter>
    );
    expect(await screen.getByRole("heading", { name: "新規登録" })).toBeInTheDocument();
  });

  it("メールアドレスを入力してボタンを押すと/home に遷移する(useNavigateのパスをみる)",async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
          <Signup />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const emailInput = await screen.getByLabelText("メールアドレス");
    await user.type(emailInput, "test@example.com");
    const nameInput = await screen.getByLabelText("名前");
    await user.type(nameInput, "テストユーザーA");
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
        <Signup />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const emailInput = await screen.getByLabelText("メールアドレス");
    await user.clear(emailInput);
    const nameInput = await screen.getByLabelText("名前");
    await user.type(nameInput, "テストユーザーA");
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
        <Signup />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const emailInput = await screen.getByLabelText("メールアドレス");
    await user.type(emailInput, "test@example.com");
    const nameInput = await screen.getByLabelText("名前");
    await user.type(nameInput, "テストユーザーA");
    const passwordInput = await screen.getByLabelText("パスワード");
    await user.clear(passwordInput);
    const button = await screen.getByRole("button", { name: "送信" });
    await user.click(button);
    expect(await screen.findByTestId("password-error")).toHaveTextContent("内容の入力は必須です");
  });

  it("名前を入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
      <ChakraProvider value={defaultSystem}>
        <Signup />
      </ChakraProvider>
      </MemoryRouter>
    );
    const user = userEvent.setup();
    const emailInput = await screen.getByLabelText("メールアドレス");
    await user.type(emailInput, "test@example.com");
    const nameInput = await screen.getByLabelText("名前");
    await user.clear(nameInput);
    const passwordInput = await screen.getByLabelText("パスワード");
    await user.type(passwordInput, "123456");
    const button = await screen.getByRole("button", { name: "送信" });
    await user.click(button);
    expect(await screen.findByTestId("name-error")).toHaveTextContent("内容の入力は必須です");
  });
}); 