import React from 'react';
import PostSnippet from './PostSnippet';
import Message from './Message';
import { makeStyles } from '@material-ui/core/styles';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
    accountDiv: {
        width: '60%',
        margin: '0 auto',
        paddingBottom: "5vh"
    },
    expandMoreIcon: {
        color: "#303F9F",
        margin: "0 30px",
    },
    accordionSummaryHeader: {
        margin: "0 auto",
        display: "flex",
    },
    accordionDetailsTypography: {
        width: "100%",
        borderTop: "1px solid grey",
        paddingTop: "15px",
    }
}));

const Account = ({ userData, setPost, posts, setEditPost}) => {

    const classes = useStyles();

    if(userData.posts === undefined){
        return null
    }

    const messages = {
        sent: [],
        recived: [],
    },
    sortedPosts = {
        active: [],
        unactive: [],
    }

    userData.messages.forEach(message => {

        if(message.fromUser.username === userData.username){
            messages.sent.push(message)
        }else{
            messages.recived.push(message)
        }
    });

    userData.posts.forEach(post => {

        if(post.active){
            sortedPosts.active.push(post)
        }else{
            sortedPosts.unactive.push(post)
        }
    });
    
    return (
        <div className={classes.accountDiv}>

            <h2>Click on a Accordian below to see the selected information!</h2>

            <Accordion>
                <AccordionSummary
                className={classes.accordionSummary}
                aria-controls="panel1a-content"
                id="panel1a-header"
                >
                    <div className={classes.accordionSummaryHeader}>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                        <Typography>Messages Recived</Typography>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.accordionDetailsTypography}>
                    {messages.recived.map((messageData, index) => {
                        return <Message key={"messages_recived_"+index+messageData._id} messageData={messageData} posts={posts} setPost={setPost} link={true}/>
                    })}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                className={classes.accordionSummary}
                aria-controls="panel2a-content"
                id="panel2a-header"
                >
                    <div className={classes.accordionSummaryHeader}>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                        <Typography>Messages Sent</Typography>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.accordionDetailsTypography}>
                    {messages.sent.map((messageData, index) => {
                        return <Message key={"messages_sent_"+index+messageData._id} messageData={messageData} />
                    })}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                className={classes.accordionSummary}
                aria-controls="panel3a-content"
                id="panel3a-header"
                >
                    <div className={classes.accordionSummaryHeader}>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                        <Typography>My Current Posts</Typography>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.accordionDetailsTypography}>
                    {sortedPosts.active.map((post, index) => {

                        return (
                            <div key={post._id}>

                                <PostSnippet key={"active_post_"+index+post._id} post={post} posts={posts} setPost={setPost} link={true} setEditPost={setEditPost}/>

                            </div>
                        );
                    })}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                className={classes.accordionSummary}
                aria-controls="panel4a-content"
                id="panel4a-header"
                >
                    <div className={classes.accordionSummaryHeader}>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                        <Typography>My Old Posts</Typography>
                        {<ExpandMoreIcon className={classes.expandMoreIcon} />}
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.accordionDetailsTypography}>
                    {sortedPosts.unactive.map((post, index) => {

                        return (
                            <div key={post._id}>

                                <PostSnippet key={"unactive_post_"+index+post._id} post={post} setEditPost={setEditPost}/>

                            </div>
                        );
                    })}
                    </Typography>
                </AccordionDetails>
            </Accordion>

        </div>
    );
};

export default Account;