import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import '../../styles/Search.css'
import {Card, FormControl, FormLabel, Radio, RadioGroup, withStyles} from "@material-ui/core"
import AuthService from "../../services/auth.service"
import {TextField, InputAdornment, IconButton} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {Alert} from "@material-ui/lab";
import CreatableSelect from "react-select/creatable";
import specialtiesList from "../../specialties-of-doctors-and-diagnoses/specialties-of-doctors";
import Paper from "@material-ui/core/Paper";
import diagnosesList from "../../specialties-of-doctors-and-diagnoses/diagnoses";
import CreatableSelectDiagnoses from "../../specialties-of-doctors-and-diagnoses/creatable-select-diagnoses";
import CreatableSelectSpecialties from "../../specialties-of-doctors-and-diagnoses/creatable-select-specialties";

// const required = value => {
//     if (!value) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 Нужно заполнить это поле!
//             </div>
//         )
//     }
// }

// const email = value => {
//     if (!isEmail(value)) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 This is not a valid email.
//             </div>
//         )
//     }
// }

const useStyles = theme => ({
    root: {
        "& .MuiFormLabel-root": {
            margin: 0
        },
        display: 'inline-block', 
        wordWrap: 'break-word',
    },
    textInner: {
        marginRight: theme.spacing(8.75)
    },
    div: {
        margin: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(3),
        //minWidth: 200,
        "@media (max-width: 365px)": {
        },
        "@media (min-width: 350 px)": {
        },
        "@media (min-width: 425px)": {
        },
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
        backgroundColor: '#3f51b5',
    },
    formControlLab: {
        marginBottom: theme.spacing(1),
    },
    label: {
        margin: theme.spacing(2, 0, 1),
        color: "black"
    },
    creatableSelectGrid: {
        zIndex: 1001,
    },
    creatableSelectGridNext: {
        zIndex: 1000,
    }
})

const creatableSelectStyle = {
    control: base => ({
        ...base,
        height: 55,
        minHeight: 55
    })
};

function Register(props) {
    const defaultUser = "Пользователь";
    const doctorUser = "Врач";
    const {classes} = props
    const [username, setUsername] = useState("")
    const [firstname, setFirstname] = useState("")
    const [lastname, setLastname] = useState("")
    const [patronymic, setPatronymic] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [chosenRole, setChosenRole] = useState(defaultUser)
    const [successful, setSuccessful] = useState(false)
    const [message, setMessage] = useState("")
    const [loginMessage, setLoginMessage] = useState("")
    const [loginSuccessful, setLoginSuccessful] = useState(false)
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorRepeat, setPasswordErrorRepeat] = useState(false)
    const [validateForm, setValidateForm] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [passwordMatch, setPasswordMatch] = useState(false)

    // Only for doctors.
    const [specialization, setSpecialization] = useState([])
    const [specializedDiagnoses, setSpecializedDiagnoses] = useState([])
    const [experience, setExperience] = useState(null)
    const [experienceCorrectness, setExperienceCorrectness] = useState(true)
    const [workplace, setWorkplace] = useState(null)
    const [education, setEducation] = useState(null)
    const [price, setPrice] = useState(null)
    const [priceCorrectness, setPriceCorrectness] = useState(true)

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);


    function vusername(value) {
        if (value.length < 3 || value.length > 25) {
            setUsernameError(true)
        } else {
            setUsernameError(false)
        }
    }

    function vpassword(value) {
        if (value.length < 6 || value.length > 40) {
            setPasswordError(true)
        } else {
            setPasswordError(false)
        }
        if (value === passwordRepeat) {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        }
    }

    function vpasswordRepeat(value) {
        if (value.length < 6 || value.length > 40) {
            setPasswordErrorRepeat(true)
        } else {
            setPasswordErrorRepeat(false)
        }
        if (value === password) {
            setPasswordMatch(true)
        } else {
            setPasswordMatch(false)
        }
    }

    function onChangeUsername(e) {
        setUsername(e.target.value)
        vusername(e.target.value)
    }

    // onChangeEmail(e) {
    //     this.setState({
    //         email: e.target.value
    //     })
    // }

    function onChangePassword(e) {
        setPassword(e.target.value)
        vpassword(e.target.value)
    }

    function onChangePasswordRepeat(e) {
        setPasswordRepeat(e.target.value)
        vpasswordRepeat(e.target.value)
    }

    function onChangeFirstname(e) {
        setFirstname(e.target.value)
    }

    function onChangeLastname(e) {
        setLastname(e.target.value)
    }

    function onChangePatronymic(e) {
        setPatronymic(e.target.value)
    }

    function onChangeRole(e) {
        if (e.target.value === defaultUser) {
            setExperienceCorrectness(true)
            setPriceCorrectness(true)
        }
        setSpecialization([])
        setSpecializedDiagnoses([])
        setExperience(null)
        setWorkplace(null)
        setEducation(null)
        setPrice(null)
        setChosenRole(e.target.value)
    }

    function onChangeSpecialization(e) {
        setSpecialization(e);
    }

    function onChangeSpecializedDiagnoses(e) {
        setSpecializedDiagnoses(e);
    }

    function onChangeExperience(e) {
        if (!isNaN(Number(e.target.value)) && e.target.value >= 0 && e.target.value <= 100) {
            setExperienceCorrectness(true)
        }
        else {
            setExperienceCorrectness(false)
        }
        setExperience(e.target.value)
    }

    function onChangeWorkplace(e) {
        setWorkplace(e.target.value)
    }

    function onChangeEducation(e) {
        setEducation(e.target.value)
    }

    function onChangePrice(e) {
        if (!isNaN(Number(e.target.value)) && e.target.value >= 0 && e.target.value <= 100000) {
            setPriceCorrectness(true)
        }
        else {
            setPriceCorrectness(false)
        }
        setPrice(e.target.value)
    }

    function handleRegister(e) {
        e.preventDefault()
        setMessage("")
        setSuccessful(false)
        setLoginMessage("")
        setLoginSuccessful(false)

        let initials
        if (patronymic !== "") {
            initials = lastname + " " + firstname + " " + patronymic
        } else {
            initials = lastname + " " + firstname
        }

        let specializationStr = "";
        specialization.forEach(item => specializationStr += (item.value + ', '));
        specializationStr = specializationStr.substring(0, specializationStr.length - 2);

        let specializedDiagnosesStr = "";
        specializedDiagnoses.forEach(item => specializedDiagnosesStr += (item.value + ', '))
        specializedDiagnosesStr = specializedDiagnosesStr.substring(0, specializedDiagnosesStr.length - 2);

        if (!usernameError && !passwordError && passwordMatch && experienceCorrectness && priceCorrectness) {
            AuthService.register(
                username,
                initials,
                firstname,
                lastname,
                patronymic,
                // email,
                password,
                chosenRole,
                // Only for doctors.
                specializationStr,
                specializedDiagnosesStr,
                experience,
                workplace,
                education,
                price
            ).then(
                response => {
                    setMessage(response.data.message)
                    setSuccessful(true)
                    setUsername("")
                    setFirstname("")
                    setLastname("")
                    setPatronymic("")
                    setPassword("")
                    setPasswordRepeat("")
                    setChosenRole(defaultUser)
                    AuthService.login(username, password).then(
                        () => {
                            setLoginSuccessful(true)
                            props.history.push("/records/view");
                            window.location.reload();
                        },
                        error => {
                            const resLoginMessage =
                                (error.response && error.response.data && error.response.data.message) ||
                                error.message || error.toString();
                            setLoginSuccessful(false)
                            setLoginMessage(resLoginMessage)
                        }
                    )
                },
                error => {
                    const resMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message || error.toString()
                    setSuccessful(false)
                    setMessage(resMessage)
                }
            )
        }
    }

    function getGridsForDoctorRole() {
        if (chosenRole === defaultUser) {
            return;
        }

        return (
            <span>
                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.creatableSelectGrid}>
                            {CreatableSelectSpecialties(specialization, onChangeSpecialization)}
                    </Grid>
                    <Grid item xs={12} className={classes.creatableSelectGridNext}>
                           {CreatableSelectDiagnoses(specializedDiagnoses, onChangeSpecializedDiagnoses)}
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            className={classes.root}
                            variant="outlined"
                            fullWidth
                            id="experience"
                            label="Стаж (лет)"
                            name="experience"
                            autoComplete="on"
                            value={experience}
                            error={!experienceCorrectness}
                            helperText={"Стаж должен быть в пределах от 1 до 100 (если ваш стаж меньше года, то укажите 0)"}
                            onChange={onChangeExperience}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            className={classes.root}
                            variant="outlined"
                            fullWidth
                            id="workplace"
                            label="Место работы"
                            name="workplace"
                            autoComplete="on"
                            value={workplace}
                            onChange={onChangeWorkplace}
                        />
                        </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            className={classes.root}
                            variant="outlined"
                            fullWidth
                            id="education"
                            label="Образование"
                            name="education"
                            autoComplete="on"
                            value={education}
                            onChange={onChangeEducation}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            className={classes.root}
                            variant="outlined"
                            fullWidth
                            id="price"
                            label="Цена (RUB)"
                            name="price"
                            autoComplete="on"
                            value={price}
                            error={!priceCorrectness}
                            helperText={"Минимальная стоимость обращения пациента (в пределах от 0 до 100000 ₽)"}
                            onChange={onChangePrice}
                        />
                    </Grid>
                </Grid>
            </span>)
    }

    return (
        <Container component="main" maxWidth="sm" disableGutters={true}>
            <Card className={classes.paper}>
                <Grid className={classes.div}>
                    <Typography component="h1" variant="h5">
                        Регистрация
                    </Typography>
                    <form className={classes.form}
                          onSubmit={handleRegister}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    className={classes.root}
                                    variant="outlined"
                                    fullWidth
                                    id="lastName"
                                    label="Фамилия"
                                    name="lastName"
                                    autoFocus
                                    autoComplete="on"
                                    value={lastname}
                                    onChange={onChangeLastname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    className={classes.root}
                                    autoComplete="on"
                                    name="firstName"
                                    variant="outlined"
                                    fullWidth
                                    id="firstName"
                                    label="Имя"
                                    value={firstname}
                                    onChange={onChangeFirstname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className={classes.root}
                                    variant="outlined"
                                    fullWidth
                                    id="patronymic"
                                    label="Отчество"
                                    name="patronymic"
                                    autoComplete="on"
                                    value={patronymic}
                                    onChange={onChangePatronymic}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    className={classes.root}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Логин"
                                    name="username"
                                    autoComplete="on"
                                    error={usernameError}
                                    helperText={usernameError && "Логин должен быть не менее 3 символов"}
                                    value={username}
                                    onChange={onChangeUsername}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.textInner}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Пароль"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    autoComplete="off"
                                    error={passwordError}
                                    helperText={passwordError && "Пароль должен быть не менее 6 символов"}
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

                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    className={classes.root}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="passwordRepeat"
                                    label="Подтвердите пароль"
                                    type={showPassword ? "text" : "password"}
                                    id="passwordRepeat"
                                    autoComplete="off"
                                    error={passwordErrorRepeat}
                                    helperText={passwordErrorRepeat && "Пароль должен быть не менее 6 символов"}
                                    value={passwordRepeat}
                                    onChange={onChangePasswordRepeat}
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
                            </Grid>

                            <Grid item xs={12}>
                                {!passwordMatch && password.length > 0 && passwordRepeat.length > 0 &&
                                    <Alert className={classes.alrt} variant="outlined" severity="error">
                                        Пароли не совпадают
                                    </Alert>}
                            </Grid>
                            {/*<Grid item xs={12}>*/}
                            {/*    <FormControlLabel*/}
                            {/*        control={<Checkbox value="allowExtraEmails" color="primary"/>}*/}
                            {/*        label="I want to receive inspiration, marketing promotions and updates via email."*/}
                            {/*    />*/}
                            {/*</Grid>*/}
                        </Grid>
                        {getGridsForDoctorRole()}
                        <FormLabel className={classes.label}>Выберите роль:</FormLabel>
                        <FormControl>
                            <RadioGroup value={chosenRole} onChange={onChangeRole}>
                                <FormControlLabel className={classes.formControlLab}
                                                  control={<Radio color="primary"/>}
                                                  value="Пользователь"
                                                  label="Пользователь"
                                                  title={"Пользователь"}
                                />
                                <FormControlLabel className={classes.formControlLab}
                                                  control={<Radio color="primary"/>}
                                                  value="Врач"
                                                  label="Врач"
                                                  labelPlacement='end'
                                                  title={"Врач"}
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            //onClick={handleRegister}
                            className={classes.submit}
                            title={"Зарегистрироваться"}
                        >
                            Зарегистрироваться
                        </Button>
                        {/*<Grid container justifyContent="flex-end">*/}
                        {/*    <Grid item>*/}
                        {/*        <Link href="#" variant="body2">*/}
                        {/*            Already have an account? Sign in*/}
                        {/*        </Link>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
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
                        {loginMessage && (
                            <Grid>
                                <Grid
                                    className={
                                        loginSuccessful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {loginMessage}
                                </Grid>
                            </Grid>
                        )}
                    </form>
                </Grid>
            </Card>
        </Container>
    )

}

export default withStyles(useStyles)(Register)