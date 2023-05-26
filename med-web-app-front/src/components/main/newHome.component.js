import {Component} from "react";
import {Typography} from "@mui/material";
import {Grid, withStyles} from "@material-ui/core";
import Forum from './forum.jpg';
import Doctor from './doctor.jpg';
import AI from './ai.jpg';
import HomeCard from "./HomeCard";
import 'animate.css';
import "@fontsource/unbounded";
import clsx from "clsx"

const useStyles = theme => ({
    root: {
        
        flexGrow: 1,
        overflowX: 'hidden',
        overflowY: 'hidden',
    },

    backgroundImageRight: {
        top: 0,
        position: "absolute",
        width: "100%",
        height: "100%",
        right: 0,
        zIndex: -4,
    },
    
    textSelection: {
        color: "#FFF",
        backgroundColor: "#0049FF",
    },

    boxes: {
        marginTop: theme.spacing(10),
        alignItems:"center",
    },

    bigTitle: {
        [theme.breakpoints.down("xs")]: {
            fontSize: theme.spacing(3.5),
            lineHeight: "27px",
        },
        [theme.breakpoints.between("sm", "md")]: {
            fontSize: theme.spacing(4),
            lineHeight: "37px",
        },
        "@media (min-width: 1280px)": {
            fontSize: theme.spacing(5),
            lineHeight: "47px",
        },
        alignContent: "center",
	    justifyContent: "center",
        margin: 0,
        padding: 0,
        display: "flex",
        fontStyle: "inherit",
        fontWeight: 500,
        textAlign: "center",
        color: "#fff",
    },
    littleTitle: {
        [theme.breakpoints.down("xs")]: {
            lineHeight: "25px",
            fontSize: theme.spacing(1.75),
        },
        [theme.breakpoints.between("sm", "md")]: {
            lineHeight: "30px",
            fontSize: theme.spacing(2),
        },
        "@media (min-width: 1280px)": {
            lineHeight: "34px",
            fontSize: theme.spacing(2.25),
        },
        alignContent: "center",
	    justifyContent: "center",
        margin: 0,
        padding: 0,
        display: "flex",
        fontStyle: "inherit",
        fontWeight: 500,
        textAlign: "center",
    },
    card: {
        "@media (min-width : 0px) and (max-width: 359px)": {
            padding: "0.75rem",
            maxWidth: 280,
        },
        "@media (min-width : 360px)": {
            padding: "1rem",
            width: 330,
        },
        "@media (min-width : 450px)": {
            width: 400,
        },
        "@media (min-width : 600px)": {
            padding: "1.5rem",
            width: 520,
        },
        "@media (min-width : 960px)": {
            width: 880,

        },
        "@media (min-width: 1280px)": {
            width: 1200,
        },
        
        background: "rgba( 255, 255, 255, 0.15 )",
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        backdropFilter: "blur( 18px )",
        borderRadius: "30px",
        
        zIndex: 10,
        color: "whitesmoke",
    },
    mainGrid: {
        marginBottom: theme.spacing(4),
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
        const cards = [
            {
            title: "Разместите пост на форуме",
            description: "Форум",
            status: "Мгновенный отклик от врачей",
            imgUrl: Forum,
            url: "/records/view",
            },
            {
            title: "Выберите подходящего врача",
            description: "Поиск",
            status: "Высококвалифицированные специалисты",
            imgUrl: Doctor,
            url: "/search",
            },
            {
            title: "Получите отчет от искусственного интеллекта",
            description: "DICOM Viewer",
            status: "Нейросеть, обученная на большом объеме данных",
            imgUrl: AI,
            url: "http://localhost:3000/local",
            },
        ];
        const styles = {
            root: {
                fontFamily: 'Unbounded, cursive',
                
            },
        };

        


        return (
            <div className={classes.root}>
                <Grid container direction="column" alignItems="center" justifyContent="center" className={classes.mainGrid}>
                    <Grid container item className={classes.card} direction="column" alignItems="center" justifyContent="center" style={{ gap: 10 }}>
                        <Grid item class="animated-gradient-text">
                            <h2 className={classes.bigTitle} style={styles.root}>Консультации врачей онлайн: получите второе мнение, не покидая дома</h2>
                        </Grid>
                        <Grid item class="gradient-text"  >
                            <h6 className={classes.littleTitle} style={styles.root}>
                                Наш медицинский сайт с консультациями врачей онлайн — это надежный и удобный инструмент для всех, кто хочет получить профессиональное мнение по своему состоянию. 
                                У нас вы можете получить консультацию от опытных и квалифицированных врачей, которые помогут вам разобраться в вашей проблеме и выработать наиболее эффективный план лечения. 
                                Мы понимаем, что ваше здоровье — это самое важное, и поэтому мы предоставляем быстрый и удобный доступ к квалифицированным врачам онлайн. 
                                Не стесняйтесь обращаться к нам, мы всегда готовы помочь!
                            </h6>
                        </Grid>
                        
                    </Grid>
                    
                
                    <Grid container item className={classes.boxes}  alignItems="center" justifyContent="center" style={{ gap: 40 }}>
                        {
                        cards.map((card, index) => {
                            return (<HomeCard
                            key={index}
                            
                            {...card}
                            />
                            
                            )
                        })
                        }
                    </Grid>
                </Grid>
                
            </div>
        );
    }
}

export default withStyles(useStyles)(newHome)