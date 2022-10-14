import React, {Component} from "react";
import {Container, Grid, Paper, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import AuthService from "../../services/auth.service";

const useStyles = theme => ({
    paper: {
        margin: "auto",
        [theme.breakpoints.down("xs")]:{
            width: 230,
            padding: theme.spacing(1)
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 550,
            padding: theme.spacing(2)

        },
        "@media (min-width: 1280px)": {
            width: 800,
            padding: theme.spacing(5)

        },
    },
    typography: {
        textAlign:"center",
        [theme.breakpoints.down("xs")]: {
            width:230,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 500,

        },
        "@media (min-width: 1280px)": {
            width: 700,

        },

    },
    typography2: {
        textAlign: "left",
        [theme.breakpoints.down("xs")]: {

            width:230,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 500,

        },
        "@media (min-width: 1280px)": {
            width: 700,

        },
    },
    div: {
        margin: theme.spacing(3, 0, 1, 0),
    },
})
const GreetingWords = (props) => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint_1 = 1280;
    const breakpoint_2 = 700;
    React.useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);
    if (width > breakpoint_1) {
        return (<Typography variant="subtitle1" className={props.className}>
            Получить «второе мнение» на Medical web app можно тремя способами:<br/><br/>
            — выбрать врача в разделе «Поиск» и отправить ему личное сообщение<br/><br/>
            — воспользоваться автоматическим анализом медицинских снимков, который Вы можете найти в разделе «Анализ
            снимков»<br/><br/>
            — опубликовать пост в разделе «Форум»
        </Typography>);
    }
    if (width > breakpoint_2){
        return (<Typography variant="subtitle4" className={props.className}>
            Получить «второе мнение» на Medical web app можно тремя способами:<br/><br/>
            — выбрать врача в разделе «Поиск» и отправить ему личное сообщение<br/><br/>
            — воспользоваться автоматическим анализом медицинских снимков, который Вы можете найти в разделе «Анализ
            снимков»<br/><br/>
            — опубликовать пост в разделе «Форум»
        </Typography>);
    }
    else{
        return (<Typography variant="subtitle4" className={props.className}>
            Получить «второе мнение» на Medical web app можно тремя способами:<br/><br/>
            — выбрать врача в разделе «Поиск» и отправить ему личное сообщение<br/><br/>
            — воспользоваться автоматическим анализом медицинских снимков, который Вы можете найти в разделе «Анализ
            снимков»<br/><br/>
            — опубликовать пост в разделе «Форум»
        </Typography>);
    }
}
const GreetingTitle = (props) =>{
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint_1 = 1280;
    const breakpoint_2 = 700;
    React.useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);
    if (width > breakpoint_1){
        return(
            <Typography variant="h3" className={props.className} >
                Medical-Web-App
            </Typography>

        );
    }
    if(width > breakpoint_2){
        return(

            <Typography variant="h4" className={props.className}>
                Medical-Web-App
            </Typography>
        );
    }
    else {
        return(

            <Typography variant="h6" className={props.className} >
                Medical-Web-App
            </Typography>

        );
    }
}


class HomePatient extends Component {
    constructor(props) {
        super(props);

        const user = AuthService.getCurrentUser();

        this.state = {
            content: "",
            currentUser: user,
        };
    }

    render() {
        const {classes} = this.props;
        return(
            <Grid>
                <div className={classes.div}>
                    <Paper className={classes.paper}>
                        <GreetingTitle className = {classes.typography}/>
                    </Paper>
                </div>

                <Paper className={classes.paper}>
                    <GreetingWords className = {classes.typography2}/>
                    {this.state.currentUser == null &&
                    (<Grid style={{marginTop: 10}} item>
                        <Link to="/login">
                            Войти в аккаунт
                        </Link>
                    </Grid>)}
                </Paper>
            </Grid>
        )
    }
}

export default withStyles(useStyles)(HomePatient)