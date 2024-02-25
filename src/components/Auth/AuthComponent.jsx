import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function AuthComponent() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await axios.post('http://127.0.0.1:8000/auth/jwt/login', `username=${username}&password=${password}`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        Cookies.set('token', response.data.access_token, { path: '/' });
        setIsLoggedIn(true);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await axios.post('http://127.0.0.1:8000/auth/register', {
            email: email,
            password: password,
            username: username
        });

        console.log(response.data);
    };

    const handleLogout = async () => {
        const response = await axios.post('http://127.0.0.1:8000/auth/jwt/logout');

        console.log(response.data);
        Cookies.remove('token', { path: '/' });
        setIsLoggedIn(false);
    };

    return (
        <div>
            {!isLoggedIn ? (
                <div>
                    <form onSubmit={handleLogin}>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                        <button type="submit">Login</button>
                    </form>
                    <form onSubmit={handleRegister}>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
                        <button type="submit">Register</button>
                    </form>
                </div>
            ) : (
                <button onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
}

export default AuthComponent;
