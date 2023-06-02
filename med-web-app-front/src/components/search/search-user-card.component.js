import React, {Component, useState} from "react";
import '../../styles/Search.css'
import {TableCell, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Profile from "../user_profile/profile.component"
import GetAllReviews from "../../requests_and_responses/review-request";
import GetAvgRating from "../../avg_rating/get-avg-rating";
import StarRatings from "react-star-ratings";
import getCorrectExperienceValue from "../user_profile/get-correct-experience-value";
import {Hidden} from "@material-ui/core";
import Typography from '@mui/material/Typography';


const useStyles = theme => ({
    root: {
        "& .MuiTypography-root": {
            color: "black", 
            fontSize: 17
        },
    }, 

    link: {
        color: "black", 
        [theme.breakpoints.down("xs")]: {
            width: '80px',
        },
        [theme.breakpoints.only("sm")]:{
            width: '175px',
        },
        [theme.breakpoints.only("md")]:{
            width: '125px',
        },
        "@media (min-width: 1280px)" :{
            width: '200px',
        },
        display: 'inline-block', 
        wordWrap: 'break-word',
        "@media (min-width : 0px)": {
            fontSize: theme.spacing(2)
        },
        "@media (min-width : 600px)": {
            fontSize: theme.spacing(2.25)
        },
        "@media (min-width : 768px)": {
            fontSize: theme.spacing(3)
        },
    },
    littleText: {
        "@media (min-width : 0px) and (max-width : 599px)": {
            fontSize: theme.spacing(1.5)
        },
        "@media (min-width : 600px) and (max-width : 768px)": {
            fontSize: theme.spacing(1.75)
        },
    },

    aboutText: {
        "@media (min-width : 0px) and (max-width : 599px)": {
            fontSize: theme.spacing(1.5)
        },
        "@media (min-width : 600px) and (max-width : 768px)": {
            fontSize: theme.spacing(1.75)
        },
        textAlign: "left",
    },

    avatar: {
        "@media (min-width : 0px)": {
            width: 75, 
            height: 85, 
        },
        "@media (min-width : 600px)": {
            width: 125, 
            height: 135, 
        },
        "@media (min-width : 768px)": {
            width: 150, 
            height: 160, 
            
        },
        marginLeft: "auto", 
        marginRight: "auto"
    },
     
    image: {
        width: "100%",
        height: "100%"
    },
     
    typo: {
        width: "250px"
    }
});

class UserCard extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user;
        this.getReviews = this.getReviews.bind(this);
        this.state = {
            reviews: [], avgRating: 0
        }
        this.getReviews();
    }

    getReviews() {
        GetAllReviews(this.user.id).then((result) => {
            this.setState({reviews: result})
        })
    }

    getInfoAboutDoctor(classes) {
        if (this.user.role === "Врач") {
            return (<span>
                <div className={classes.aboutText}>{this.user.specialization}</div>
                <div className={classes.aboutText}>{"\n Специализация на болезнях: " + this.user.specializedDiagnoses}</div>
                <div className={classes.aboutText}>{"\nМесто работы: " + this.user.workplace}</div>
                <div className={classes.aboutText}>{"\nОбразование: " + this.user.education}</div>
                <div className={classes.aboutText}>{getCorrectExperienceValue(this.user.experience)}</div>
                <div className={classes.aboutText}>{"\nОт " + this.user.price + " рублей"}</div>
            </span>)
        }
    }

    render() {
        const {classes} = this.props;
        return (<React.Fragment>
            <TableCell align={"center"}>
                <Avatar className={classes.avatar} variant="rounded">
                    {(this.user.avatar) ?
                        <img alt='' className={classes.image} src={`data:image/jpeg;base64,${this.user.avatar}`}/> :
                        <PhotoCameraOutlinedIcon style={{fontSize: 60}}/>}
                </Avatar>
                {this.user.initials !== null && <Hidden mdUp>
                    <Link to={"profile/" + this.user.username} className={classes.link}>
                        {this.user.username}
                    </Link>
                </Hidden>}
                <Hidden mdUp>
                    <div className={classes.littleText}>{this.user.role}</div>
                </Hidden>

                <div className={classes.littleText}>Отзывов:{this.state.reviews.length}</div>
                <div><StarRatings rating={GetAvgRating(this.state.reviews, this.state.reviews.length)}
                                  starRatedColor="orange"
                                  numberOfStars={5}
                                  name='rating'
                                  starDimension="20px"
                                  starSpacing="1px"
                /></div>
                <div className={classes.littleText}>{this.user.active}</div>
            </TableCell>

            {this.user.initials !== null && <TableCell align={"left"}>
                <Link to={"profile/" + this.user.username} className={classes.link}>
                    {this.user.initials + " " }
                </Link>
                {this.getInfoAboutDoctor(classes)}
            </TableCell>}

            {this.user.initials !== null && <Hidden smDown>
                <TableCell align={"center"}>
                    <Link to={"profile/" + this.user.username} className={classes.link}>
                            {this.user.username + " "}
                        
                    </Link>
                </TableCell>
            </Hidden>}

            <Hidden smDown>
                 <TableCell align={"center"}>
                    <div className={classes.littleText}>{this.user.role}</div>
                </TableCell>
            </Hidden>

           

        </React.Fragment>);
    }

}

export default withStyles(useStyles)(UserCard)