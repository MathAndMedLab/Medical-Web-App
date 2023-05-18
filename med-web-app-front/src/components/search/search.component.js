import React, {Component} from "react";
import '../../styles/Search.css'
import UserService from "../../services/user.service";
import UserCard from "./search-user-card.component";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    FormControl, FormLabel, Grid, IconButton, InputAdornment, Radio, RadioGroup, TextField, withStyles
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SearchIcon from '@material-ui/icons/Search';
import CreatableSelect from "react-select/creatable";
import specialtiesList from "../../specialties-of-doctors-and-diagnoses/specialties-of-doctors"
import GetAllReviews from "../../requests_and_responses/review-request";
import GetAvgRating from "../../avg_rating/get-avg-rating";
import diagnosesList from "../../specialties-of-doctors-and-diagnoses/diagnoses";
import CreatableSelectSpecialties from "../../specialties-of-doctors-and-diagnoses/creatable-select-specialties";
import CreatableSelectDiagnoses from "../../specialties-of-doctors-and-diagnoses/creatable-select-diagnoses";

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: "#e0e0e0",

        },

        height: 190
    },
}))(TableRow);

const useStyles = theme => ({
    root: {
        "& .MuiPaper-root": {
            width: 800, 
            backgroundColor: '#ffffff'

        }, 
        
        "& .MuiTableRow-root": {
            color: "black",
        }
    },

    input: {
        [theme.breakpoints.down("xs")]: {
            width: 285,
        },

         [theme.breakpoints.between("sm", "md")]: {
            width: 650
        }, 
        
        "@media (min-width : 1280px)": {
            width: 800,
        },

        marginBottom: theme.spacing(1.5),
        
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },

    header: {
        backgroundColor: '#3f51b5', 
        color: 'white',
        [theme.breakpoints.down("xs")]: {
            fontSize: 13,
        }, 

        [theme.breakpoints.between("sm", "md")]: {
            fontSize: 17,
        },

        "@media (min-width : 1280px)": {
            fontSize: 17,
        },
    },

    table: {
        width: 800,
    },

    formControlLab: {
        marginBottom: theme.spacing(0), 
        marginTop: theme.spacing(0)
    },

    label: {
        margin: theme.spacing(2, 0, 1), 
        color: "black"
    },
    
    button: {
        height: 55
    },

    inputAdornment: {
        marginRight: theme.spacing(-1.8),
    },

    mainGrid: {
        display: 'flex',
    },

    paper: {
        marginLeft: 50, 
        paddingLeft: 10, 
        paddingTop: 10, 
        paddingRight: 10, 
        paddingBottom: 10,
        width: "275px"
    },

    
});


class Search extends Component {
    constructor(props) {
        super(props);
        this.getUsers = this.getUsers.bind(this);
        this.onChangeSearchString = this.onChangeSearchString.bind(this);
        this.onChangeParamsTypeSearch = this.onChangeParamsTypeSearch.bind(this);
        this.onChangeParamsRoleSearch = this.onChangeParamsRoleSearch.bind(this);
        this.onChangeMaxPrice = this.onChangeMaxPrice.bind(this);
        this.onChangeSelectedSpecialties = this.onChangeSelectedSpecialties.bind(this);
        this.onChangeMinExperience = this.onChangeMinExperience.bind(this);
        this.onChangeMinPrice = this.onChangeMinPrice.bind(this);
        this.onChangeUsersSortType = this.onChangeUsersSortType.bind(this);
        this.sortUsers = this.sortUsers.bind(this);
        this.removeDoctorsByCriteria = this.removeDoctorsByCriteria.bind(this);
        this.getReviewsAndCallSort = this.getReviewsAndCallSort.bind(this);
        this.onChangeSpecializedDiagnoses = this.onChangeSpecializedDiagnoses.bind(this);
        this.state = {
            searchParamsType: "login",
            searchParamsRole: "Все",
            usersSortType: "alphabet",
            searchString: "",
            users: [],
            minPrice: 0,
            maxPrice: 100000,
            minExperience: 0, // Минимальный стаж врача.
            selectedSpecialties: [],
            specializedDiagnoses: [],
            usersReviewsIndexes: [],
            usersReviews: [],
            isSorted: false
        };
    }

    onChangeMinExperience(e) {
        if (isNaN(e.target.value)) {
            return;
        }
        this.setState({
            minExperience: e.target.value
        });
    }

    onChangeSelectedSpecialties(e) {
        this.setState({
            selectedSpecialties: e
        });
    }

    onChangeSpecializedDiagnoses(e) {
        this.setState({
            specializedDiagnoses: e
        });
    }

    onChangeMinPrice(e) {
        if (isNaN(e.target.value)) {
            return;
        }
        this.setState({
            minPrice: e.target.value
        });
    }

    onChangeMaxPrice(e) {
        if (isNaN(e.target.value)) {
            return;
        }
        this.setState({
            maxPrice: e.target.value
        });
    }

    onChangeSearchString(e) {
        const searchString = e.target.value;
        this.setState({
            searchString: searchString,
        });
    }

    onChangeParamsTypeSearch(e) {
        this.setState({
            searchParamsType: e.target.value
        });
    }

    onChangeUsersSortType(e) {
        this.setState({
            usersSortType: e.target.value
        })
    }

    sortUsers() {
        let usersReviewsIndexes1 = this.state.usersReviewsIndexes
        let usersReviews1 = this.state.usersReviews;
        let usersSortType1 = this.state.usersSortType;
        if (usersSortType1 === "alphabet") {
            this.state.users.sort(function alphabetUsersSort(a, b) {
                if (a.lastname < b.lastname) {
                    return -1;
                }
                if (a.lastname > b.lastname) {
                    return 1;
                }
                if (a.firstname < b.firstname) {
                    return -1;
                }
                if (a.firstname > b.firstname) {
                    return 1;
                }
                return 0;
            })
        } else {
            this.state.users.sort(function ratingUsersSort(a, b) {
                let aIndex = -1;
                let aIndexFound = false;
                let bIndex = -1;
                let bIndexFound = false;
                for (let i = 0; i < usersReviewsIndexes1.length; i++) {
                    if (usersReviewsIndexes1[i] === a.id) {
                        aIndex = i;
                        aIndexFound = true;
                    }
                    if (usersReviewsIndexes1[i] === b.id) {
                        bIndex = i;
                        bIndexFound = true;
                    }
                    if (aIndexFound && bIndexFound) {
                        break;
                    }
                }
                let aReviews = usersReviews1[aIndex];
                let bReviews = usersReviews1[bIndex];

                if (usersSortType1 === "rating") {
                    if (GetAvgRating(aReviews, aReviews.length) < GetAvgRating(bReviews, bReviews.length)) {
                        return 1;
                    }
                    if (GetAvgRating(aReviews, aReviews.length) > GetAvgRating(bReviews, bReviews.length)) {
                        return -1;
                    }
                    return 0;
                }

                // usersSortType1 === "reviewsCounter" right here.
                if (aReviews.length < bReviews.length) {
                    return 1;
                }
                if (aReviews.length > bReviews.length) {
                    return -1;
                }
                return 0;
            });
        }

        this.setState({
            isSorted: true
        });
    }

    onChangeParamsRoleSearch(e) {
        this.setState({
            searchParamsRole: e.target.value
        });
    }

    removeDoctorsByCriteria(users) {

        for (let i = 0; i < users.length; i++) {

            let doctorsSpecializations = users[i].specialization.split(', ');
            let doctorsDiagnoses = users[i].specializedDiagnoses.split(', ');

            let isDoctorWithSelectedSpecialties = true;
            if (this.state.selectedSpecialties.length !== 0) {
                isDoctorWithSelectedSpecialties = false;
                this.state.selectedSpecialties.forEach((item) => {
                    doctorsSpecializations.forEach((i) => {
                        if (i === item.value)
                        {
                            isDoctorWithSelectedSpecialties = true;
                        }
                    });
                })
            }

            let isDoctorWithSelectedDiagnoses = true;
            if (this.state.specializedDiagnoses.length !== 0) {
                isDoctorWithSelectedDiagnoses = false;
                this.state.specializedDiagnoses.forEach((item) => {
                    doctorsDiagnoses.forEach((i) => {
                        if (i === item.value)
                        {
                            isDoctorWithSelectedDiagnoses = true;
                        }
                    });
                })

            }

            if (!isDoctorWithSelectedSpecialties || !isDoctorWithSelectedDiagnoses) {
                users.splice(i, 1);
                i--;
            }
            // Удаление врачей с ценой выше максимума и ниже минимума.
            else if (users[i].price > this.state.maxPrice || users[i].price < this.state.minPrice) {
                users.splice(i, 1);
                i--;
            }
            // Удаление врачей со стажем ниже минимального.
            else if (users[i].experience < this.state.minExperience) {
                users.splice(i, 1);
                i--;
            }
        }
        return users;
    }

    getUsers() {

        this.setState({
            isSorted: false,
            usersReviewsIndexes: [],
            usersReviews: [],
        });
        const {searchString} = this.state
        if (this.state.searchParamsType === "login" && this.state.searchParamsRole === "Все") {
            UserService.getAllByUsername(searchString)
                .then(async (response) => {
                    const users = response.data;
                    this.refreshList();
                    this.setState({
                        users: users,
                    });

                    this.getReviewsAndCallSort(users, this.sortUsers);

                })
                .catch((e) => {
                    console.log(e);
                });
        } else if (this.state.searchParamsType === "login") {
            UserService.getByUsername(searchString, this.state.searchParamsRole)
                .then((response) => {
                    const users = (this.state.searchParamsRole === "Врач") ? this.removeDoctorsByCriteria(response.data) : response.data;
                    this.refreshList();
                    this.setState({
                        users: users,
                    });
                    this.getReviewsAndCallSort(users, this.sortUsers);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else if (this.state.searchParamsType === "initials" && this.state.searchParamsRole === "Все") {
            UserService.getAllByInitials(searchString)
                .then((response) => {
                    const users = response.data;
                    this.refreshList();
                    this.setState({
                        users: users,
                    });
                    this.getReviewsAndCallSort(users, this.sortUsers);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            UserService.getByInitials(searchString, this.state.searchParamsRole)
                .then((response) => {
                    const users = (this.state.searchParamsRole === "Врач") ? this.removeDoctorsByCriteria(response.data) : response.data;
                    this.refreshList();
                    this.setState({
                        users: users,
                    });
                    this.getReviewsAndCallSort(users, this.sortUsers);
                })
                .catch((e) => {
                    console.log(e);
                });
        }

    }

    async getReviewsAndCallSort(users, sortCallback) {
        let promise = new Promise(async (resolve, _) => {
            for (let i = 0; i < users.length; i++) {
                this.setState({usersReviewsIndexes: ([...this.state.usersReviewsIndexes, ...[users[i].id]])});
                await GetAllReviews(users[i].id)
                    .then((r) => {
                        this.setState({usersReviews: ([...this.state.usersReviews, ...[r]])});
                    })
                if (i === users.length - 1) {
                    resolve(true);
                }
            }
        });
        const _ = await promise;
        sortCallback();

    }

    refreshList() {
        this.setState({
            users: [],
        });
    }

    componentDidMount() {
        this.getUsers();
    }

    printSearchParamsAboutDoctors(classes) {
        if (this.state.searchParamsRole === "Врач") {
            return (<Grid container item style={{ gap: 40 }}>
                        <Paper className={classes.paper}>
                            <FormLabel className={classes.label} style={{textAlign: "center"}}>
                            Специальность:
                            </FormLabel>
                                {CreatableSelectSpecialties(this.state.selectedSpecialties, this.onChangeSelectedSpecialties)}
                            <FormLabel className={classes.label} style={{textAlign: "center"}}>
                            Ваш диагноз:
                            </FormLabel>
                                {CreatableSelectDiagnoses(this.state.specializedDiagnoses, this.onChangeSpecializedDiagnoses)}
                            <br/>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid className={classes.mainGrid} container direction="column" justifyContent="center" alignItems="center">
                                <FormLabel className={classes.label}>
                                Стаж: от <input required minLength="3" maxLength="8" size="8" value={this.state.minExperience}
                                                onChange={this.onChangeMinExperience}/> лет
                                    </FormLabel>
                                    <Grid style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50}}>
                                        <input id="price_slider" style={{
                                                background: `linear-gradient(to right, #f50057 0% ${this.state.minExperience * 100 / 30}%, #ffffff ${this.state.minExperience * 100 / 30}%)`,
                                                border: 'solid 1px #82CFD0',
                                                borderRadius: '8px',
                                                height: '7px',
                                                width: '225px',
                                                WebkitAppearance: 'none',
                                                margin: "0 auto",
                                            }} min="0" max="30" step="1" type="range" value={this.state.minExperience}
                                                onChange={this.onChangeMinExperience}/> 
                                    </Grid>
                                
                            </Grid>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Grid className={classes.mainGrid} container direction="column" justifyContent="center" alignItems="center">
                                <FormLabel className={classes.label}>
                                    Цена: от <input required minLength="3" maxLength="8" size="8" value={this.state.minPrice}
                                                onChange={this.onChangeMinPrice}/> ₽
                                </FormLabel>
                                <Grid style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50}}>
                                    <input id="price_slider" style={{
                                        background: `linear-gradient(to right, #f50057 0% ${this.state.minPrice * 100 / 100000}%, #ffffff ${this.state.minPrice * 100 / 100000}%)`,
                                        border: 'solid 1px #82CFD0',
                                        borderRadius: '8px',
                                        height: '7px',
                                        width: '225px',
                                        WebkitAppearance: 'none',
                                        margin: "0 auto",
                                    }} min="0" max="100000" step="100" type="range" value={this.state.minPrice}
                                        onChange={this.onChangeMinPrice}/>
                                </Grid>
                                <FormLabel className={classes.label}>
                                    Цена: до <input required minLength="3" maxLength="8" size="8" value={this.state.maxPrice}
                                                onChange={this.onChangeMaxPrice}/> ₽
                                </FormLabel>
                                <Grid style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50}}>
                                    <input id="price_slider" style={{
                                        background: `linear-gradient(to right, #f50057 0% ${this.state.maxPrice * 100 / 100000}%, #ffffff ${this.state.maxPrice * 100 / 100000}%)`,
                                        border: 'solid 1px #82CFD0',
                                        borderRadius: '8px',
                                        height: '7px',
                                        width: '225px',
                                        WebkitAppearance: 'none',
                                        margin: "0 auto",
                                    }} min="0" max="100000" step="100" type="range" value={this.state.maxPrice}
                                        onChange={this.onChangeMaxPrice}/>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

            )
        }
    }

    render() {
        const {classes} = this.props;
        return (<Grid className={classes.mainGrid}>
            <Grid>
                <div className="div-search">
                    {/*<form className="form-search">*/}
                    <TextField
                        className={classes.input}
                        fullWidth
                        id="content"
                        label="Искать здесь..."
                        name="content"
                        autoComplete="off"
                        variant="outlined"
                        type="text"
                        value={this.state.searchString}
                        onChange={this.onChangeSearchString}
                        InputProps={{
                            endAdornment: <InputAdornment position="end" className={classes.inputAdornment}>
                                {/*<Button*/}
                                {/*    className={classes.button}*/}
                                {/*    variant="contained"*/}
                                {/*    color="primary"*/}
                                {/*    onClick={this.getUsers}*/}
                                {/*>*/}
                                {/*    /!*<i className="fa fa-search" aria-hidden="true"/>*!/*/}
                                {/*    <SearchIcon style={{color: "white"}}/>*/}
                                {/*</Button>*/}
                                <IconButton onClick={this.getUsers} title={"Найти"}>
                                    <SearchIcon/>
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    {/*<input className="input-search"
                               type="text"
                               placeholder="Искать здесь..."
                               value={this.state.searchString}
                               onChange={this.onChangeUsername}
                        />
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                                onClick={this.getUsers}
                        >
                            <i className="fa fa-search" aria-hidden="true"/>
                            <SearchIcon style={{color: "white"}}/>
                        </Button>
                        </form>*/}
                </div>
                <Grid className={classes.mainGrid}>
                    <Grid>
                        <Grid className={classes.root}>
                            <TableContainer component={Paper}>
                                <Table className={classes.table} aria-label="spanning table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className={classes.header} align={"center"}>
                                                Фотография
                                            </TableCell>
                                            <TableCell className={classes.header} align={"center"}>
                                                ФИО
                                            </TableCell>
                                            <TableCell className={classes.header} align={"center"}>
                                                Логин
                                            </TableCell>
                                            <TableCell className={classes.header} align={"center"}>
                                                Роль
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.isSorted && this.state.users && this.state.users.map((user, index) => (
                                            <StyledTableRow
                                                key={index}
                                            >
                                                <UserCard user={user}/>
                                            </StyledTableRow>))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Grid>
                        {/*<div className="div-search">*/}
                        {/*</div>*/}
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="column" style={{ gap: 40 }}>
                <Grid container item style={{ gap: 40 }}>
                    <Paper className={classes.paper}>
                        <FormLabel className={classes.label} style={{textAlign: "center"}}>Параметры поиска:</FormLabel>
                        <Grid className={classes.mainGrid}>
                            <FormControl>
                                <RadioGroup value={this.state.searchParamsRole}
                                            onChange={this.onChangeParamsRoleSearch}>
                                    <FormControlLabel className={classes.formControlLab}
                                                    control={<Radio/>}
                                                    value="Все"
                                                    label="по всем"
                                    />
                                    {/*<FormControlLabel className={classes.formControlLab}*/}
                                    {/*                  control={<Radio/>}*/}
                                    {/*                  value="Пользователь"*/}
                                    {/*                  label="по пользователям"*/}
                                    {/*                  labelPlacement='end'*/}
                                    {/*/>*/}
                                    <FormControlLabel className={classes.formControlLab}
                                                    control={<Radio/>}
                                                    value="Врач"
                                                    label="по врачам"
                                                    labelPlacement='end'
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Paper>
                    <Paper className={classes.paper}>
                        <FormLabel className={classes.label} style={{textAlign: "center"}}>
                            Сортировать по:
                        </FormLabel>
                        <Grid className={classes.mainGrid}>
                            <FormControl>
                                <RadioGroup value={this.state.usersSortType}
                                            onChange={this.onChangeUsersSortType}>
                                    <FormControlLabel className={classes.formControlLab}
                                                    control={<Radio/>}
                                                    value="alphabet"
                                                    label="по алфавиту"
                                    />
                                    <FormControlLabel className={classes.formControlLab}
                                                    control={<Radio/>}
                                                    value="rating"
                                                    label="по рейтингу"
                                    />
                                    <FormControlLabel className={classes.formControlLab}
                                                    control={<Radio/>}
                                                    value="reviewsCounter"
                                                    label="по количеству отзывов"
                                                    labelPlacement='end'
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Paper>
                    <Paper className={classes.paper}>
                        <FormLabel className={classes.label} style={{textAlign: "center"}}>
                            Искать по:
                        </FormLabel>
                        <Grid className={classes.mainGrid}>
                            <FormControl>
                                <RadioGroup value={this.state.searchParamsType}
                                            onChange={this.onChangeParamsTypeSearch}>
                                    <FormControlLabel className={classes.formControlLab}
                                                    control={<Radio/>}
                                                    value="login"
                                                    label="по логину"
                                    />
                                    <FormControlLabel className={classes.formControlLab}
                                                    control={<Radio/>}
                                                    value="initials"
                                                    label="по фамилии и имени"
                                                    labelPlacement='end'
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Paper>
                </Grid>
                
                {this.printSearchParamsAboutDoctors(classes)}
            </Grid>
        </Grid>);
    }
}

export default withStyles(useStyles)(Search)