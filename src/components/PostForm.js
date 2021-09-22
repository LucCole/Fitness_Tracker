import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, TextareaAutosize, FormControlLabel, Checkbox } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { callApi, fetchPosts } from '../api';

const useStyles = makeStyles(theme => ({
    form: {
        marginTop: "10vh",
        textAlign: "center",
        "& div": {
            margin: "5px 0",
        },"& button": {
            margin: "5px 0",
        }
    },
    textarea: {
        width: "40vw",
        pdding: "1%",
        fontSize: "1.3em"
    },
}))

const PostForm = ({setPost, setPosts, isLoggedIn, token, setToken}) => {

    const classes = useStyles();
    const history = useHistory();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [willDeliver, setWillDeliver] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
       
        const data = await callApi({
            url: `/posts`,
            body: { 
                post: {
                    title: title,
                    description: description,
                    price: price,
                    location: location,
                    willDeliver: willDeliver
                } 
            },
            token: token,
            method: 'POST',
        });

        history.push(`/posts`);
        setPost(data.data.post);
        
        const fetchedPosts = await fetchPosts(token);
        setPosts(fetchedPosts);
    };

    if(!isLoggedIn){
        return (<>Please login to create post</>)
    }

    return (
        <form className={classes.form} onSubmit={handleSubmit}>

            <h2>Create Post</h2>

            <Grid container 
            direction="column"
            justifyContent="center">
                <Grid item xs>
                    <TextField 
                    type="text" 
                    label="Title"
                    variant="outlined"
                    required
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    />
                </Grid>

                <Grid item xs>

                    <TextField 
                    type="text" 
                    label="Price" 
                    variant="outlined"
                    required
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    />
                </Grid>

                <Grid item xs>

                    <TextField 
                    type="text" 
                    label="Location" 
                    variant="outlined"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    />
                </Grid>

                <Grid item xs>

                    <FormControlLabel
                    control={
                        <Checkbox 
                        checked={willDeliver} 
                        color="primary"
                        name="delivery" 
                        value={willDeliver}
                        onChange={(event) => setWillDeliver(event.target.checked)} 
                        />
                    }
                    label="Willing to deliver"
                    />
                </Grid>
            </Grid>

            <div>
                <TextareaAutosize 
                className={classes.textarea}
                aria-label="empty textarea" 
                minRows={8}
                maxRows={8}
                placeholder="Description" 
                required
                onChange={(event) => setDescription(event.target.value)}
                />
            </div>

            <div>
                <Button type="submit" variant="contained" color="primary">Create Post</Button>
            </div>
           
        </form>
    );
};

export default PostForm;