import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, OAuthProvider } from 'firebase/auth';

const Login = () => {
  const handleLogin = async () => {
    const provider = new OAuthProvider('linkedin.com');
    try {
      await signInWithPopup(auth, provider);
      // On successful login, the onAuthStateChanged listener in App.js will handle the redirect.
    } catch (error) {
      console.error("Error during LinkedIn sign-in:", error);
      alert("Failed to login with LinkedIn.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold text-center">GenResAI</h1>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Login with LinkedIn
        </button>
      </div>
    </div>
  );
};

export default Login;
