import React from 'react'
import Grid from "@material-ui/core/Grid";
import {Divider, List, ListItem, makeStyles, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import TimeMsg from "./time-msg.component";

const useStyles = theme => ({
	divider: {
		width: 3,
		borderRadius: 10,
		backgroundColor: "#7e7e7e"
	},
	link: {
		color: "black",
	},
	txt: {
		fontWeight: 'bold',
		marginTop: 0,
	},
	time: {
		color: '#888888',
		fontSize: 12,
		marginBottom: theme.spacing(0.5),
	},
})

const ForwardMessageItem = (props) => {
	const { classes } = props
	const { forwardMessages } = props
	const { nested } = props

	const style = makeStyles(() => ({
		forwardContent: {
			whiteSpace: 'pre-wrap',
			wordWrap: 'break-word',
			maxWidth: `calc(379px - (13px * ${nested}))`,
			'@media (max-width: 475px)': {
				maxWidth: `calc(279px - (15px * ${nested}))`
			},
			'@media (max-width: 375px)': {
				maxWidth: `calc(229px - (15px * ${nested}))`
			}
		},
	}))

	const classStyle = style()

	return (
		[...forwardMessages].map((msg, index) =>
			<ListItem key={index} style={{ padding: 0, }}>
				<Grid xs item style={{display: "flex", marginLeft: 5, marginBottom: 5, }} direction="row">
					<Grid xs={1} item style={{ display: "flex", maxWidth: 5}}>
						<Divider orientation="vertical" className={classes.divider}/>
					</Grid>
					<Grid xs item style={{ marginLeft: 5 }}>
						<Grid className={classes.txt}>
							<Link to={"/profile/" + msg.senderName} className={classes.link}>
								{msg.senderName}
							</Link>
						</Grid>
						<Grid
							className={classes.time}>
							<TimeMsg timeZone={msg.timeZone} sendDate={msg.sendDate}/>
						</Grid>
						<Grid className={classStyle.forwardContent}>
							{msg.content}
						</Grid>
						<Grid>
							{msg.forwardedMessages.length !== 0 && nested < 10 &&
								<List style={{ display: 'flex', flexDirection: 'column', }} >
									<ForwardMessageItem classes={classes} forwardMessages={msg.forwardedMessages} nested={nested + 1}/>
								</List>
							}
						</Grid>
					</Grid>
				</Grid>
			</ListItem>
		)
	)
}

const ForwardMessage = (props) => {
	const { classes } = props
	const { forwardMessages } = props

	return <ForwardMessageItem classes={classes} forwardMessages={forwardMessages} nested={0}/>
}

export default withStyles(useStyles)(ForwardMessage)