import React, { useState, useEffect } from 'react';
import '../css/Login.css';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useHistory, Link } from 'react-router-dom';
import { IsLoggedIn, logUserIn } from '../api/Firebase';
import { userToken } from '../State';
import { useRecoilState } from 'recoil';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [user, setUser] = useRecoilState(userToken);

    const login = () => {
        logUserIn(username, password, (error) => {
            setError('Error: ' + error.code + ' :: ' + error.message);
        })
    }

    useEffect(() => {
        IsLoggedIn(u => {
            console.log("logged In user: ", u);
            setUser(u);
            history.push("/home");

        }, () => {
            console.log("no logged In user");
            setUser('none');
            history.push("/");
        })
    }, []);

    const updateUsername = e => {
        setUsername(e.target.value);
        setError('');
    }

    const updatePassword = e => {
        setPassword(e.target.value);
        setError('');
    }

    let history = useHistory();

    return (
        <div className="login-container">
            <form className="login-card">
                <div className="login-card-header">
                    <h1>Sign In</h1>
                </div>

                <div className="login-card-main">
                    <CustomInput
                        label="Email"
                        id="username"
                        type="text"
                        value={username}
                        onChange={updateUsername}
                    />

                    <CustomInput
                        label="Password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={updatePassword}
                    />

                    <CustomButton className="login-button large" width="50%" onClick={login}>LOGIN</CustomButton>
                </div>

                <div className="login-card-footer">
                    <div className="login-links">
                        <Link to="/createAccount">Create Account?</Link>
                        <span>|</span>
                        <Link to="/forgot">Forgot Password?</Link>
                    </div>
                    <p className="login-error">{error}</p>
                </div>
            </form>
        </div>
    );
}

export default Login;