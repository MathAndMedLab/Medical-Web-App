import React, {useEffect, useState} from "react";
import '../../styles/Search.css'
import {ImageList, ImageListItem, Paper, Tooltip, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import AttachmentService from "../../services/attachment.service";
import ChatService from "../../services/chat.service";
import Button from "@material-ui/core/Button";

const useStyles = theme => ({
	txt: {
		fontWeight: 'bold',
		textAlign: "center",
		marginTop: 15,
		marginBottom: 10,
		color: "#5d5d5d",
	},
	time: {
		color: '#888888',
		fontSize: 12,
		marginTop: theme.spacing(0.5),
		textAlign: "right"
	},
	link: {
		color: "#888888",
		'&:hover': {
			color: "#808080",},
	}
});

function NotificationMsg(props) {
	const {classes} = props;
	const {msg} = props;
	const {initialsSender} = props
	const {getInitials} = props
	const {sender} = props
	const {scrollToBottom} = props
	useEffect(async () => {
		scrollToBottom()
	}, [msg]);

	return (
		<Grid>
			<Grid className={classes.txt}>
				<Link to={"/profile/" + msg.senderName} className={classes.link}>
					{sender === undefined ? initialsSender : getInitials(sender)}
				</Link>
				{msg.type === "CREATE" && <span className={classes.txt}> создал чат </span>}
				{msg.type === "LEAVE" && <span className={classes.txt}> вышел из чата </span>}
				{msg.type === "JOIN" && <span className={classes.txt}> вошел в чат </span>}
			</Grid>
		</Grid>
	);

}

export default withStyles(useStyles)(NotificationMsg)