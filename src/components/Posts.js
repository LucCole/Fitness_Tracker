import React, { useState } from 'react';
import PostSnippet from './PostSnippet';
import { Box, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    textField: {
        marginTop: "8px",
        backgroundColor: "white",
    },
    box: {
        paddingTop: "8px",
        maxHeight: '100vh', 
        overflow: 'auto',
    },
    sideBar: {
        marginTop: "10px",
        border: "1px solid lightGrey",
        padding: "5px",
        backgroundColor: '#F5F5F5',
        "& h3":{
            textAlign: "center",
        },
    }
}))

const postMatches = (post, searchTerm) => {

    const searchTermLower = searchTerm.toLowerCase();

    const {
        description,
        location,
        title,
        author: { username },
        price,
    } = post;

    const toMatch = [description, location, title, username, price];
    for (const field of toMatch) {
        if (field.toLowerCase().includes(searchTermLower)) {
            return true;
        }
    }

    return false;
};

const Posts = ({ posts, setPost, setEditPost}) => {

    const classes = useStyles();

    const [searchQuery, updateSearchQuery] = useState('');

    let postsToDisplay =
        searchQuery.length > 0
        ? posts.filter((post) => postMatches(post, searchQuery))
        : posts;

    return (
        <div className={classes.sideBar}>

            <h3>Scroll to see all posts</h3>

            <TextField 
            fullWidth
            label="Search for posts" 
            variant="outlined"
            className={classes.textField}
            value={searchQuery}
            onChange={(event) => {
                updateSearchQuery(event.target.value);
            }}
            />

            <Box className={classes.box}>

                {postsToDisplay.map((post) => {

                    return (
                        <PostSnippet key={'PostSnippet_'+post._id} post={post} posts={posts} setPost={setPost} setEditPost={setEditPost}/>
                    );
                })}

            </Box>
        </div>
    );
};

export default Posts;