import React from 'react';
import {Paper, Typography, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import UserCardMessage from "./user-card-msg.component";

const useStyles = theme => ({
	root: {
		"& .MuiTypography-root": {
			color: "black",
			fontSize: 17
		},
	},
	gridText: {
		color: "black",
		fontSize: 15,
		fontWeight: 450,
		alignItems: "left"
	},
	gridFullWidth: {
		width: '100%'
	},
	flex: {
		display: 'flex',
	},
	avatar: {
		width: 45,
		height: 45,
		marginRight: theme.spacing(2),
		marginLeft: theme.spacing(-1),
	},
	lastMsgTimeContent: {
		color: '#888888',
		textAlign: "right"
	},
	lastMsgTextContent: {
		color: '#888888',
	},
	noticeMsg: {
		backgroundColor: '#FF0040',
		textAlign: 'center',
		color: 'white',
		width: 25
	},
});

const ChatCardMsg = (props) => {
	const {classes} = props
	const {allMessages} = props
	const {chatAndLastMsg} = props
	const {getInitials} = props
	const {currentUser} = props

	function contentMessage(chat, message) {
		let initials
		let chatId
		let user = message.senderName === currentUser

		if (chat.username !== undefined) {
			initials = chat.initials
			chatId = message.username
		} else {
			initials = getInitials(message.senderName)
			chatId = message.chatId
		}

		return (
			<Grid className={classes.flex} xs={12} item>
				<Grid xs={10} item
				      className={classes.lastMsgTextContent}>

					{(user && message.type === "CHAT" ?
						<span style={{fontSize: 14, color: '#5d5d5d'}}>Вы: </span> :
							message.type === "CHAT" && <span style={{fontSize: 14, color: '#5d5d5d'}}>{initials.split(" ")[1] + ": "}</span>)}
					{(message &&
							message.type === "CHAT" &&
							message.content &&
							message.content.length < 25 &&
							message.content.length > 0 &&
							message.content)
						|| (message &&
							message.type === "CHAT" &&
							message.content &&
							message.content.length > (!user ? 20 - initials.split(" ")[1].length : 18) &&
							message.content.slice(0, !user ? 20 - initials.split(" ")[1].length : 18) + "...")
						|| (message &&
							message.type === "CHAT" &&
							message.content !== null &&
							<Typography style={{fontSize: 14, color: '#227ba2'}}>Файл</Typography>)
						|| (message && message.type === "CREATE" && "Создан чат")
					}

				</Grid>
				{allMessages.get(chatId) && (allMessages.get(chatId).unRead > 0)
					&& <Grid>
						<Paper
							className={classes.noticeMsg}>{allMessages.get(chatId).unRead}
						</Paper>
					</Grid>}
			</Grid>
		)
	}
	function getDayOfWeek(yesterday1, messageTime, days) {
		yesterday1.setDate(yesterday1.getDate() - 1)
		if (yesterday1.getDate() === messageTime.getDate() && yesterday1.getMonth() === messageTime.getMonth()) {
			return days [messageTime.getDay()]
		} else {
			return false
		}
	}

	/**
	 * Функция определяет, когда было отправлено последнее сообщение от пользователей в списке
	 * контактов, для того, чтобы показать пользователю:
	 * время (если отправлено сегодня), вчера, день недели (если отправлено > 2 дней назад),
	 * дату (если отправлено > 7 дней назад)
	 * @returns {string|*|boolean}
	 * @param timeMsg
	 */
	function processTimeSend(timeMsg) {
		let today = new Date()
		let messageTime = new Date(timeMsg)
		if (today.toDateString() === messageTime.toDateString()) {
			return (((messageTime.getHours() < 10 && "0" + messageTime.getHours()) || messageTime.getHours() >= 10 && messageTime.getHours()) + ":"
				+ ((messageTime.getMinutes() < 10 && "0" + messageTime.getMinutes())
					|| (messageTime.getMinutes() >= 10 && messageTime.getMinutes())
				))
		} else if (today.getFullYear() === messageTime.getFullYear()) {
			let yesterday1 = new Date(today)
			yesterday1.setDate(yesterday1.getDate() - 1)
			if (yesterday1.getDate() === messageTime.getDate()) {
				return "Вчера"
			}
			const days = ["ВC", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"]
			for (let i = 0; i < 5; i++) {
				const dayOfWeek = getDayOfWeek(yesterday1, messageTime, days)
				if (dayOfWeek) {
					return dayOfWeek
				}
			}
		}
		return (
			((messageTime.getDate() < 10 && "0" + messageTime.getDate()) || (messageTime.getDate() >= 10 && messageTime.getDate()))
			+ "."
			+ (((messageTime.getMonth() + 1) < 10 && "0" + (messageTime.getMonth() + 1)) || (((messageTime.getMonth() + 1) >= 10 && (messageTime.getMonth() + 1))))
			+ "." + messageTime.getFullYear()
		)

	}

	return (
		<Grid className={classes.flex} xs={12} item>
			<Grid xs={1} item style={{ minWidth: 60 }}>
				<Avatar className={classes.avatar} src={chatAndLastMsg.first.avatar}>
					<PhotoCameraOutlinedIcon/>
				</Avatar>
			</Grid>
			<Grid xs item>
				<Grid className={classes.gridFullWidth}>
					<Grid className={classes.flex} xs={12} item>
						<Grid xs={9} item>
							{chatAndLastMsg.first.initials !== undefined ?
								<UserCardMessage user={chatAndLastMsg.first}/> :
								<Grid item className={classes.gridText}>{chatAndLastMsg.first.chatName}</Grid>
							}
						</Grid>
						<Grid xs={3} item>
							<Grid className={classes.lastMsgTimeContent}>
								{
									chatAndLastMsg.sendDateInCurrentTimeZone && processTimeSend(chatAndLastMsg.sendDateInCurrentTimeZone)
								}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				{contentMessage(chatAndLastMsg.first, chatAndLastMsg.second)}
			</Grid>
		</Grid>
	)
}

export default withStyles(useStyles)(ChatCardMsg)