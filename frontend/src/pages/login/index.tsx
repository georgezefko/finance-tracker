import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, Paper, Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../../context/AuthContext'; // We will create this next

const LoginPage: React.FC = () => {
    const theme = useTheme();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = useContext(AuthContext);

    if (!auth) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { login } = auth;

    const switchModeHandler = () => {
        setIsLogin((prevMode) => !prevMode);
        setError('');
    };

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        if (email.trim().length === 0 || password.trim().length === 0) {
            setError('Please enter both email and password.');
            return;
        }

        const endpoint = isLogin ? 'login' : 'signup';
        const url = `http://localhost:8000/auth/${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            if (isLogin) {
                login(data.token, data.userId); // This will come from our AuthContext
            } else {
                // Automatically switch to login mode after successful signup
                setIsLogin(true);
                setError('Signup successful! Please log in.');
            }

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'calc(100vh - 100px)', // Adjust height as needed
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    maxWidth: 400,
                    width: '100%',
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    {isLogin ? 'Login' : 'Sign Up'}
                </Typography>
                <form onSubmit={submitHandler}>
                    <TextField
                        type="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        type="password"
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, p: 1.5 }}
                    >
                        {isLogin ? 'Login' : 'Create Account'}
                    </Button>
                    <Button
                        variant="text"
                        onClick={switchModeHandler}
                        fullWidth
                        sx={{ mt: 1 }}
                    >
                        Switch to {isLogin ? 'Sign Up' : 'Login'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginPage; 