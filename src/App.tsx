import { ChakraProvider, defaultSystem } from "@chakra-ui/react"

import { Router } from "./router/Router";

export default function App() {
  return (
    <>
      <ChakraProvider value={defaultSystem}>
        <Router />
      </ChakraProvider>
    </>
  );
}