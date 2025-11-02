import React from "react";
import "./login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your Email here"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your Password here"
              className="form-input"
            />
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
