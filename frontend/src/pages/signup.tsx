import React, { useState } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { IncomingMessage } from "http";

interface MyIncomingMessage extends IncomingMessage {
  body: any;
}

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Make POST request to your API's /signup endpoint
    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, inviteCode }),
      });

      if (response.status === 200) {
        // Redirect or handle successful signup
        // For now, let's just reset the form
        setUsername("");
        setPassword("");
        setInviteCode("");
        setErrorMessage("Signup successful!");
      } else {
        const data = await response.json();
        setErrorMessage(data.message || "An error occurred");
      }
    } catch (error) {
      setErrorMessage("An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl mb-4">Sign Up</h1>
        <form method="post" onSubmit={handleSignup}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-1 p-2 w-full border rounded-md text-gray-600"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 p-2 w-full border rounded-md text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="inviteCode"
              className="block text-sm font-medium text-gray-600"
            >
              Invite Code
            </label>
            <input
              id="inviteCode"
              name="inviteCode"
              type="text"
              required
              className="mt-1 p-2 w-full border rounded-md text-gray-600"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md"
            >
              Sign Up
            </button>
            {errorMessage && (
              <span className="text-red-500 text-sm">{errorMessage}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const myReq = req as unknown as MyIncomingMessage;
  if (myReq.method === "POST") {
    const { username, password, inviteCode } = myReq.body;

    // Validate and handle the form submission
    // This logic should mirror what's in your API's /signup route
    // Here, we'll just pretend it's successful and redirect

    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
};

export default Signup;
