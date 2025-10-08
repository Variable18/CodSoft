// src/components/AuthButton.jsx
import { useAuth0 } from '@auth0/auth0-react';

const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
      )}
    </>
  );
};

export default AuthButton;
