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

const useStyles = theme => ({
    root: {
        "& .MuiTypography-root": {
            color: "black", fontSize: 17
        },
    }, link: {
        color: "black", fontSize: 17
    }, avatar: {
        width: 150, height: 160, marginLeft: "auto", marginRight: "auto"
    }, image: {
        height: "100%"
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

    getInfoAboutDoctor() {
        if (this.user.role === "Врач") {
            return (<span>
                <div style={{textAlign: "left"}}>{this.user.specialization}</div>
                <div style={{textAlign: "left"}}>{"\n Специализация на болезнях: " + this.user.specializedDiagnoses}</div>
                <div style={{textAlign: "left"}}>{"\nМесто работы: " + this.user.workplace}</div>
                <div style={{textAlign: "left"}}>{"\nОбразование: " + this.user.education}</div>
                <div style={{textAlign: "left"}}>{getCorrectExperienceValue(this.user.experience)}</div>
                <div style={{textAlign: "left"}}>{"\nОт " + this.user.price + " рублей"}</div>
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
                <div>Отзывов:{this.state.reviews.length}</div>
                <div><StarRatings rating={GetAvgRating(this.state.reviews, this.state.reviews.length)}
                                  starRatedColor="orange"
                                  numberOfStars={5}
                                  name='rating'
                                  starDimension="20px"
                                  starSpacing="1px"
                /></div>
                {this.user.active}
            </TableCell>

            {this.user.initials !== null && <TableCell align={"left"}>
                <Link to={"profile/" + this.user.username} className={classes.link}>
                    {this.user.initials + " "}
                </Link>
                {this.getInfoAboutDoctor()}
            </TableCell>}

            {this.user.initials !== null && <TableCell align={"center"}>
                <Link to={"profile/" + this.user.username} className={classes.link}>
                    {this.user.username}
                </Link>
            </TableCell>}

            <TableCell align={"center"}>
                {this.user.role}
            </TableCell>

        </React.Fragment>);
    }

}

export default withStyles(useStyles)(UserCard)