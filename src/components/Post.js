import React, { useEffect, useState, }  from 'react';
import { Link, } from 'react-router-dom';
import { 
    TextField, 
    Button, 
    TextareaAutosize, 
    FormControlLabel, 
    Checkbox, 
    Grid ,
    Snackbar, 
    IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { callApi, fetchPosts, } from '../api';
import Message from './Message';

import { makeStyles, } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    form: {
        marginTop: "3vh",
        textAlign: "center",
        "& div": {
            margin: "5px 0",
        },"& button": {
            margin: "5px 0",
        },
    },
    messageContainer: {
        borderTop: "1px solid lightgrey",
        marginTop: "20px",
        paddingTop: "15px",
    },
    messageForm: {
        "& > *": {
            margin: "5px 5px",
        },
    },
    textarea: {
        width: "40vw",
        pdding: "1%",
        fontSize: "1.3em",
    },
    h3: {
        textAlign: "center",
    },
    div: {
        "& button": {
            margin: "0 5px",
        },
    },
    snackbar: {
        backgroundColor: "#4CAF50",
    },
    loggedInContainer: {
        "& button": {
            margin: "0 5px",
        },
    },
}))

const Post = ({ editPost, setEditPost, post, setPost, setPosts, isLoggedIn, token}) => {

    if(!post){
        return null
    }

    const classes = useStyles();

    let postToRender;
    postToRender = post;

    const [title, setTitle] = useState(postToRender.title);
    const [description, setDescription] = useState(postToRender.description);
    const [price, setPrice] = useState(postToRender.price);
    const [location, setLocation] = useState(postToRender.location);
    const [willDeliver, setWillDeliver] = useState(postToRender.willDeliver);
    const [open, setOpen] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [success, setEditSuccess] = useState('');
    const [messageSuccess, setMessageSuccess] = useState('');

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpen(false);
    };

    const handleMessageClick = () => {
        setMessageOpen(true);
    };

    const handleMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setMessageOpen(false);
    };

    useEffect(async () => {
        setTitle(postToRender.title)
        setDescription(postToRender.description)
        setPrice(postToRender.price)
        setLocation(postToRender.location)
        setWillDeliver(postToRender.willDeliver)
    }, [postToRender]);
    
    const editClick = () => {
        setEditPost(true);
    }

    const cancleClick = () => {
        setEditPost(false);
    }

    const [newMessage, setNewMessage] = useState('');

    const deleteClick = async() => {

        const data = await callApi({
            url: `/posts/${postToRender._id}`,
            token: token,
            method: 'DELETE',
        });

        setEditPost(false);
        setPost(null)

        const fetchedPosts = await fetchPosts(token);
        setPosts(fetchedPosts);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = await callApi({
            url: `/posts/${postToRender._id}`,
            body: { 
                post: {
                    title: title,
                    description: description,
                    price: price,
                    location: location,
                    willDeliver: willDeliver,
                } 
            },
            token: token,
            method: 'PATCH',
        });

        cancleClick();
        const fetchedPosts = await fetchPosts(token);
        setPosts(fetchedPosts);

        setEditSuccess("Post Updated")
        handleClick();
    }

    const handleMessage = async (event) => {
        event.preventDefault();

        const data = await callApi({
            url: `/posts/${postToRender._id}/messages`,
            body: { 
                message: {
                    content: newMessage
                }
            },
            token: token,
            method: 'POST',
        });

        setNewMessage('');

        setMessageSuccess("Message Sent")
        handleMessageClick();
    }

    return (
        <>
            {!post ? <Link to="/posts">Back to all posts</Link> : null}
            {
                editPost
                ?
                <>
                    <h3 className={classes.h3}>Edit Post</h3>
                
                    <form className={classes.form} onSubmit={handleSubmit}>

                        <Grid container 
                        direction="column"
                        justifyContent="center"
                        >
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
                            defaultValue={description}
                            onChange={(event) => setDescription(event.target.value)}
                            />
                        </div>
                        
                        <div className={classes.div}>
                            <Button type="submit" variant="contained" color="primary">Update Post</Button>
                            <Button variant="contained" onClick={cancleClick}>Cancel Edit</Button>
                        </div>

                    </form>
                </>
                :
                <>
                    <h2>{title}</h2>
                    <div>Submitted by: {postToRender.author.username}</div>
                    <div>Description: {description}</div>
                    <div>Price: {price}</div>
                    <div>Location: {location}</div>
                    <div>Delivers: {willDeliver ? 'Yes' : 'No'}</div>

                    <div className={classes.messageContainer}>
                        {
                            postToRender.isAuthor
                            ?
                            <div className={classes.loggedInContainer}>
                                <Button variant="contained" color="primary" onClick={editClick}>Edit Post</Button>
                                <Button variant="contained" color="secondary" onClick={deleteClick}>Delete Post</Button>
                                <h3>Messages Recived</h3>
                                {postToRender.messages.map((messageData) => {
                                    return <Message key={messageData._id} messageData={messageData} token={token} />
                                })}
                            </div>
                            :
                            null
                        }
                        {
                            isLoggedIn && !postToRender.isAuthor
                            ?
                            <>
                                <form className={classes.messageForm} onSubmit={handleMessage}>
                                    <h3>Send message to author</h3>

                                    <TextField 
                                    type="text" 
                                    size="small"
                                    label="Message" 
                                    variant="outlined"
                                    value={newMessage}
                                    onChange={(event) => setNewMessage(event.target.value)}
                                    />

                                    <Button type="submit" variant="contained" color="primary">Send Message</Button>

                                </form>
                            </>
                            :
                            null
                        }
                    </div>
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
                autoHideDuration={6000}
                action={
                <>
                    {success}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </>
                }
            />

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
                open={messageOpen}
                onClose={handleMessageClose}
                autoHideDuration={6000}
                action={
                <>
                    {messageSuccess}
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleMessageClose}>
                    <CloseIcon fontSize="small" />
                    </IconButton>
                </>
                }
            />
        </>
    );
};

export default Post;