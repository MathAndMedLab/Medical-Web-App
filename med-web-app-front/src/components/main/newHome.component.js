import {Component, useRef} from "react";
import {Typography} from "@mui/material";
import {Grid, Paper, withStyles} from "@material-ui/core";
import MirfImage from './MirfImageWithoutText.png';
import LeftPatientPicture from './LeftPatientPicture.png';
import MiddleUpperPatientPicture from './MiddleUpperPatientPicture.png';
import MiddleBottomPatientPicture from './MiddleBottomPatientPicture.png';
import RightPatientPicture from './RightPatientPicture.png';

const useStyles = theme => ({
    bigTitle: {
        position: "absolute",
        width: "1287px",
        height: "62px",
        left: "93px",
        top: "176px",

        fontFamily: 'Roboto',
        fontStyle: "inherit",
        fontWeight: 500,
        fontSize: "80px",
        lineHeight: "47px",
        textAlign: "center",
        color: "#000000",
    },

    secondTittle: {
        position: "absolute",
        width: "750px",
        height: "42px",
        left: "362px",
        top: "302px",

        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "32px",
        lineHeight: "38px",
        textAlign: "center",
        color: "#5A5A5A",
    },

    thirdTitle: {
        position: "absolute",
        width: "818px",
        height: "55px",
        left: "305px",
        top: "498px",
        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        lineHeight: "28px",
        textAlign: "center",
    },
    fourthTitle: {
        position: "absolute",
        width: "818px",
        height: "55px",
        left: "305px",
        top: "1058px",
        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        lineHeight: "28px",
        textAlign: "center",
    },

    div: {
        margin: theme.spacing(3, 0, 1, 0),

    },
    // Левая пикча с логотипом
    leftBrain: {
        position: "absolute",
        width: "350px",
        height: "313px",
        left: "15px",
        top: "60.77px",


        transform: "rotate(-46deg)",

    },
    // Правая пикча с логотипом
    rightBrain: {
        position: "absolute",
        width: "350px",
        height: "313px",
        left: "calc(45% - 350px/2 + 652.1px)",
        top: "calc(70% - 313px/2 - 200.5px)",
        transform: "rotate(27deg)",
    },

    leftPatientBox: {
        boxSizing: "border-box",

        position: "absolute",
        width: "377px",
        height: "441px",
        left: "85px",
        top: "561px",

        background: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.5)",
    },

    leftPatientPicture: {
        position: "absolute",
        width: "300px",
        height: "300px",
        left: "130px",
        top: "593px",
    },

    leftPatientText: {
        position: "absolute",
        width: "350px",
        height: "303px",
        left: "98px",
        top: "918px",

        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        lineHeight: "28px",
        textAlign: "center",

        color: "#000000",

    },

    middlePatientBox: {
        boxSizing: "border-box",

        position: "absolute",
        width: "375px",
        height: "443px",
        left: "550px",
        top: "559px",
        background: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.5)",
    },
    middleUpperPatientPicture: {
        position: "absolute",
        width: "350px",
        height: "133px",
        left: "568px",
        top: "593px",
    },
    middleBottomPatientPicture: {
        position: "absolute",
        width: "340px",
        height: "133px",
        left: "573px",
        top: "735px",
    },
    middlePatientText: {
        position: "absolute",
        width: "363px",
        height: "303px",
        left: "556px",
        top: "918px",

        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        lineHeight: "28px",
        textAlign: "center",
    },
    rightPatientBox: {
        boxSizing: "border-box",

        position: "absolute",
        width: "377px",
        height: "441px",
        left: "1003px",
        top: "561px",

        background: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.5)",
    },
    rightPatientPicture: {
        position: "absolute",
        width: "339px",
        height: "284px",
        left: "1020px",
        top: "584px",
    },
    rightPatientText: {
        position: "absolute",
        width: "355px",
        height: "310px",
        left: "1018px",
        top: "920px",

        fontFamily: 'Roboto',
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "24px",
        lineHeight: "28px",
        textAlign: "center",
        color: "#000000",
    }

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
            <Grid container>
                <Paper>
                    <Typography variant={"h4"} className={classes.bigTitle}>
                        Второе мнение по медицинским снимкам
                    </Typography>
                </Paper>

                <Paper>
                    <Typography variant={"h5"} className={classes.secondTittle}>
                        !Ранняя диагностика и правильный диагноз могут спасти вашу жизнь
                    </Typography>
                </Paper>
                <Paper>
                    <Typography variant={"h6"} className={classes.thirdTitle}>
                        Если вы пациент и хотите получить дополнительное мнение по вашему снимку:
                    </Typography>
                </Paper>


                <div>
                    <img src={MirfImage} className={classes.leftBrain}/>
                </div>

                <div/>

                <div>
                    <img src={MirfImage} className={classes.rightBrain}/>
                </div>

                <div/>

                <div className={classes.leftPatientBox}/>
                <div>
                    <img src={LeftPatientPicture} className={classes.leftPatientPicture}/>
                </div>
                <Paper>
                    <Typography variant={"h6"} className={classes.leftPatientText}>
                        Разместите пост на форуме
                    </Typography>
                </Paper>

                <div className={classes.middlePatientBox}/>
                <div>
                    <img src={MiddleUpperPatientPicture} className={classes.middleUpperPatientPicture}/>
                </div>
                <div>
                    <img src={MiddleBottomPatientPicture} className={classes.middleBottomPatientPicture}/>
                </div>
                <Paper>
                    <Typography variant={"h6"} className={classes.middlePatientText}>
                        <a href="#/records/view"> Выберите подходящего врача </a>
                    </Typography>
                </Paper>

                <div className={classes.rightPatientBox}/>
                <div>
                    <img src={RightPatientPicture} className={classes.rightPatientPicture}/>
                </div>
                <Paper>
                    <Typography variant={"h6"} className={classes.rightPatientText}>
                        Получите отчет от искусственного интеллекта
                    </Typography>
                </Paper>

                <Paper>
                    <Typography variant={"h6"} className={classes.fourthTitle}>
                        Если вы врач и хотите помочь другим людям:
                    </Typography>
                </Paper>

            </Grid>


        );


    }


}

export default withStyles(useStyles)(newHome)