import React, {useEffect, useRef, useState} from "react";
import AuthService from "../../services/auth.service";
import ProfileService from "../../services/profile.service";
import Grid from '@material-ui/core/Grid';
import '../../styles/Profile.css'
import Review from "./review.component"
import {ButtonBase, Card, Collapse, Paper, TextField, Typography, withStyles} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import {Link, useParams} from "react-router-dom";
import UserService from "../../services/user.service"
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import StarRatings from 'react-star-ratings';
import GetAllReviews from "../../requests_and_responses/review-request";
import GetAvgRating from "../../avg_rating/get_avg_rating";

const useStyles = theme => ({
    txtField: {
        width: 350,
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        }
    },
    txtFieldUsername: {
        width: 250,
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        }
    },
    txtFieldRole: {
        width: 180,
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        },
    },
    txtDoctorFields: {
        width: 350,
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        }
    },
    paper: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
        padding: theme.spacing(1),
        color: "black",
        // display: 'flex',
    },
    paper2: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        color: "black",
    },
    mainGrid: {
        display: 'flex',
        minWidth: 1000,
    },
    avatar: {
        width: 150,
        height: 160,
    },
    collapsed: {
        position: "absolute",
        bottom: 0,
        width: 150,
        // '& :hover': {
        //     height: 1000,
        // }
    },
    btnbase: {
        marginBottom: theme.spacing(3),
        marginRight: theme.spacing(4),
        marginLeft: theme.spacing(4),
        position: "relative"
    },
    button: {
        width: 200,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    write: {
        width: 300,
        marginTop: theme.spacing(3),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    grid: {
        margin: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    gridData: {
        marginLeft: theme.spacing(8),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    gridInPaper: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        padding: theme.spacing(1),
        color: "black",
        display: 'flex',
    },
    paperUploadAvatar: {
        background: '#f4f4f4',
        height: 30,
        textAlign: "center",
        paddingTop: 6,
        '&:hover': {
            backgroundColor: '#ffffff',
            textDecoration: 'underline'
        }
    },
    typography: {
        fontWeight: 500,
        fontSize: 13
    },
    gridDoctorData: {
        marginLeft: theme.spacing(0),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    }
});

function Profile(props) {
    const {classes} = props
    const [user, setUser] = useState(null)
    const {usernamePath} = useParams()
    const [username, setUsername] = useState(usernamePath)
    const [showReviews, setShowReviews] = useState(true)
    const fileInput = useRef(null)
    const [selectedFile, setSelectedFile] = useState(null)
    const [checked, setChecked] = useState(false)
    const [reviews, setReviews] = useState([])
    const [reviewsCounter, setReviewsCounter] = useState(0)

    function selectFile() {
        if (user && user.username === AuthService.getCurrentUser().username) {
            fileInput.current.click()
        }
    }

    function getUser(username1) {
        ProfileService.getProfile(username1).then(
            async response => {
                const user = response.data;
                console.log(user)
                if (user.avatar) {
                    const base64Data = user.avatar
                    const base64Response = await fetch(`data:application/json;base64,${base64Data}`)
                    const blob = await base64Response.blob()
                    setSelectedFile(URL.createObjectURL(blob))
                }
                refreshList();
                setUser(user)

                GetAllReviews(user.id).then((result) => {
                    setReviews(result)
                    setReviewsCounter(result.length)
                })
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function refreshList() {
        setUser(null)
    }


    useEffect(() => {
        setUsername(usernamePath)
        getUser(usernamePath);
    }, [usernamePath])

    function uploadFiles(e) {
        const MAX_SIZE_FILES = 52428800
        if (e.target.files[0] > MAX_SIZE_FILES) {
            alert("Размер <= 50МБ")
        } else {
            UserService.uploadAvatar(e.target.files[0])
            setSelectedFile(URL.createObjectURL(e.target.files[0]))
        }
    }

    function getTextFieldsForDoctorRole() {
        if (user.role === "Пользователь") {
            return;
        }
        return (
            <Grid className={classes.gridDoctorData}>
                <TextField
                    multiline
                    className={classes.txtDoctorFields}
                    id="standard-read-only-input"
                    defaultValue={"Специальность: " + user.specialization}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    multiline
                    className={classes.txtDoctorFields}
                    id="standard-read-only-input"
                    defaultValue={"Стаж: " + user.experience + " лет"}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    multiline
                    className={classes.txtDoctorFields}
                    id="standard-read-only-input"
                    defaultValue={"Место работы: " + user.workplace}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    multiline
                    className={classes.txtDoctorFields}
                    id="standard-read-only-input"
                    defaultValue={"Образование: " + user.education}
                    InputProps={{
                        readOnly: true,
                    }}
                /> </Grid>);

    }

    return (
        <div>
            {
                user &&
                <Grid>
                    <Grid xs={12} item className={classes.mainGrid}>
                        <Grid xs={8} item>
                            <Card className={classes.paper}>
                                <Grid className={classes.gridInPaper}>
                                    <Grid className={classes.grid}>
                                        <ButtonBase className={classes.btnbase}
                                                    onMouseOver={() => setChecked(true)}
                                                    onMouseLeave={() => setChecked(false)}>
                                            <input type="file" style={{"display": "none"}} ref={fileInput}
                                                   accept="image/*"
                                                   onChange={(e) => uploadFiles(e)}/>
                                            <Avatar className={classes.avatar} variant="rounded" src={selectedFile}>
                                                <PhotoCameraOutlinedIcon style={{fontSize: 60}}/>
                                            </Avatar>
                                            {user && user.username === AuthService.getCurrentUser().username &&
                                                <Collapse in={checked} className={classes.collapsed}>
                                                    <Paper className={classes.paperUploadAvatar} onClick={selectFile}>
                                                        <Typography className={classes.typography}>
                                                            Загрузить фотографию
                                                        </Typography>
                                                    </Paper>
                                                </Collapse>}
                                        </ButtonBase>

                                        <div>Дата регистрации:</div>
                                        <div>{new Date(user.registeredDate).toLocaleDateString()}</div>
                                        <div>Отзывов: {reviewsCounter}</div>
                                        <div><StarRatings rating={GetAvgRating(reviews, reviewsCounter)}
                                                          starRatedColor="orange"
                                                          numberOfStars={5}
                                                          name='rating'
                                                          starDimension="20px"
                                                          starSpacing="1px"
                                        /></div>
                                        <span>{user.active}</span>
                                    </Grid>
                                    <Grid className={classes.gridData}>
                                        <TextField
                                            multiline
                                            className={classes.txtField}
                                            id="standard-read-only-input"
                                            maxRows={4}
                                            defaultValue={user.initials}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            multiline
                                            className={classes.txtFieldUsername}
                                            id="standard-read-only-input"
                                            maxRows={4}
                                            defaultValue={user.username}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        <TextField
                                            className={classes.txtFieldRole}
                                            id="standard-read-only-input"
                                            defaultValue={user.role}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                        {getTextFieldsForDoctorRole()}
                                        {user && user.username !== AuthService.getCurrentUser().username &&
                                            <Link to={"/msg/" + user.username} style={{textDecoration: 'none'}}>
                                                <Button className={classes.write}>
                                                    Написать
                                                </Button>
                                            </Link>
                                        }
                                    </Grid>
                                </Grid>
                            </Card>
                        </Grid>
                        {user && user.username === AuthService.getCurrentUser().username &&
                            <Grid xs={4} item>
                                <Card className={classes.paper2}>
                                    <Grid className={classes.grid}>
                                        <Link to={"/edit"} style={{textDecoration: 'none'}}>
                                            <Button className={classes.button} title={"Редактировать профиль"}>
                                                Редактировать профиль
                                            </Button>
                                        </Link>
                                        <Link to={"/files/view"} style={{textDecoration: 'none'}}>
                                            <Button className={classes.button} title={"Мои файлы"}>
                                                Мои файлы
                                            </Button>
                                        </Link>
                                        <Link to={"/files/upload"} style={{textDecoration: 'none'}}>
                                            <Button className={classes.button} title={"Загрузить файл"}>
                                                Загрузить файл
                                            </Button>
                                        </Link>
                                    </Grid>
                                </Card>
                            </Grid>
                        }
                    </Grid>

                    {showReviews && (
                        <Review targetId={user.id}/>
                    )}
                </Grid>
            }

        </div>
    );


}


export default withStyles(useStyles)(Profile)