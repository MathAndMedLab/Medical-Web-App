import {Component} from "react";
import {Typography} from "@mui/material";
import {Grid, Paper, withStyles} from "@material-ui/core";
import MirfImage from './MirfImage.png';
import Leftpicture from './LeftPicture.png';
import UpPic from './UpperPicture.png';
import BotPic from './BottomPicture.png';
import RightPic from './RightPicture.png';

const useStyles = theme => ({
    bigTitle:{
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
    secondTittle:{
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
    thirdTitle:{
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
    div: {
        margin: theme.spacing(3, 0, 1, 0),

    },
    leftBrain:{
        position: "absolute",
        width: "350px",
        height: "313px",
        left: "15px",
        top: "60.77px",


        transform: "rotate(-46deg)",

    },
    leftRectangle:{
        position: "absolute",
        width: "188.43px",
        height: "87.49px",
        left: "131px",
        top: "320.13px",

        background: "#f8f9fa",
        transform: "rotate(-48.5deg)",
    },
    rightBrain:{
        position: "absolute",
        width: "350px",
        height: "313px",
        left: "calc(45% - 350px/2 + 652.1px)",
        top: "calc(70% - 313px/2 - 200.5px)",
        transform: "rotate(27deg)",
    },
    rightRectangle:{
        position: "absolute",
        width: "208px",
        height: "116px",
        left: "1060.74px",
        top: "350px",

        background: "#f8f9fa",
        transform: "rotate(31deg)",
    },
    leftBox:{
        boxSizing: "border-box",

        position: "absolute",
        width: "377px",
        height: "441px",
        left: "85px",
        top: "561px",

        background:"#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.5)",
    },
    leftPicture:{
        position: "absolute",
        width: "300px",
        height: "300px",
        left: "130px",
        top: "593px",
    },
    leftWords:{
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
    centerBox:{
        boxSizing: "border-box",

        position: "absolute",
        width: "375px",
        height: "443px",
        left: "550px",
        top: "559px",
        background: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.5)",
    },
    centerUpPic:{
        position: "absolute",
        width: "350px",
        height: "133px",
        left: "568px",
        top: "593px",
    },
    centerBotPic:{
        position: "absolute",
        width: "340px",
        height: "133px",
        left: "573px",
        top: "735px",
    },
    centerText:{
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
    rightBox:{
        boxSizing: "border-box",

        position: "absolute",
        width: "377px",
        height: "441px",
        left: "1003px",
        top: "561px",

        background: "#FFFFFF",
        border: "1px solid rgba(0, 0, 0, 0.5)",
    },
    rightPicture:{
        position: "absolute",
        width: "339px",
        height: "284px",
        left: "1020px",
        top: "584px",
    },
    rightText:{
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



class newHome extends Component{
    constructor(props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    render(){
        const {classes} = this.props;
        return (
            <Grid container>
                <Paper>
                <Typography variant={"h4"} className={classes.bigTitle}>
                    Второе мнение по медицинским снимкам
                </Typography>
                </Paper>

                <Paper>
                <Typography variant = {"h5"} className = {classes.secondTittle}>
                    Ранняя диагностика и правильный диагноз могут спасти вашу жизнь
                </Typography>
                </Paper>

                <Paper>
                    <Typography variant = {"h6"} className = {classes.thirdTitle}>
                        Как получить дополнительное мнение по вашему снимку?
                    </Typography>
                </Paper>


                <div>
                    <img src={MirfImage} className={classes.leftBrain}/>
                </div>

                <div className={classes.leftRectangle}/>

                <div>
                    <img src={MirfImage} className={classes.rightBrain}/>
                </div>

                <div className={classes.rightRectangle}/>

                <div className={classes.leftBox}/>
                <div>
                    <img src={Leftpicture} className={classes.leftPicture}/>
                </div>
                <Paper>
                    <Typography variant = {"h6"} className = {classes.leftWords}>
                        Разместите пост на форуме
                    </Typography>
                </Paper>






                <div className={classes.centerBox}/>
                <div>
                    <img src={UpPic} className={classes.centerUpPic}/>
                </div>
                <div>
                    <img src={BotPic} className={classes.centerBotPic}/>
                </div>
                <Paper>
                    <Typography variant = {"h6"} className = {classes.centerText}>
                        Выберите подходящего врача
                    </Typography>
                </Paper>




                <div className={classes.rightBox}/>
                <div>
                    <img src={RightPic} className={classes.rightPicture}/>
                </div>
                <Paper>
                    <Typography variant = {"h6"} className = {classes.rightText}>
                        Получите отчет от искусственного интеллекта
                    </Typography>
                </Paper>

            </Grid>


        );


    }





}
export default withStyles(useStyles)(newHome)