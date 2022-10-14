import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AuthService from "../../services/auth.service";
import {Card, IconButton, InputAdornment, withStyles} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Grid from "@material-ui/core/Grid";
import {Link} from "react-router-dom";

const useStyles = theme => ({
    root: {
        "& .MuiFormLabel-root": {
            margin: 0
        }
    },
    div: {
        margin: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',

    },
    paper: {
        marginTop: theme.spacing(8),
        "@media (max-width: 365px)":{
            width: 260,
        },
        "@media (min-width: 350 px)":{
            width: 300,
        },
        "@media (min-width: 425px)":{
            width: "90%"
        },
        //minWidth: 280,
        minHeight: 300
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(2, 0, 2),
        backgroundColor: '#3f51b5',
    },
});

function Login(props) {
    const {classes} = props


    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [successful, setSuccessful] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    function onChangeUsername(e) {
        setUsername(e.target.value)
    }

    function onChangePassword(e) {
        setPassword(e.target.value)
    }

    function handleLogin(e) {
        e.preventDefault();
        setMessage("")
        setSuccessful(false)

        AuthService.login(username, password).then(
            () => {
                setSuccessful(true)
                props.history.push("/records/view");
                window.location.reload();
            },
            error => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) ||
                    error.message || error.toString();
                setSuccessful(false)
                setMessage(resMessage)
            }
        );

    }

    return (
        <Container component="main" maxWidth="xs">
            <Card className={classes.paper}>
                <div className={classes.div}>
                    <Typography component="h1" variant="h5">
                        Вход
                    </Typography>
                    <form className={classes.form}
                          onSubmit={handleLogin}
                    >
                        <TextField
                            className={classes.root}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="login"
                            label="Логин"
                            name="login"
                            autoComplete="on"
                            autoFocus
                            value={username}
                            onChange={onChangeUsername}
                        />
                        <TextField
                            className={classes.root}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            autoComplete="on"
                            label="Пароль"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={onChangePassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            // onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {/*<FormControlLabel*/}
                        {/*    control={<Checkbox value="remember" color="primary"/>}*/}
                        {/*    label="Запомнить"*/}
                        {/*/>*/}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Войти
                        </Button>
                        {/*<Grid container>*/}
                        {/*    <Grid item xs>*/}
                        {/*        <Link href="#" variant="body2">*/}
                        {/*            Забыли пароль?*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*    <Grid item>*/}
                        {/*        <Link href="#" variant="body2">*/}
                        {/*            {"Нет аккаунта? Зарегистрируйтесь."}*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                        <Grid item>
                            Нет аккаунта?
                            <Link to="/register" style={{marginLeft: 3}}>
                                Зарегистрируйтесь.
                            </Link>
                        </Grid>
                        {message && (
                            <Grid>
                                <Grid
                                    className={
                                        successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {message}
                                </Grid>
                            </Grid>
                        )}
                    </form>
                </div>
            </Card>
        </Container>
    )
}

export default withStyles(useStyles)(Login)