import {Component, useRef} from "react";
import {Typography} from "@mui/material";
import {Grid, Paper, withStyles} from "@material-ui/core";
import MirfImage from './MirfImageWithoutText.png';
import LeftPatientPicture from './LeftPatientPicture.png';
import MiddleUpperPatientPicture from './MiddleUpperPatientPicture.png';
import MiddleBottomPatientPicture from './MiddleBottomPatientPicture.png';
import RightPatientPicture from './RightPatientPicture.png';

const useStyles = theme => ({
    root: {
        
        flexGrow: 1,
        overflowX: 'hidden',
        overflowY: 'hidden',
        "@media (min-width : 446px)": {
            marginLeft: theme.spacing(-10),
        },

        "@media (min-width : 600px)": {
            width: 500,
            marginLeft: theme.spacing(-10),
        },

        "@media (min-width : 690px)": {
            width: 650,
            marginLeft: theme.spacing(-15),
        },

        "@media (min-width : 768px)": {
            width: 650,
            marginLeft: theme.spacing(-10),
        },

        "@media (min-width : 769px)": {
            width: 700,
            marginLeft: theme.spacing(7),
        },
        "@media (min-width : 874px)": {
            width: 750,
            marginLeft: theme.spacing(-10),
        },
        "@media (min-width : 960px)": {
            width: 800,
            marginLeft: theme.spacing(-12),
        },
        "@media (min-width : 991px)": {
            width: 800,
            marginLeft: theme.spacing(15),
        },
        "@media (min-width : 1100px)": {
            width: 800,
            marginLeft: theme.spacing(6)
        },
        "@media (min-width : 1280px)": {
            width: 1600,
            marginLeft: theme.spacing(-40)
        },

        alignItems: "center",
    },

    mainGrid: {
        marginTop: theme.spacing(3),
    },

    textGrid: {
        [theme.breakpoints.only("md")]: {
            marginTop: theme.spacing(2),
        },
        "@media (min-width : 1280px)": {
            marginTop: theme.spacing(10),

        },
    },
    
    patientGrid: {
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(4),
        },
        [theme.breakpoints.only("sm")]: {
            marginTop: theme.spacing(6),
        },
        [theme.breakpoints.only("md")]: {
            marginTop: theme.spacing(8),
        },
    },

    patientBoxes: {
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(3),
        },
        "@media (min-width : 1280px)": {
            marginTop: theme.spacing(3),

        },
        
    },

    bigTitle: {
        fontFamily: 'Roboto',
        fontStyle: "inherit",
        fontWeight: 500,
        fontSize: "80px",
        lineHeight: "47px",
        textAlign: "center",
        color: "#000000",
    },

    secondTitle: {
        [theme.breakpoints.between("xs", "sm")]: {
            paddingTop: theme.spacing(4),
        },
        [theme.breakpoints.only("md")]: {
            paddingTop: theme.spacing(2),
        },
        "@media (min-width : 1280px)": {
            paddingTop: theme.spacing(10),

        },

        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "32px",
        lineHeight: "38px",
        textAlign: "center",
        color: "#5A5A5A",
    },

    thirdTitle: {
        fontFamily: 'Roboto',
        fontStyle: "inherit",
        fontWeight: 500,
        fontSize: "80px",
        lineHeight: "47px",
        textAlign: "center",
        color: "#000000",
    },
    fourthTitle: {
        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        lineHeight: "28px",
        textAlign: "center",
    },

    // Левая пикча с логотипом
    leftBrain: {
        [theme.breakpoints.down("xs")]: {
            width: 150,
        },
        [theme.breakpoints.only("sm")]: {
            width: 230,
            
        },
        [theme.breakpoints.only("md")]: {
            width: 200,
        },
        "@media (min-width : 1280px)": {
            width: 350,
        },
        
        transform: "rotate(-46deg)",

    },

    // Правая пикча с логотипом
    rightBrain: {
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(2),
            width: 150,
        },
        [theme.breakpoints.only("sm")]: {
            marginTop: theme.spacing(3),
            width: 230,
        },
        [theme.breakpoints.only("md")]: {
            width: 200,
        },
        "@media (min-width : 1280px)": {
            width: 350,
        },

        transform: "rotate(27deg)",
    },

    patientPaper: {
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(5),
            width: 300,
            height: 365
        },
        [theme.breakpoints.only("sm")]: {
            marginTop: theme.spacing(5),
            width: 300,
            height: 365
        },
        [theme.breakpoints.only("md")]: {
            marginTop: theme.spacing(5),
            width: 300,
            height: 365
        },
        "@media (min-width : 1280px)": {
            width: 350,
            height: 395
        },

        background: "#FFFFFF",
        border: "1.5px solid rgba(0, 0, 0, 0.5)",
    },

    patientBox: {
        "@media (min-width : 1280px)": {
            marginTop: theme.spacing(2),
        },
    },


    patientSidePicture: {
        [theme.breakpoints.down("md")]: {
            width: 250,
            height: 270,
            marginTop: theme.spacing(1),
        },
        "@media (min-width : 1280px)": {
            width: 300,
            height: 300
        },
    },

    patientText: {
        paddingTop: theme.spacing(2),

        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        lineHeight: "28px",
        color: "#000000",
        textAlign: "center",
    },

    middlePatientPicture: {
        [theme.breakpoints.down("md")]: {
            width: 250,
            height: 135,
            marginTop: theme.spacing(0.5),
        },
        "@media (min-width : 1280px)": {
            width: 300,
            height:150
        },
    },

 

})

class newHome extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <Grid container direction="column" className={classes.mainGrid} >
                    <Grid container item justifyContent="center">
                        <Grid item xs={12} md={3} justifyContent="flex-start">
                            <img src={MirfImage} className={classes.leftBrain}/>
                        </Grid>

                        <Grid item xs={12} sm={10} md={6} className={classes.textGrid}>
                            <Typography variant={"h4"} className={classes.bigTitle} >
                                Второе мнение по медицинским снимкам
                            </Typography>
                            <Typography variant={"h5"} className={classes.secondTitle}>
                                Ранняя диагностика и правильный диагноз могут спасти вашу жизнь!
                            </Typography>
                        </Grid>

                        <Grid container item xs={12} md={3} justifyContent="flex-end">
                            <img src={MirfImage} className={classes.rightBrain}/>
                        </Grid>
                    </Grid>


                    <Grid container item justifyContent="center" className={classes.patientGrid} direction="column" alignItems="center">
                        <Grid item xs={12} sm={8} md={12}>
                            <Typography variant={"h6"} className={classes.thirdTitle}>
                                Если вы пациент и хотите получить дополнительное мнение по вашему снимку:
                            </Typography>
                        </Grid>

                        <Grid container item className={classes.patientBoxes} justifyContent="space-evenly">
                            <Grid item >
                                <Paper className={classes.patientPaper} justifyContent="center" >
                                    <Grid container direction="column" alignItems="center" className={classes.patientBox}>
                                        <img src={LeftPatientPicture} className={classes.patientSidePicture}/>
                                        <Typography variant={"h6"} className={classes.patientText}>
                                            <a href="#/records/view"> Разместите пост на форуме </a>
                                        </Typography>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item>
                                <Paper className={classes.patientPaper} justifyContent="center" >
                                    <Grid container direction="column" alignItems="center" className={classes.patientBox}>
                                        <img src={MiddleUpperPatientPicture} className={classes.middlePatientPicture}/>
                                        <img src={MiddleBottomPatientPicture} className={classes.middlePatientPicture}/>
                                        <Typography variant={"h6"} className={classes.patientText}>
                                            <a href="#/search"> Выберите подходящего врача </a>
                                        </Typography>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item>
                                <Paper className={classes.patientPaper} justifyContent="center" >
                                    <Grid container direction="column" alignItems="center" className={classes.patientBox}>
                                        <img src={RightPatientPicture} className={classes.patientSidePicture}/>
                                        <Typography variant={"h6"} className={classes.patientText}>
                                            <a href="http://localhost:3000/local"> Получите отчет от искусственного интеллекта </a>
                                        </Typography>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles)(newHome)