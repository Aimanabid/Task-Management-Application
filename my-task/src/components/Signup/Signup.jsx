import React, { useState } from 'react';
import './Signup.css'; // Ensure you create this CSS file
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Signup = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        if (username === '' || email === '' || password === '') {
            toast.info('Fill all the entries to proceed');
            return;
          }
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailPattern.test(email)) {
            toast.info("Email must contain letters, an '@' symbol, and a valid domain (e.g., '.com').");
            return;
          }
          if (password.length < 8) {
            toast.info('Password must be at least 8 characters long.');
            return;
        }
        try {
            let result = await axios.post('http://localhost:5000/register', {
                username : username,
                email : email,
                password : password,
            });

            console.log(result.data);
            toast.success('Signup successful!'); 
            navigate('/')// Notify user of success
        } catch (error) {
            console.error('Error during signup:', error);
            if (error.response && error.response.status === 400) {
                toast.info(error.response.data.message); // Show specific error message for duplicate email
            } else {
                toast.error('Signup failed. Please try again.'); // Generic error message
            }
        }
    };
    return (
        <>
        <ToastContainer/>
        <div className="container">
            <div className="d-flex justify-content-center align-items-center flex-column vw-100">
           
        <div className="main">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup">
                <form>
                    <label htmlFor="chk" aria-hidden="true" className='label'>Sign up</label>
                    <input
                        type="text"
                        className='p-3 input'
                        name="username"
                        placeholder="User name"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Update state on change
                    />
                    <input
                        type="email"
                        className='p-3 input'
                        name="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update state on change
                    />
                    <input
                        type="password"
                        className='p-3 input'
                        name="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update state on change
                    />
                    <button type="submit" className='button1' onClick={handleSignup}>Sign up</button>
                    <p className='text-center paragraph'>
                        Already have an account? <Link to='/' className="signin-link">Sign In from Here</Link>
                    </p>
                </form>
            </div>
        </div>
        </div>
            </div>
        
        </>
    );
};

export default Signup;
