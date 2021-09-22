import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { TextField, Button, Snackbar, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { callApi } from '../api';
import { fetchPosts } from '../api';

const useStyles = makeStyles(theme => ({
    div: {
        marginTop: "20vh",
        textAlign: "center",
    },
    link: {
        textDecoration: "none",
        color: "inherit",
    },
    form: {
        '& > *': {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: '25ch',
        },
    },
    snackbar: {
        backgroundColor: "#F44335"
    },
}))

const AccountForm = ({ action, setToken, setPosts}) => {

    const classes = useStyles();

    const [username, setUsername] = useState(''),[password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    const isLogin = action === 'login';
    const title = isLogin ? 'Login' : 'Register';

    const history = useHistory();

    const handleSubmit = async (event) => {
        event.preventDefault();


        const data = await callApi({
            api_url: 'http://fitnesstrac-kr.herokuapp.com/api/users',
            url: `/login`,
            body: { username, password },
            method: 'POST',
        });

        console.log(data);


        // const data = await callApi({
        //     url: `users/${action}`,
        //     body: { user: { username, password } },
        //     method: 'POST',
        // });

        // if("success" in data){

        //     const token = data.data.token;
    
        //     if (token) {
        //         localStorage.setItem('st-token', token);
        //         setToken(token);
        //         history.push("/account");
        //     }

        //     const fetchedPosts = await fetchPosts(token);
        //     setPosts(fetchedPosts);

        //     return true;
        // }

        // setError(data.message)
        // handleClick();
    };

    return (
        <div className={classes.div}>

            <h2>{title}</h2>

            <form className={classes.form} onSubmit={handleSubmit}>

                <TextField 
                type="text" 
                label="username" 
                required
                minLength="3"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                />

                <TextField 
                type="password" 
                label="password" 
                required
                minLength="5"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                />

                <Button type="submit" variant="contained" color="primary">{title}</Button>
                
            </form>


            {
                isLogin
                ?
                <>
                    <h3>Dont have an account?</h3>

                    <Button type="submit" variant="contained">
                        <Link className={classes.link} to={'/register'}>Register</Link>
                    </Button>
                </>
                :
                <>
                    <h3>Already have an account?</h3>

                    <Button type="submit" variant="contained">
                        <Link className={classes.link} to={'/login'}>Login</Link>
                    </Button>
                </>
            }

            <Snackbar
                ContentProps={{
                    classes: {
                        root: classes.snackbar
                    }
                }}
                className={classes.snackbar}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                onClose={handleClose}
                action={
                <>
                    {error}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </>
                }
            />
        </div>
    );
};

export default AccountForm;