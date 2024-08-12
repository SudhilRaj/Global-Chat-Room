import { useState } from "react";
import { supabase } from "../lib/supabase-client";
import { FcGoogle } from "react-icons/fc";
import logo from "/logo.png";
import styled from "styled-components";
// import { Auth } from "@supabase/auth-ui-react";
// import { SupabaseClient } from "@supabase/supabase-js";
// import { ThemeSupa } from "@supabase/auth-ui-shared";

export const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;

      // Handle successful sign-in
      console.log("User signed in!");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginContainer>
        <LogoImage src={logo} alt="chat-logo" />
        <LoginHeader>Welcome to the global chat room!</LoginHeader>
        <LoginDescription>
          Made with <span style={{ color: "red" }}>&#x2764;</span> by{" "}
          <PortfolioLink
            href="https://sudhilraj-portfolio.netlify.app/"
            target="_blank"
          >
            Sudhil
          </PortfolioLink>
        </LoginDescription>
        <AuthContainer>
          <button
            onClick={handleGoogleSignIn}
            className="bg-cyan-800 rounded-xl px-6 py-4"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <span className="flex items-center">
                <FcGoogle className="me-2 text-xl" /> Sign in with Google
              </span>
            )}
          </button>
          {/* Currently not using the Auth UI. Only using the separate google authentication. */}
          {/* <Auth
            supabaseClient={supabase as SupabaseClient}
            providers={["google"]}
            // providers={["github", "google"]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#6b0fff",
                    brandAccent: "#7c2bff",
                  },
                  space: {
                    buttonPadding: "12px",
                    inputPadding: "12px",
                  },
                  radii: {
                    borderRadiusButton: "12px",
                    buttonBorderRadius: "12px",
                    inputBorderRadius: "12px",
                  },
                },
              },
            }}
            theme="dark"
            magicLink
            view="sign_in"
            showLinks={false}
          /> */}
        </AuthContainer>
      </LoginContainer>
    </>
  );
};

const LogoImage = styled.img`
  width: 128px;
`;

const LoginHeader = styled.h2`
  font-size: 28px;
  margin: 8px;
  text-align: center;
`;

const LoginDescription = styled.p`
  margin: 4px;
  font-size: 16px;
  line-height: 1.6em;
  text-align: center;
`;

const PortfolioLink = styled.a`
  font-weight: 500;
  color: #033551;
  text-decoration: inherit;
  &:hover {
    color: #535bf2;
  }
`;

const LoginContainer = styled.div`
  margin-top: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const AuthContainer = styled.div`
  width: 90%;
  max-width: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
`;

// const GoogleLoginButton = styled.button`
//   background: #155e75;
//   border-radius: 0.75rem;
//   padding: 1rem 1.5rem;
// `;
