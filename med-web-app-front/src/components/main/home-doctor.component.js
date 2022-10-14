import React, {Component} from "react";
import {Container, Paper, Typography, withStyles} from "@material-ui/core";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import AuthService from "../../services/auth.service";

const useStyles = theme => ({
    paper: {
        margin: "auto",
        [theme.breakpoints.down("xs")]: {
            width: 230,
            padding: theme.spacing(1)
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 600,
            padding: theme.spacing(2)

        },
        "@media (min-width: 1280px)": {
            width: 800,
            padding: theme.spacing(5)

        },
    },
    div: {
        margin: theme.spacing(3, 0, 1, 0),
    },
    typography: {
        textAlign: "center",
        [theme.breakpoints.down("xs")]: {
            width: 230,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 600,

        },
        "@media (min-width: 1280px)": {
            width: 700,
        },
    },
})

const DoctorPageTitle = (props) => {
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
        return (
            <Typography variant="h3" className={props.className}>
                Medical-Web-App
            </Typography>

        );
    }
    if (width > breakpoint_2) {
        return (

            <Typography variant="h4" className={props.className}>
                Medical-Web-App
            </Typography>
        );
    } else {
        return (

            <Typography variant="h6" className={props.className}>
                Medical-Web-App
            </Typography>

        );
    }
}


const DoctorPageWords = (props) => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const breakpoint_1 = 1280;
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
        return (<Typography variant="subtitle1">
            Я врач
        </Typography>);
    } else {
        return (<Typography variant="subtitle2">
            Я врач
        </Typography>)
    }
}


class HomeDoctor extends Component {
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
        return (
            <Container>
                <div className={classes.div}>
                    <Paper className={classes.paper}>
                        <DoctorPageTitle className={classes.typography}/>
                    </Paper>
                </div>

                <Paper className={classes.paper}>
                    <DoctorPageWords className={classes.typography}/>
                    {this.state.currentUser == null &&
                    (<Grid style={{marginTop: 10}} item>
                        <Link to="/login">
                            Войти в аккаунт
                        </Link>
                    </Grid>)}

                </Paper>
            </Container>
        )
    }
}

export default withStyles(useStyles)(HomeDoctor)