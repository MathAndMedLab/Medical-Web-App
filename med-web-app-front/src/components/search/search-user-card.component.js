import React, {Component} from "react";
import '../../styles/Search.css'
import {TableCell, withStyles} from "@material-ui/core";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Profile from "../user_profile/profile.component"
const useStyles = theme => ({
    root: {
        "& .MuiTypography-root": {
            color: "black",
            fontSize: 17
        },
    },
    link: {
        color: "black",
        fontSize: 17
    },
    avatar: {
        width: 150,
        height: 160,
        marginLeft: "auto",
        marginRight: "auto"

    },
    image: {
        height: "100%"

    }

});

class UserCard extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
    }


    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>
                <TableCell align={"center"} >
                    <Avatar className={classes.avatar} variant="rounded">
                        {(this.user.avatar) ?
                            <img alt='' className={classes.image} src={`data:image/jpeg;base64,${this.user.avatar}`} /> :
                            <PhotoCameraOutlinedIcon style={{fontSize: 60}}/>}
                    </Avatar>
                </TableCell>

                {this.user.initials !== null &&
                <TableCell align={"center"}>
                    <Link to={"profile/" + this.user.username} className={classes.link}>
                        {this.user.initials + " "}
                    </Link>

                </TableCell>}

                {this.user.initials !== null &&
                <TableCell align={"center"}>
                    <Link to={"profile/" + this.user.username} className={classes.link}>
                        {this.user.username}
                    </Link>
                </TableCell>
                }

                <TableCell  align={"center"}>
                    {this.user.role}
                </TableCell>

            </React.Fragment>
        );
    }

}

export default withStyles(useStyles)(UserCard)