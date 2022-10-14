import React, {Component} from "react";

import {Grid, Paper, Typography, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";

const useStyles = theme => ({
    paper: {
        textAlign: "center",
        [theme.breakpoints.down("xs")]:{
            margin: theme.spacing(0),
            width: 230,
            padding: theme.spacing(1)
        },
        [theme.breakpoints.between("sm", "md")]: {
            margin: "auto",
            width: 550,
            padding: theme.spacing(2),

        },
        "@media (min-width: 1280px)": {
            width: 800,
            margin: "auto",
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
    button: {
        marginRight: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(1)
        },
    },
    HomeContainer:{
        justifyContent:"center",
        "@media (max-width: 425px)":{
            paddingRight: theme.spacing(1)
        },

    }
})

const GreetingWords = (props) =>{
    const [width, setWidth] = React.useState(window.innerWidth);
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

    if(width > breakpoint_2){
        return (<Typography variant="subtitle1" className={props.className}>
            Medical web app — сервис для получения второго мнения по результатам КТ, МРТ и ПЭТ исследований.
            <br/> <br/>
            В каких случаях может понадобиться повторный анализ и расшифровка результатов КТ, МРТ и
            ПЭТ: <br/><br/>
            – подтверждение необходимости хирургического вмешательства<br/><br/>
            – подтверждение онкологического или редкого заболевания<br/><br/>
            – проверка эффективности назначенной терапии<br/><br/>
            – сомнения пациента относительно корректности поставленного диагноза<br/><br/>
            – консультация специалиста узкого профиля <br/> <br/>
        </Typography>);
    }
    else {
        return( <Typography variant="subtitle2" className={props.className}>
            Medical web app — сервис для получения второго мнения по результатам КТ, МРТ и ПЭТ исследований.
            <br/> <br/>
            В каких случаях может понадобиться повторный анализ и расшифровка результатов КТ, МРТ и
            ПЭТ: <br/>
            – подтверждение необходимости хирургического вмешательства<br/><br/>
            – подтверждение онкологического или редкого заболевания<br/><br/>
            – проверка эффективности назначенной терапии<br/><br/>
            – сомнения пациента относительно корректности поставленного диагноза<br/><br/>
            – консультация специалиста узкого профиля <br/> <br/>
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


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    // componentDidMount() {
    //     TestService.getPublicContent().then(
    //         response => {
    //             this.setState({
    //                 content: response.data
    //             });
    //         },
    //         error => {
    //             this.setState({
    //                 content:
    //                     (error.response && error.response.data) ||
    //                     error.message ||
    //                     error.toString()
    //             });
    //         }
    //     );
    // }

    render() {
        const {classes} = this.props;
        return (
            <Grid container className={classes.HomeContainer}>
                <div className={classes.div}>
                    <Paper className={classes.paper}>
                        <GreetingTitle  className = {classes.typography}/>
                    </Paper>
                </div>

                {/*
                <div className={classes.div}>
*/}
                <Paper className={classes.paper}>
                    <GreetingWords className = {classes.typography2}/>
                    <Grid
                        container
                        justifyContent="center">
                        <Link to={"/home/patient"} style={{textDecoration: 'none'}}>
                            <Button variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    title = {"К страница пациента"}
                            >
                                <Typography variant="h6">
                                    Я пациент
                                </Typography>
                            </Button>
                        </Link>
                        {/*<Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            href="home/patient"
                        >
                            <Typography variant="h6">
                                Я пациент
                            </Typography>
                        </Button>*/}
                        <Link to={"/home/doctor"} style={{textDecoration: 'none'}}>
                            <Button variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                    title = {"К странице врача"}
                            >
                                <Typography variant="h6">
                                    Я врач
                                </Typography>
                            </Button>
                        </Link>
                        {/*<Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            href="home/doctor"

                            >
                                <Typography variant="h6">
                                    Я врач
                                </Typography>
                            </Button>*/}
                    </Grid>
                </Paper>
            </Grid>
        )
    }
}


export default withStyles(useStyles)(Home)