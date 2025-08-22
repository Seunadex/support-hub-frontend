import { render } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { AuthContext } from "@/contexts/AuthContext";
import { createMockAuthValue } from "./auth-utils";
import { MemoryRouter } from "react-router";
import { vi } from "vitest";

let __mockedRouterParams = {};
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useParams: () => __mockedRouterParams
  }
})

const createTestClient = () => {
  return new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });
};

const defaultAuthValue = createMockAuthValue();

const AllTheProviders = ({
  children,
  authValue = defaultAuthValue,
  routerProps = {},
}) => {
  const { initialEntries = ["/"], ...otherRouterProps } = routerProps;
  return (
    <MemoryRouter initialEntries={initialEntries} {...otherRouterProps}>
      <ApolloProvider client={createTestClient()}>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </ApolloProvider>
    </MemoryRouter>
  );
};

const customRender = (ui, options = {}) => {
  const { authValue, routerProps, ...renderOptions } = options;

  return render(ui, {
    wrapper: (props) => (
      <AllTheProviders
        {...props}
        authValue={authValue}
        routerProps={routerProps}
      />
    ),
    ...renderOptions,
  });
};

export const mockUseParams = (params) => {
  __mockedRouterParams = params;
};

export * from "@testing-library/react";
export { customRender as render };
``;
