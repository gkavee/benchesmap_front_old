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
            },
            credentials: 'same-origin',
        });
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            credentials: 'include',
            redirect: 'manual',
        }

            fetch("http://127.0.0.1:8000/auth/jwt/login", requestOptions)
                .then((response) => {
                    if (response.ok) {
                        
                        // console.log('Cookie: '+response.headers.get('set-cookie'))
                        // Cookies.set('token', response.headers.get('set-cookie'), { path: '/' });
                        setIsLoggedIn(true);
                    } else {
                        alert('There was a problem');
                    }
                })
                .catch(error => console.log('error', error))

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

    // const handleLogout = async () => {
    //     const response = await axios.post('http://127.0.0.1:8000/auth/jwt/logout');

    //     console.log(response.data);
    //     // Cookies.remove('token', { path: '/' });
    //     setIsLoggedIn(false);
    // };

    const handleLogout = async () => {
        const url = 'http://127.0.0.1:8000/auth/jwt/logout';
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            redirect: 'manual',
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          setIsLoggedIn(false);
        } catch (error) {
          console.error(error);
        }
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
