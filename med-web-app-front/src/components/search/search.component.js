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
    FormControl,
    FormLabel,
    Grid, IconButton,
    InputAdornment,
    Radio,
    RadioGroup,
    TextField,
    withStyles
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import SearchIcon from '@material-ui/icons/Search';
import CreatableSelect from "react-select/creatable";
import specialtiesList from "./../../specialties-of-doctors/specialties-of-doctors"


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
        paddingTop: 3,
        paddingRight: 25,
        marginTop: 0,
    },
    nextPaper: {
        marginLeft: 50,
        paddingLeft: 10,
        paddingTop: 3,
        paddingRight: 25,
        marginTop: 15,
        paddingBottom: 3
    }
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
        this.state = {
            searchParamsType: "login",
            searchParamsRole: "Все",
            searchString: "",
            users: [],
            maxPrice: 100000,
            minExperience: 0, // Минимальный стаж врача.
            selectedSpecialties: []
        };
    }

    onChangeMinExperience(e) {
        this.setState({
            minExperience: e.target.value
        });
    }

    onChangeSelectedSpecialties(e) {
        this.setState({
            selectedSpecialties: e
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

    onChangeParamsRoleSearch(e) {
        this.setState({
            searchParamsRole: e.target.value
        });
    }

    removeDoctorsWithExpensivePrices(users) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].price > this.state.maxPrice) {

                users.splice(i, 1);
                i--;
            }
        }
        return users;
    }

    getUsers() {
        const {searchString} = this.state
        if (this.state.searchParamsType === "login" && this.state.searchParamsRole === "Все") {
            UserService.getAllByUsername(searchString)
                .then((response) => {
                    const users = response.data;
                    this.refreshList();
                    this.setState({
                        users: users,
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        } else if (this.state.searchParamsType === "login") {
            UserService.getByUsername(searchString, this.state.searchParamsRole)
                .then((response) => {
                    const users = (this.state.searchParamsRole === "Врач") ? this.removeDoctorsWithExpensivePrices(response.data) : response.data;
                    this.refreshList();
                    this.setState({
                        users: users,
                    });
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
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            UserService.getByInitials(searchString, this.state.searchParamsRole)
                .then((response) => {
                    const users = (this.state.searchParamsRole === "Врач") ? this.removeDoctorsWithExpensivePrices(response.data) : response.data;
                    this.refreshList();
                    this.setState({
                        users: users,
                    });
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }

    refreshList() {
        this.setState({
            users: [],
        });
    }

    componentDidMount() {
        this.getUsers();
    }

    printSearchParamsAboutDoctors(nextPaperClass, labelClass) {
        if (this.state.searchParamsRole === "Врач") {
            return (
                <span>
                <Paper className={nextPaperClass}>
                    <Grid>
                        <FormLabel className={labelClass}>
                        Цена: до <input required minLength="3" maxLength="8" size="8" value={this.state.maxPrice}
                                          onChange={this.onChangeMaxPrice}/> ₽
                            </FormLabel>
                        <input id="price_slider" style={{
                            background: `linear-gradient(to right, #f50057 0% ${this.state.maxPrice * 100 / 100000}%, #ffffff ${this.state.maxPrice * 100 / 100000}%)`,
                            border: 'solid 1px #82CFD0',
                            borderRadius: '8px',
                            height: '7px',
                            width: '285px',
                            WebkitAppearance: 'none'
                        }} min="0" max="100000" step="100" type="range" value={this.state.maxPrice}
                               onChange={this.onChangeMaxPrice}/>
                    </Grid>
                </Paper>
                    <Paper className={nextPaperClass}>
                        <FormLabel className={labelClass}>
                        Специальность:
                        </FormLabel>
                            <CreatableSelect
                                placeholder="Выберите врача..."
                                formatCreateLabel={(unknownSpeciality) => `Искать ${unknownSpeciality}`}
                                noOptionsMessage={() => "Выбраны все специальности."}
                                options={specialtiesList}
                                value={this.state.selectedSpecialties}
                                onChange={this.onChangeSelectedSpecialties}
                                isSearchable={true}
                                isMulti
                            />
                        <br/>
                    </Paper>
                    <Paper className={nextPaperClass}>
                    <Grid>
                        <FormLabel className={labelClass}>
                        Стаж: от <input required minLength="3" maxLength="8" size="8" value={this.state.minExperience}
                                        onChange={this.onChangeMinExperience}/> лет
                            </FormLabel>
                        <input id="price_slider" style={{
                            background: `linear-gradient(to right, #f50057 0% ${this.state.minExperience * 100 / 30}%, #ffffff ${this.state.minExperience * 100 / 30}%)`,
                            border: 'solid 1px #82CFD0',
                            borderRadius: '8px',
                            height: '7px',
                            width: '285px',
                            WebkitAppearance: 'none'
                        }} min="0" max="30" step="1" type="range" value={this.state.minExperience}
                               onChange={this.onChangeMinExperience}/>
                    </Grid>
                </Paper>
                </span>

            )
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <Grid className={classes.mainGrid}>
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
                                            {this.state.users &&
                                                this.state.users.map((user, index) => (
                                                    <StyledTableRow
                                                        key={index}
                                                    >
                                                        <UserCard user={user}/>
                                                    </StyledTableRow>
                                                ))}
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
                <Grid>
                    <Paper className={classes.paper}>
                        <FormLabel className={classes.label}>Параметры поиска:</FormLabel>
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
                    <Paper className={classes.nextPaper}>
                        <FormLabel className={classes.label}>
                            Искать по:
                        </FormLabel>
                        <Grid>
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

                        {this.printSearchParamsAboutDoctors(classes.nextPaper, classes.label)}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(useStyles)(Search)