import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { fetchUserData, fetchPosts } from '../api';
import { AccountForm } from './';
import { Account } from './';
import Post from './Post';
import Posts from './Posts';
import PostForm from './PostForm';
import Header from './Header';

import Grid from '@material-ui/core/Grid';

const App = () => {

    const [token, setToken] = useState('');
    const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState(null);
    const [editPost, setEditPost] = useState(false)

    const isLoggedIn = userData.username !== undefined;

    useEffect(async () => {
        if (posts.length === 0) {
            const fetchedPosts = await fetchPosts(token);
            setPosts(fetchedPosts);

        }
    });

    useEffect(async () => {

        if (!token) {
            setToken(localStorage.getItem('st-token'));
            return;
        }
        const data = await fetchUserData(token);
        setUserData(data);

    }, [token]);

    return (
        <>
            <Header isLoggedIn={isLoggedIn} setUserData={setUserData} setToken={setToken} token={token} setPosts={setPosts} setPost={setPost}/>

            <Route exact path="/account">
                <Account userData={userData} setPost={setPost} setEditPost={setEditPost} posts={posts}/>
            </Route>
            <Route exact path="/post-form">
                <PostForm setPost={setPost} setPosts={setPosts} isLoggedIn={isLoggedIn} token={token} setToken={setToken} />
            </Route>
            <Route exact path="/posts">

                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Posts posts={posts} setPost={setPost} setEditPost={setEditPost} />
                    </Grid>
                    <Grid item xs={8}>
                        <Post editPost={editPost} setEditPost={setEditPost} post={post} setPost={setPost} setPosts={setPosts} isLoggedIn={isLoggedIn} token={token} />
                    </Grid>
                </Grid>

            </Route>
            <Route path="/register">
                <AccountForm action="register" setToken={setToken} setPosts={setPosts} />
            </Route>
            <Route path="/login">
                <AccountForm action="login" setToken={setToken} setPosts={setPosts} />
            </Route>

            <Redirect from="/" to="/posts"></Redirect>
        </>
    );
};

export default App;