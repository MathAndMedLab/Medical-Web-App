import React, {Component} from "react";
import RecordService from "../../services/record.service";
import Pagination from "@material-ui/lab/Pagination";
import SelectReact from 'react-select';
import RecordCard from "./record-card.component";
// import Topic from "./topic.component"
import TopicService from "../../services/topic.service";
import {Card, Divider, Grid, IconButton, InputBase, Paper, Select, withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {Link} from "react-router-dom";
import {AddCircle, AddCircleSharp} from "@material-ui/icons";
import ListItemButton from "@mui/material/ListItemButton";
import Dropup from "./DropupOnRecordCard";
import BasicSelect from "./DropupOnRecordCard";
import TemporaryDrawer from "./DropupOnRecordCard";

const useStyles = theme => ({
    button: {
        width: 200,
        margin: theme.spacing(1),
        backgroundColor: '#f50057',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#ff5983',
            color: '#ffffff',
        }
    },
    paper: {
        justifyContent: "center",
        marginLeft: theme.spacing(1),
        [theme.breakpoints.down("xs")]: {
            width: 270,
            height: 42,
            padding: '2px 4px',
            alignItems: 'center',

        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 600,
            height: 42,
            padding: '2px 4px',
            alignItems: 'flex-end',

        },
        "@media (min-width : 1280px)": {
            width: 800,
            height: 42,
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center'
        },
    },
    input: {
        marginLeft: theme.spacing(1),
        //flex: 1,
        flexGrow: 1,
        width: "85%",
        /*[theme.breakpoints.between("sm", "md")]:{
          width: 600
        },*/
    },
    iconButton: {
        [theme.breakpoints.down("xs")]: {
            padding: 0,
        },
        [theme.breakpoints.between("sm", "md")]: {
            padding: 0,

        },
    },
    selectForm: {
        "& .MuiFormLabel-root": {
            margin: 0
        },
        [theme.breakpoints.down("xs")]: {
            marginLeft: theme.spacing(1),
            width: 270,
        },
        [theme.breakpoints.between("sm", "md")]: {
            width: 650
        },
        "@media (min-width : 1280px)": {
            width: 800,
        },
    },
    topicPaper: {
        width: 200,
        margin: theme.spacing(1),
        padding: theme.spacing(3),
    },
    topicTitle: {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
    },
    reset: {
        fontSize: 15,
        textAlign: "right",
        color: '#f50057',
    },
    mainGrid: {
        display: 'flex',
        [theme.breakpoints.down("xs")]: {
            minWidth: 200,
        },
        [theme.breakpoints.between("sm", "md")]: {
            mindWidth: 500,
        },
        "@media (min-width : 1280px)": {
            minWidth: 1000.
        },
    },
    paper2: {
        margin: theme.spacing(3),
        padding: theme.spacing(3),
        color: "black",
        //position:"fixed",
        "@media (min-width: 980px)": {
            left: "70%"
        }
    },
    firstGrid: {
        marginTop: theme.spacing(3),
        alignItems: "center",
        justifyContent: "flex-end"
    },
    grid: {
        margin: theme.spacing(1),
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: "flex-end"
    },
    record: {
        minWidth: 1000
    },
    Drawer: {
        position: "fixed",
        top: "92%",
        left: "85%"
    },
    pageCounter: {},
    RecordsContainer: {
        display: "flex",
        "@media (max-width: 376px)": {
            alignItems: "flex-start",
            marginLeft: theme.spacing(1)
        },
        alignItems: "center",
        "@media (min-width: 768px)": {
            marginLeft: theme.spacing(0),
        }
    }

})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const DrawRightSide = (props) => {
    const [width, setWidth] = React.useState(window.innerWidth);
    const classes = props.classes;
    React.useEffect(() => {
        const handleResizeWindow = () => setWidth(window.innerWidth);
        // subscribe to window resize event "onComponentDidMount"
        window.addEventListener("resize", handleResizeWindow);
        return () => {
            // unsubscribe "onComponentDestroy"
            window.removeEventListener("resize", handleResizeWindow);
        };
    }, []);
    if (width > 980) {
        return (<Grid xs={4} item={true}>
            <Card className={classes.paper2}>
                <Grid className={classes.grid}>
                    <Link to={"/records/create"} style={{textDecoration: 'none'}}>
                        <Button className={classes.button} title={"Создать пост"}>
                            Создать пост
                        </Button>
                    </Link>
                    <Link to={"/topics/create"} style={{textDecoration: 'none'}}>
                        <Button className={classes.button} title={"Страница тэгов"}>
                            Страница тэгов
                        </Button>
                    </Link>
                </Grid>
            </Card>
        </Grid>);
    } else {
        return (
            <div className={classes.Drawer}>
                <TemporaryDrawer/>
            </div>);
    }

}


class ViewRecordsList extends Component {

    constructor(props) {
        super(props);

        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.getRecords = this.getRecords.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.displayRecordThread = this.displayRecordThread.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        // this.onTopicsDropdownSelected = this.onTopicsDropdownSelected.bind(this);
        this.handleTopics = this.handleTopics.bind(this);

        this.state = {
            records: [],
            currentRecord: null,
            currentIndex: -1,
            searchTitle: "",

            page: 1,
            count: 0,
            pageSize: 10,

            showTopics: true,
            availableTopics: [],
            selectedTopic: null,
            selectedTopicValue: "",
            selectedTopicID: null,
        };

        this.pageSizes = [{value: 2, label: '2'}, {value: 4, label: '4'}, {value: 10, label: '10'}];
    }

    componentDidMount() {
        this.getRecords();

        TopicService.getAllTopics()
            .then(response => {
                    let topicsForSelect = response.data.topics.map(el => {
                        return {value: el.id, label: el.name};
                    })
                    this.setState({
                        availableTopics: topicsForSelect
                    });
                },
                error => {
                    console.log(error);
                }
            );
    }

    onChangeSearchTitle(e) {
        const searchTitle = e.target.value;

        this.setState({
            searchTitle: searchTitle,
        });
    }

    // onTopicsDropdownSelected(selectedTopic) {
    //     this.setState({
    //         selectedTopic: selectedTopic.value,
    //         selectedTopicValue: selectedTopic
    //     });
    // }


    handleTopics(e) {
        let topicId;
        this.state.availableTopics.map(topic => {
            if (e.target.value.indexOf(topic.label) !== -1) {
                topicId = topic.value;
            }
        });
        this.setState({
            selectedTopicId: topicId,
            selectedTopicValue: e.target.value
        })
    }

    getRecords() {
        const {searchTitle, page, pageSize, selectedTopicValue} = this.state;
        RecordService.getAll(page, pageSize, searchTitle, selectedTopicValue)
            .then((response) => {
                // console.log(response.data)
                const {records, totalPages} = response.data;
                this.refreshList();

                this.setState({
                    records: records,
                    count: totalPages,
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    refreshList() {
        this.setState({
            records: [],
            count: -1,
        });
    }

    displayRecordThread(record) {
        this.props.history.push({
            pathname: '/records/thread/' + record.id,
            state: {recordId: record.id}
        });
        window.location.reload();
    }

    handlePageChange(event, value) {
        this.setState(
            {
                page: value,
            },
            () => {
                this.getRecords();
            }
        );
    }

    handlePageSizeChange(selectedItem) {
        this.setState(
            {
                pageSize: selectedItem.value,
                page: 1
            },
            () => {
                this.getRecords();
            }
        );
    }

    render() {
        const {
            searchTitle,
            page,
            count,
        } = this.state;
        const {classes} = this.props;
        return (
            <Grid item className={classes.mainGrid}>
                <Grid item xs={12} className={classes.firstGrid}>
                    <Grid item xs={8}>
                        {/*<input
                            type="text"
                            className="form-control"
                            placeholder="Введите часть заголовка"
                            value={searchTitle}
                            onChange={this.onChangeSearchTitle}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={this.getRecords}
                            >
                                Найти
                            </button>
                        </div>*/}
                        <Paper component="form" className={classes.paper}>
                            <InputBase
                                value={searchTitle}
                                onChange={this.onChangeSearchTitle}
                                className={classes.input}
                                placeholder="Поиск"
                                // inputProps={{ 'aria-label': 'search google maps' }}
                            />
                            <IconButton type="button" onClick={this.getRecords} className={classes.iconButton}
                                        aria-label="search"
                                        title={"Поиск"}>
                                <SearchIcon/>
                            </IconButton>
                        </Paper>

                        <FormControl className={classes.selectForm} fullWidth>
                            <Select
                                className={classes.root}
                                labelId="selected-topics"
                                // variant="outlined"
                                title={"Выбрать тэги"}
                                value={this.state.selectedTopicValue}
                                onChange={this.handleTopics}
                                input={<Input id="select-multiple-chip-for-topics"/>}
                                renderValue={(selected) => (
                                    <div className={classes.chips}>
                                        {
                                            <Chip key={selected} label={selected} className={classes.chip}/>
                                        }
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.availableTopics.map(x => (
                                    <MenuItem key={x.value} value={x.label} id={x.value}>
                                        {x.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <div className="mt-3">
                        <div className="row">
                            <div style={{marginLeft: 23, marginTop: "5px", width: 180}}

                            >{"Количество постов на странице: "}</div>
                            <SelectReact className="col-2"
                                         onChange={this.handlePageSizeChange}
                                         options={this.pageSizes}
                                         autoFocus={true}
                                         defaultValue={this.pageSizes[2]}
                                         styles={stylesForSmallSelectBox}
                            />
                        </div>

                        <Pagination
                            className="my-3"
                            count={count}
                            page={page}
                            siblingCount={1}
                            boundaryCount={1}
                            variant="outlined"
                            shape="rounded"
                            onChange={this.handlePageChange}
                            style={{display: "flex", justifyContent: "center"}}
                        />
                    </div>


                    <Grid container direction={"column"} className={classes.RecordsContainer}>
                        {this.state.records &&
                        this.state.records.map((record, index) => (
                            <Grid item
                                  style={{listStyleType: "none", padding: 0, width: "70%", marginBottom: "10px"}}
                                  key={index}
                                // onClick={() => this.displayRecordThread(record)}
                            >
                                <RecordCard record={record} isPreview={true} isReply={false}
                                            getRecords={this.getRecords}/>
                                <Divider/>
                            </Grid>

                        ))}

                    </Grid>
                </Grid>
                <DrawRightSide classes={classes}/>

                {/*<div className="col-sm-2">
                    <Button variant="contained" href="/records/create" className={classes.button}>
                        Создать пост
                    </Button>
                    <Button variant="contained" href="/topics/create" className={classes.button}>
                        Страница тэгов
                    </Button>

                    <Paper className={classes.topicPaper}>
                        <Grid container spacing={1} direction={"column"}>
                            <Grid item
                                  onClick={() => (
                                      this.setState({
                                              selectedTopic: null,
                                          },
                                          this.getRecords
                                      ))}>
                                <Typography variant="body1" className={classes.topicTitle}>
                                    Список тэгов:
                                </Typography>
                            </Grid>
                            {this.state.availableTopics && this.state.availableTopics.map((topic, index) => (
                                <Grid item
                                      style={{listStyleType: "none"}}
                                      key={index}
                                      onClick={() => (
                                          this.setState({
                                                  selectedTopic: topic.value,
                                              },
                                              this.getRecords
                                          ))}
                                >
                                    <ButtonBase>
                                        {topic.label}
                                    </ButtonBase>
                                </Grid>
                            ))}
                            <Grid item
                                  onClick={() => (
                                      this.setState({
                                              selectedTopic: null,
                                          },
                                          this.getRecords
                                      ))}>
                                <Typography className={classes.reset}>
                                    <ButtonBase>
                                        сбросить
                                    </ButtonBase>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>*/}

            </Grid>
        );
    }
}

const stylesForSmallSelectBox = {
    control: (provided, state) => ({
        ...provided,
        background: '#fff',
        borderColor: '#9e9e9e',
        minHeight: '30px',
        height: '30px',
        width: 70,
        "@media (max-width : 394px)": {
            //marginLeft: 75
        },

        boxShadow: state.isFocused ? null : null,
    }),

    valueContainer: (provided, state) => ({
        ...provided,
        height: '30px',
        padding: '0 6px',
        "@media (max-width : 394px)": {
            width: 50,
        },
    }),

    input: (provided, state) => ({
        ...provided,


    }),
    indicatorSeparator: state => ({
        display: 'none',

    }),
    indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '30px',

    }),
};

export default withStyles(useStyles)(ViewRecordsList)