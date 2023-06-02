import React, {Component} from "react";
import ReviewService from "../../services/review.service"
import ReviewCard from "../review-card.component";
import AuthService from "../../services/auth.service";
import {Card, Grid, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import StarRatings from 'react-star-ratings';
import GetReviews from "../../requests_and_responses/review-request";
import GetAllReviews from "../../requests_and_responses/review-request";

const useStyles = theme => ({
    root: {
        width: 635,
        marginRight: theme.spacing(1),
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    grid: {
        margin: theme.spacing(1),
        display: 'flex',
    },
    gridMessage: {
        margin: theme.spacing(1),
    },
    mainGrid: {
        
    },
    paper: {
        marginTop: theme.spacing(3),
        padding: theme.spacing(1),
        color: "black",
        "@media (min-width: 768px)": {
            maxWidth: "638px"
        },
       
        "@media (min-width: 960px)": {
           maxWidth: "631px"
        },
       
        "@media (min-width: 1280px)": {
            maxWidth: "678px"
        },
        // display: 'flex',
    },
    submit: {
        width: 50,
        height: 73,
        backgroundColor: '#f50057',
    },
});

class reviewComponent extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitReview = this.handleSubmitReview.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.getReviews = this.getReviews.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.refreshList = this.refreshList.bind(this);

        this.state = {
            targetId: this.props.targetId,
            reviews: [],
            content: "",
            contentPresence: false,
            contentCorrect: "",
            rating: 0,
            ratingPresence: false,
            submittedSuccessfully: false,
            message: null,
        };
    }

    handleSubmitReview(e) {
        e.preventDefault();
        ReviewService.saveReview(this.state.contentCorrect, this.state.targetId, this.state.rating).then(
            () => {
                this.setState({
                    submittedSuccessfully: true,
                    message: "Успешно опубликовано",
                    content: "",
                    contentCorrect: "",
                    contentPresence: false,
                    rating: 0,
                    ratingPresence: false,
                });
                this.getReviews();
            },
            error => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                this.setState({
                    submittedSuccessfully: false,
                    message: resMessage,
                    content: "",
                    contentCorrect: "",
                    rating: 1,
                    ratingCorrect: 1,
                });
            }
        )
    }

    onChangeContent(e) {
        let str = e.target.value
        str = str.replace(/ {2,}/g, ' ').trim();
        str = str.replace(/[\n\r ]{3,}/g, '\n\r\n\r');
        // str = str.replace(/[\n\r]{3,}/g, '\n\r\n\r');
        if (str.charCodeAt(0) > 32) {
            this.setState({
                content: e.target.value,
                contentCorrect: str,
                contentPresence: true
            });
        } else {
            this.setState({
                content: e.target.value,
                contentCorrect: str,
                contentPresence: false
            });
        }
    }


    componentDidMount() {
        this.getReviews();
    }

    getReviews() {
        this.refreshList()
        GetAllReviews(this.state.targetId).then((result) => {
            this.setState({reviews: result})
        })
    }

    refreshList() {
        this.setState({
            reviews: [],
        });
    }


    changeRating = (newRating, name) => {
        this.setState({
            rating: newRating,
            ratingPresence: true
        });
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid xs={12} item>
                <Grid className={classes.mainGrid}>
                    {(this.state.targetId !== AuthService.getCurrentUser().id || this.state.reviews.length !== 0) &&
                        <Card className={classes.paper}>
                            {this.state.targetId !== AuthService.getCurrentUser().id &&
                                <div>
                                    <Grid className={classes.grid}>
                                        <TextField
                                            className={classes.root}
                                            multiline
                                            minRows={2}
                                            maxRows={10}
                                            variant="outlined"
                                            fullWidth
                                            id="content"
                                            label="Оставьте отзыв..."
                                            name="content"
                                            autoComplete="off"
                                            value={this.state.content}
                                            onChange={this.onChangeContent}
                                        />
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={this.handleSubmitReview}
                                            className={classes.submit}
                                            disabled={(!this.state.contentPresence || !this.state.ratingPresence)}
                                        >
                                            <DoneOutlineIcon/>
                                        </Button>
                                    </Grid>
                                    Оставьте оценку:
                                    <StarRatings rating={this.state.rating}
                                                 starRatedColor="orange"
                                                 changeRating={this.changeRating}
                                                 numberOfStars={5}
                                                 name='rating'
                                                 starDimension="20px"
                                                 starSpacing="1px"
                                    />

                                    {this.state.message && (
                                        <Grid className={classes.gridMessage}>
                                            <div
                                                className={
                                                    this.state.submittedSuccessfully
                                                        ? "alert alert-success"
                                                        : "alert alert-danger"
                                                }
                                                role="alert"
                                            >
                                                {this.state.message}
                                            </div>
                                        </Grid>
                                    )}
                                </div>}
                            <Grid>
                                {this.state.reviews &&
                                    this.state.reviews.map((review, index) => (
                                        <Grid
                                            style={{listStyleType: "none"}}
                                            key={index}
                                        >
                                            <ReviewCard review={review} isPreview={true} isReply={false}/>
                                        </Grid>

                                    ))}
                            </Grid>

                        </Card>
                    }
                </Grid>
            </Grid>

        )
    }

}

export default withStyles(useStyles)(reviewComponent)