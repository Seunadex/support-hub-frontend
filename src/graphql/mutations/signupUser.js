import { gql, useMutation } from "@apollo/client";

const SIGN_UP = gql`
  mutation Signup($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    signup(input: { email: $email, password: $password, firstName: $firstName, lastName: $lastName }) {
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

export const useSignupMutation = (params, callbackAction) => {
  const [signup, { loading, error }] = useMutation(SIGN_UP, {
    variables: params,
    context: {
      headers: {
        "x-operation-name": "Signup",
      },
    },
    onCompleted: (data) => {
      callbackAction(data);
    },
  });

  return {
    signup,
    loading,
    error,
  };
};
