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
import Button from "@material-ui/core/Button";


const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: "#e0e0e0",
        },
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
        [theme.breakpoints.between("sm", "md")]:{
            width: 650
        },
        "@media (min-width : 1280px)":{
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
        [theme.breakpoints.between("sm", "md")]:{
            fontSize: 17,
        },
        "@media (min-width : 1280px)":{
            fontSize: 17,
        },
    },
    table: {
        [theme.breakpoints.down("xs")]: {
            width: 200,
        },
        [theme.breakpoints.between("sm", "md")]:{
            width: 650
        },
        "@media (min-width : 1280px)":{
            width: 800,
        },
    },
    formControlLab: {
        marginBottom: theme.spacing(0),
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
        paddingRight: 25
    }

});


class Search extends Component {
    constructor(props) {
        super(props);
        this.getUsers = this.getUsers.bind(this)
        this.onChangeSearchString = this.onChangeSearchString.bind(this)
        this.onChangeParamsTypeSearch = this.onChangeParamsTypeSearch.bind(this)
        this.onChangeParamsRoleSearch = this.onChangeParamsRoleSearch.bind(this)
        this.state = {
            searchParamsType: "login",
            searchParamsRole: "Все",
            searchString: "",
            users: [],
        };
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
                    const users = response.data;
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
                    const users = response.data;
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
                                                <TableCell className={classes.header} width={150}>
                                                    Фамилия Имя
                                                </TableCell>
                                                <TableCell className={classes.header} width={75} align={"right"}>
                                                    Логин
                                                </TableCell>
                                                <TableCell className={classes.header} width={100} align={"right"}>
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
                            <FormControl>
                                <RadioGroup value={this.state.searchParamsRole}
                                            onChange={this.onChangeParamsRoleSearch}>
                                    <FormControlLabel className={classes.formControlLab}
                                                      control={<Radio/>}
                                                      value="Все"
                                                      label="по всем"
                                    />
                                    <FormControlLabel className={classes.formControlLab}
                                                      control={<Radio/>}
                                                      value="Пользователь"
                                                      label="по пользователям"
                                                      labelPlacement='end'
                                    />
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
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(useStyles)(Search)