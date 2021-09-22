import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

const Message = ({messageData, setPost, posts, link}) => {

    const history = useHistory();

    const onButtonClick = async () => {

        const postToRender = posts.find((post) => messageData.post._id === post._id);

        history.push(`/posts`);
        setPost(postToRender);
    }
    
    return (
        <>
            <h3>From, {messageData.fromUser.username}</h3>
            <p>{messageData.content}</p>

            {
            link !== undefined
            ?
                <Button 
                                    
                variant="outlined" 
                color="primary"
                onClick={() => {
                    onButtonClick();
                }}
                >View Post</Button>  
            :null 
            }
        </>
    );
};

export default Message;