import {Card, TextField, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AuthService from "../../services/auth.service";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import GetUser from "../../requests_and_responses/getUser-request"
import CreatableSelect from "react-select/creatable";
import specialtiesList from "../../specialties-of-doctors-and-diagnoses/specialties-of-doctors";
import diagnosesList from "../../specialties-of-doctors-and-diagnoses/diagnoses";
import CreatableSelectSpecialties from "../../specialties-of-doctors-and-diagnoses/creatable-select-specialties";
import CreatableSelectDiagnoses from "../../specialties-of-doctors-and-diagnoses/creatable-select-diagnoses";
const useStyles = theme => ({
    paper: {
        margin: theme.spacing(3, 5, 3, 5),
    },
    button: {
        width: 300,
        margin: theme.spacing(1),
        backgroundColor: '#f50058',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#fff',
        }
    },
    gridCreatableSelectStyle: {
        zIndex: 999999,
    },
    nextGridCreatableSelectStyle: {
        zIndex: 999998,
    }
});

const creatableSelectStyle = {
    control: base => ({
        ...base,
        height: 55,
        minHeight: 55
    })
};

function EditProfile(props) {
    const {classes} = props
    const [user, setUser] = useState(null)
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [patronymic, setPatronymic] = useState("");

    // Only for doctors.
    const [specialization, setSpecialization] = useState([]);
    const [specializedDiagnoses, setSpecializedDiagnoses] = useState([])
    const [workplace, setWorkplace] = useState(null);
    const [education, setEducation] = useState(null);
    const [experience, setExperience] = useState(null);
    const [price, setPrice] = useState(null);

    useEffect(() => {
        let username1 = AuthService.getCurrentUser().username;
        getCurrentUser(username1);
    }, [])


    function editProfilePost() {
        let initials
        if (patronymic !== "") {
            initials = lastname + " " + firstname + " " + patronymic;
        }
        else {
            initials = lastname + " " + firstname;
        }
        if (!isFieldsCorrect()) {
            return;
        }

        let specializationStr = "";
        specialization.forEach(item => specializationStr += (item.value + ', '));
        specializationStr = specializationStr.substring(0, specializationStr.length - 2);

        let specializedDiagnosesStr = "";
        specializedDiagnoses.forEach(item => specializedDiagnosesStr += (item.value + ', '));
        specializedDiagnosesStr = specializedDiagnosesStr.substring(0, specializedDiagnosesStr.length - 2);


        AuthService.editProfile(user.username, firstname, lastname, patronymic, initials, specializationStr, specializedDiagnosesStr, experience, workplace, education, price).then(
            async response => {
                console.log(response.data.message)
            })
            .catch((e) => {
                console.log(e);
            });
    }

    function getCurrentUser(username) {
        GetUser(username).then((result) => {
            setUser(result);
            setFirstname(result.firstname);
            setLastname(result.lastname);
            setPatronymic(result.patronymic);

            if (result.role === "Врач") {
                setExperience(result.experience);
                setWorkplace(result.workplace);
                setEducation(result.education);
                setPrice(result.price);

                let specializationArray = [];
                result.specialization.split(", ").forEach(item => specializationArray.push({ value: item, label: item}));
                setSpecialization(specializationArray);

                let specializedDiagnosesArray = [];
                result.specializedDiagnoses.split(", ").forEach(item => specializedDiagnosesArray.push({ value: item, label: item}));
                setSpecializedDiagnoses(specializedDiagnosesArray);
            }
        })
    }

    function getFieldsForDoctor() {
        if (user.role === "Пользователь") {
            return;
        }
        return (<Grid item container spacing={3}>
                <Grid item xs={12} className={classes.gridCreatableSelectStyle}>
                    {CreatableSelectSpecialties(specialization, setSpecialization)}
                </Grid>
                <Grid item xs={12} className={classes.nextGridCreatableSelectStyle}>
                    {CreatableSelectDiagnoses(specializedDiagnoses, setSpecializedDiagnoses)}
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="experience"
                        label="Стаж"
                        name="experience"
                        autoComplete="on"
                        value={experience}
                        onChange={(e) => {
                            if (isNaN(Number(e.target.value))) {
                                return;
                            }
                            setExperience(e.target.value)
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="workplace"
                        label="Место работы"
                        name="workplace"
                        autoComplete="on"
                        value={workplace}
                        onChange={(e) => setWorkplace(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="education"
                        label="Образование"
                        name="education"
                        autoComplete="on"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="price"
                        label="Цена (RUB)"
                        name="price"
                        autoComplete="on"
                        value={price}
                        onChange={(e) => {
                            if (isNaN(Number(e.target.value))) {
                                return;
                            }
                            setPrice(e.target.value)
                        }}
                    />
                </Grid>
            </Grid>
        )
    }

    function isFieldsCorrect() {
        if (firstname === "" || lastname === "") {
            return false;
        }
        if (user.role === "Пользователь") {
            return true;
        }

        if (experience < 0 ||  experience > 100) {
            return false;
        }

        if (price > 100000) {
            return false;
        }

        if (specialization.length === 0 || specializedDiagnoses.length === 0 || workplace === "" || education === ""
            || workplace === null || education === null) {
            return false;
        }
        return true;
    }

    function getInfoAboutFieldsCorrectness() {
        if (!isFieldsCorrect() && user.role === "Врач") {
            return (<div>Заполните все обязательные поля и укажите корректный стаж с минимальной ценой, за которую вы готовы принять пациента.</div>)
        }
        if (!isFieldsCorrect() && user.role === "Пользователь") {
            return (<div>Заполните все обязательные поля.</div>)
        }
    }

    return (
        user &&
            <Card>
                <div className={classes.paper}>
            <Grid item container spacing={2}>
                <Grid xs={12} item style={{fontSize: "17px"}}>
                    Редактирование профиля:
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="lastname"
                        label="Фамилия"
                        name="lastname"
                        autoComplete="on"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        required
                        variant="outlined"
                        fullWidth
                        id="firstname"
                        label="Имя"
                        name="firstname"
                        autoComplete="on"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        variant="outlined"
                        fullWidth
                        id="patronymic"
                        label="Отчество"
                        name="patronymic"
                        autoComplete="on"
                        value={patronymic}
                        onChange={(e) => setPatronymic(e.target.value)}
                    />
                </Grid>
                {getFieldsForDoctor()}
                <Grid xs={12} item style={{textAlign: 'center'}}>
                    <Button className={classes.button} onClick={editProfilePost}> Сохранить все изменения </Button>
                </Grid>
                <Grid xs={12} item style={{textAlign: 'center'}}>
                    {getInfoAboutFieldsCorrectness()}
                </Grid>
            </Grid>

                </div>
            </Card>
    );

}

export default withStyles(useStyles)(EditProfile)