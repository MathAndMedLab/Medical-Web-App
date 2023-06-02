import { Col } from "react-bootstrap";
import React from 'react'
import {isWidthDown, withStyles} from "@material-ui/core";
import clsx from "clsx"
import { Link } from "react-router-dom";
import {Grid} from "@material-ui/core";

const useStyles = theme => ({
    homeCard: {
        cursor: "pointer",
    },
    homeCardBox: {
        boxShadow: "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
        position: "relative",
        borderRadius: "30px",
        overflow: "hidden",
        "@media (min-width : 0px) and (max-width: 359px)": {
            maxWidth: "280px",
            maxHeight: "208px",
        },
        "@media (min-width: 360px)": {
            width: "330px",
            height: "232px",
        },
        "@media (min-width: 450px)": {
            width: "416px",
            height: "308px",
        },
        
        "&::before": {
          content: '""',
          background: "linear-gradient(90.21deg, #5218a8 -5.91%, #00ffff 111.58%)",
          opacity: 0.85,
          position: "absolute",
          width: "100%",
          height: 0,
          transition: "0.4s ease-in-out",
        },
        "&:hover::before": {
          height: "100%",
        },
        "&:hover": {
          '& $textBox': {
            opacity: 1,
            top: "50%",
          },
        },
    },

    textBox: {
        position: "absolute",
        textAlign: "center",
        top: "65%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        transition: "0.5s ease-in-out",
        opacity: 0,
        width: "100%",
       
    },

    textSelection: {
        color: "#FFF",
    },

    titleText: {
        fontSize: "30px",
        fontWeight: 700,
        letterSpacing: "0.8px",
        lineHeight: "1.1em",
    },

    descriptionText: {
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: "15px",
        letterSpacing: "0.8px",
    },

    imgCard: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
})



function HomeCard(props) {
  const {classes} = props
  const {title} = props
  const {description} = props
  const {status} = props
  const {imgUrl} = props
  const {url} = props
  let isDicom = title === "Получите отчет от искусственного интеллекта"

  const handleClick = (event) => {
    event.preventDefault();
    window.open('http://localhost:3000/local', '_blank');
  };

  function getContent() {
    return(
            <div className={clsx( classes.homeCardBox, classes.homeCard )}>
              <img src={imgUrl} className={classes.imgCard} />
              <div className={classes.textBox}>
                <h4 class={clsx(classes.textSelection, classes.titleText)}>{title}</h4>
                <span class={clsx(classes.textSelection, classes.descriptionText)}>{description}</span>
                <h6 class={classes.textSelection}>{status}</h6>
              </div>
            </div>
    )
  }

  function getCardContent(){
    if (isDicom){
      return(
              <Link href="#" onClick={handleClick} >
                {getContent()}
              </Link>
      );
    }
    else{
      return(
              <Link to={url} >
                {getContent()}
              </Link>
      );
    }
  }


  return(
                getCardContent()
      );
}

export default withStyles(useStyles)(HomeCard)