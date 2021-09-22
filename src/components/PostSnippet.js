import React from 'react';
import { Paper, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    paper: {
        padding: "5px",
        margin: "5px 0",
        "& > span": {
            display: "block",
            fontSize: "1.1em",
            margin: "5px 2px",
        },
    },
    button: {
        padding: "5px 20%",
    },
    div: {
        textAlign: "center",
    },
}))

const PostSnippet = ({ post, posts, setPost, link, setEditPost }) => {

    const classes = useStyles();

    const history = useHistory();

    const onButtonClick = () => {

        const postToRender = posts.find((currentPost) => currentPost._id === post._id);
        history.push(`/posts`);
        setPost(postToRender);
    }

    let description = post.description;

    if(post.description.length > 100){
        description = post.description.slice(0, 70)+'...'
    }

    return (

        <Paper 
        variant="outlined" 
        className={classes.paper}
        key={post._id}
        >
            
            <h2>{post.title}</h2>
            <span>Submitted by: {post.author.username}</span>
            <span>Description: {description}</span>
            <span>Price: {post.price}</span>
            
            <div className={classes.div}>
                {
                    post.active
                    ?
                        <Button    
                        variant="outlined" 
                        color="primary"
                        className={classes.button}
                        onClick={() => {

                            link !== undefined
                            ?
                            onButtonClick()
                            :
                            setPost(post)

                            setEditPost();

                        }}
                        >View Post</Button>  
                    : null
                }
            </div>  
        </Paper>
    );
};

export default PostSnippet;