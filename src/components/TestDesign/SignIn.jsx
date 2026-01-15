// SignIn.jsx
import React from 'react';
import "./SignIn.css"

function SignIn() {
  return (

    // 1
    <>
      <div class="grid-wrapper">
        <div class="grid-background"></div>
        {form()}
      </div>
    </>

    // 2
    // <>
    //   <div class="dark-circuit-wrapper">
    //     <div class="dark-circuit-background"></div>
    //     {form()}
    //   </div>
    // </>

    // 3
    // <>
    //   <div class="circuit-wrapper">
    //     <div class="circuit-background"></div>
    //     {form()}
    //   </div>
    // </>
   
  );
}

export default SignIn;

function form() {

  return (

    <div className=" min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 md:p-10 z-[9999]">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">YourApp</h1>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Sign in to YourApp
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Use your account to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email / Mobile Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email or Mobile Number
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              placeholder="name@example.com"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg 
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-150"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-end">
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                     text-white font-medium rounded-lg
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     transition duration-150 shadow-sm"
          >
            Sign In
          </button>
        </form>

        {/* Alternative sign in */}
        <div className="mt-6 text-center text-sm text-gray-600">
          or{' '}
          <a
            href="#"
            className="font-medium text-blue-600 hover:text-blue-800 transition"
          >
            Sign in another way
          </a>
        </div>
      </div>
    </div>

  )


}