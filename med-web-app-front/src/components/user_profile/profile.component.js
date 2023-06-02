import React, {useEffect, useRef, useState} from "react";
import AuthService from "../../services/auth.service";
import ProfileService from "../../services/profile.service";
import Grid from '@material-ui/core/Grid';
import '../../styles/Profile.css'
import Review from "./review.component"
import {ButtonBase, Card, Collapse, ListItem, Paper, TextField, Typography, withStyles} from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Button from "@material-ui/core/Button";
import {Link, useParams} from "react-router-dom";
import UserService from "../../services/user.service"
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import StarRatings from 'react-star-ratings';
import GetAllReviews from "../../requests_and_responses/review-request";
import GetAvgRating from "../../avg_rating/get-avg-rating";
import ListItemButton from "@mui/material/ListItemButton"
import { ListItemIcon, ListItemText } from "@material-ui/core"
import { Logout} from "@mui/icons-material";
import { width } from "@mui/system";
import { createTheme} from '@mui/material/styles';
import getCorrectExperienceValue from "./get-correct-experience-value";
import ButtonDrawer from "../ButtonDrawer";
import {Hidden} from "@material-ui/core";
import {IconButton} from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationService from "../../services/notification.service";

const useStyles = theme => ({
    txtField: {
        width: 350,
        [theme.breakpoints.down("xs")]: {
            width: 250,
        },
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        }
    },
    txtFieldUsername: {
        width: 250,
        [theme.breakpoints.down("xs")]: {
            width: 180,
        },
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        }
    },
    txtFieldRole: {
        width: 180,
        [theme.breakpoints.down("xs")]: {
            width: 130,
        },
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        },
    },
    txtDoctorFields: {
        width: 350,
        [theme.breakpoints.down("xs")]: {
            width: 250,
        },
        margin: theme.spacing(1),
        "& .MuiInputBase-input": {
            textAlign: 'center'
        }
    },
    paper: {

        marginTop: theme.spacing(3),
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
        [theme.breakpoints.only("xs")]: {
            gap: 5
        },
        [theme.breakpoints.only("sm")]: {
            gap: 10
        },
        [theme.breakpoints.only("md")]: {
            gap: 40
        },
       
        "@media (min-width: 1280px)": {
            gap: 50
        },
        display: 'flex',
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
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    exitButton: {
        width: 200,
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        margin: theme.spacing(1)
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
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
    },
    gridInPaper: {
        [theme.breakpoints.only("xs")]: {
            gap: 10
        },
        [theme.breakpoints.only("sm")]: {
            gap: 10
        },
        [theme.breakpoints.only("md")]: {
            gap: 3
        },
       
        "@media (min-width: 1280px)": {
            gap: 50
        },
        marginTop: theme.spacing(1),
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
    },
    settingsIcon: {
        marginTop: theme.spacing(3),
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
    const theme = createTheme()

    const links = ["/edit", "/files/view", "/files/upload", '/login'];
    const icons = [<EditIcon style={{ color: '#f50057' }}/>, <FolderIcon style={{ color: '#f50057' }}/>, <FileDownloadIcon style={{ color: '#f50057' }}/>, <LogoutIcon style={{ color: '#f50057' }}/>]

    const titles = ['Редактировать профиль', 'Мои файлы', 'Загрузить файл', 'Выход']
    const positions = ['right']
    const icon = <SettingsIcon style={{ color: '#f50057' }} fontSize={"large"}/>

    function selectFile() {
        if (user && user.username === AuthService.getCurrentUser().username) {
            fileInput.current.click()
        }
    }
    
    function getUser(username1) {
        ProfileService.getProfile(username1).then(
            async response => {
                const user = response.data;

                let currUser = AuthService.getCurrentUser();
                currUser.notificationIds = user.notificationIds;
                localStorage.setItem("user", JSON.stringify(currUser));

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
                    defaultValue={user.specialization}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    multiline
                    className={classes.txtDoctorFields}
                    id="standard-read-only-input"
                    defaultValue={"Специализация на болезнях: " + user.specializedDiagnoses}
                    InputProps={{
                        readOnly: true,
                    }}
                />
                <TextField
                    multiline
                    className={classes.txtDoctorFields}
                    id="standard-read-only-input"
                    defaultValue={getCorrectExperienceValue(user.experience)}
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
                />
                <TextField
                    multiline
                    className={classes.txtDoctorFields}
                    id="standard-read-only-input"
                    defaultValue={"От " + user.price + " рублей"}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </Grid>);

    }

    return (
        <div>
            {
                user &&
                <Grid container direction="column" alignItems="center" >
                    <Grid xs={12} item className={classes.mainGrid} justifyContent="center">
                        <Grid item>
                            <Card className={classes.paper}>
                                <Grid container className={classes.gridInPaper} justifyContent="center">
                                    <Grid item className={classes.grid}>
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
                                    <Grid item className={classes.gridData}>
                                        <TextField
                                            variant="outlined"
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
                            <Grid item>
                                <Hidden lgUp >
                                    <div className={classes.settingsIcon}>
                                        <ButtonDrawer links={links} icons={icons} titles={titles} positions={positions} icon={icon}/>
                                    </div>
                                </Hidden>

                                <Hidden mdDown>
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
                                            <ListItemButton
                                                component={Link} to={'/login'}
                                                title={'Выход'}
                                                className={classes.exitButton}
                                                sx={{backgroundColor: "#fff", margin: theme.spacing(1)}}

                                            >
                                                <ListItemIcon>{<Logout style={{color: '#f50057'}} />}</ListItemIcon>
                                                <ListItemText primary={'Выход'}/>
                                            </ListItemButton>
                                        </Grid>
                                    </Card>
                                </Hidden>
                                
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