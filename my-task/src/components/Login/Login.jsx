import React, { useState } from 'react';
import '../Signup/Signup.css'; // Ensure you create this CSS file
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === '' || email === '' || password === '') {
      toast.info('Fill all the entries to proceed');
      return;
    }

    try {
      let result = await axios.post('http://localhost:5000/login', {
        email: email,
        password: password,
    });
      if (result.status === 200) {
        toast.success('Logged In Successfully');

        setTimeout(() => {
          navigate('/dashboard'); 
        }, 2000);
      }
    } catch (error) {
      // Handle error responses
      if (error.response) {
        // If the server responded with a status code outside the 2xx range
        if (error.response.status === 401) {
          toast.error('Invalid credentials. Please try again.'); // Unauthorized
        } else if (error.response.status === 400) {
          toast.error('Please provide both email and password.'); // Bad Request
        } else {
          toast.error('An error occurred: ' + error.response.data.result); // Other errors
        }
      } else {
        // If the request was made but no response was received
        toast.error('Error logging in. Please try again.');
      }
    }
  };

  return (
    <>
    
      <ToastContainer />
      <div className="container">
        <div className="d-flex align-items-center justify-content-center flex-column vw-100">
        <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true" />

        <div className="signup">
          <form onSubmit={handleSubmit}>
            <label htmlFor="chk" className='label' aria-hidden="true">Login</label>
            <input
              type="text"
              className="p-3 input"
              name="username"
              value={username}
              placeholder="User name"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="p-3 input"
              name="email"
              value={email}
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="p-3 input"
              name="password"
              value={password}
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="button1">Login</button>
            <p className="text-center paragraph">
              New to our website? <Link to='/signup' className="signin-link">Create an account Here</Link>
            </p>
          </form>
        </div>
      </div>
        </div>
      </div>
      
    </>
  );
};

export default Login;
