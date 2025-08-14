import React from 'react';

const Login = () => {
  const handleLogin = async () => {
    // In a real app, you would get the redirectTo from the current URL
    const redirectTo = window.location.origin + '/';
    const response = await fetch('http://localhost:5000/api/auth/linkedin/initiate?redirectTo=' + encodeURIComponent(redirectTo));
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
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
