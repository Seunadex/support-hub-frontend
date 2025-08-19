import { gql, useMutation } from "@apollo/client";

const SIGN_IN = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      user {
        id
        firstName
        lastName
        fullName
        role
        email
      }
      token
      errors
    }
  }
`;

export const useLoginMutation = (params, callbackAction) => {
  const [login, { loading, error }] = useMutation(SIGN_IN, {
    variables: params,
    context: {
      headers: {
        "x-operation-name": "Login",
      },
    },
    onCompleted: (data) => {
      callbackAction(data);
    },
  });

  return {
    login,
    loading,
    error,
  };
};
