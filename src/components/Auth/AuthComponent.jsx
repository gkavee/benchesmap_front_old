import config from '../../config.js'
import React, { useState, useEffect } from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CloseIcon from '@material-ui/icons/Close';
import { Button, Dialog, DialogActions, DialogContent, TextField, Tabs, Tab, IconButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    logoutButton: {
      width: '40px',
      position: 'absolute',
      bottom: theme.spacing(7.5),
      left: theme.spacing(2),
      backgroundColor: 'red',
      color: 'white',
      zIndex: 2,
      '&:hover': {
        backgroundColor: 'darkred',
        color: '#ddd',
      },
    },
    loginButton: {
        width: '40px',
        position: 'absolute',
        bottom: theme.spacing(7.5),
        left: theme.spacing(2),
        backgroundColor: 'blue',
        color: 'white',
        zIndex: 2,
        '&:hover': {
          backgroundColor: 'darkblue',
          color: '#ddd',
      },
    },
}));

function AuthComponent() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [registerError, setRegisterError] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const storedValue = localStorage.getItem('loggedIn');
        return storedValue ? JSON.parse(storedValue) : false;
    });

    useEffect(() => {
        localStorage.setItem('loggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${config.apiUrl}/users/me`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    setIsLoggedIn(false);
                } else if (response.ok) {
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkSession();
    }, []); 

    const handleLogin = async (event) => {
        event.preventDefault();

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
        }

        fetch(`${config.authApiUrl}/jwt/login`, requestOptions)
            .then((response) => {
                if (response.ok) {
                    setIsLoggedIn(true);
                    setOpen(false);
                } else {
                    setLoginError(true)
                }
            })
            .catch(error => console.log('error', error))
    };

    const handleRegister = async (e) => {
        e.preventDefault();
    
        const response = await fetch(`${config.authApiUrl}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username
            })
        });
    
        if (response.ok) {
            setIsRegistered(true);
            console.log(await response.json())
        } else {
            setRegisterError(true)
        }
    };

    const handleLogout = async () => {
        const url = `${config.authApiUrl}/jwt/logout`;
      
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
      
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsRegistered(false)
    };

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <div>
            {isLoggedIn ? (
                <Button variant="contained" className={classes.logoutButton} onClick={handleLogout}>
                    <LogoutIcon />
                </Button>
            ) : (
                <Button variant="contained" className={classes.loginButton}  onClick={handleOpen}>
                   <LoginIcon />
                </Button>
            )}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <IconButton onClick={handleClose} style={{ position: 'absolute', right: '10px', top: '10px', zIndex: '2'}}>
                    <CloseIcon />
                </IconButton>
                <Tabs value={activeTab} onChange={handleChange} centered style={{ zIndex: '1', backgroundColor: '#e7e1bcbe' }}>
                    <Tab label="Вход" />
                    <Tab label="Регистрация" />
                </Tabs>
                <DialogContent style={{ minWidth: '150px', minHeight: '180px', backgroundColor: '#e7e1bcbe' }}>
                    {isRegistered ? (
                        <p style={{ textAlign: 'center' }}>Ожидайте подтверждения</p>
                    ) : (
                        activeTab === 0 ? (
                            <form onSubmit={handleLogin}>
                                <TextField
                                    margin="dense"
                                    id="username"
                                    label="Имя"
                                    type="text"
                                    fullWidth
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="password"
                                    label="Пароль"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                {loginError && (
                                    <div style={{ color: 'red' }}>
                                        <p>Ошибка входа</p>
                                    </div>
                                )}
                                <DialogActions>
                                    <Button type="submit" color="primary" style={{ justifyContent: 'flex-end', color: '#664229' }}>
                                        Войти
                                    </Button>
                                </DialogActions>
                            </form>
                        ) : (                        
                            <form onSubmit={handleRegister}>
                                <TextField
                                    margin="dense"
                                    id="email"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="username"
                                    label="Имя"
                                    type="text"
                                    fullWidth
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                />
                                <TextField
                                    margin="dense"
                                    id="password"
                                    label="Пароль"
                                    type="password"
                                    fullWidth
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                {registerError && (
                                    <div style={{ color: 'red' }}>
                                        <p>Ошибка регистрации</p>
                                    </div>
                                )}
                                <DialogActions>
                                    <Button type="submit" color="primary" style={{ justifyContent: 'flex-end', color: '#664229' }}>
                                        Зарегистрироваться
                                    </Button>
                                </DialogActions>
                            </form>
                        )
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AuthComponent;
