import React, {Component} from "react";
import RecordService from "../../services/record.service";
import Pagination from "@material-ui/lab/Pagination";
import SelectReact from 'react-select';
import RecordCard from "./record-card.component";
// import Topic from "./topic.component"
import TopicService from "../../services/topic.service";
import {Card, Divider, Grid, Hidden, IconButton, InputBase, Paper, Select, withStyles} from "@material-ui/core";
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
import Typography from '@mui/material/Typography';


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
        [theme.breakpoints.down("xs")]: {
            width: 270,
            height: 42,
            padding: '2px 4px',
            alignItems: 'center',

        },
        "@media (min-width : 451px)": {
            width: 325,
            height: 42,
            padding: '2px 4px',
            alignItems: 'center',
        },
        "@media (min-width : 600px)": {
            width: 375,
            height: 42,
            padding: '2px 4px',
            alignItems: 'flex-end',
        },
        "@media (min-width : 960px)": {
            width: 650,
            height: 42,
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


    GridInput: {

        [theme.breakpoints.up("md")]: {
            marginLeft: theme.spacing(2),

        },
        
        
    },

    input: {
        [theme.breakpoints.only("xs")]: {
            marginLeft: theme.spacing(0),
            flexGrow: 1,
        },
        [theme.breakpoints.only("sm")]: {
            marginLeft: theme.spacing(0),
            flexGrow: 1,

        },

        [theme.breakpoints.only("md")]: {
            flexGrow: 1,
            maxWidth: 585,

        },

        [theme.breakpoints.up("lg")]: {
            flexGrow: 1,
            width: "85%",

        },
        
        
    },

    iconButton: {
        [theme.breakpoints.down("xs")]: {
            marginTop: theme.spacing(-0.5),
        },
        [theme.breakpoints.between("sm", "md")]: {
            marginTop: theme.spacing(-0.5),
        },
    },

    selectForm: {
        "& .MuiFormLabel-root": {
            margin: 0
        },
        [theme.breakpoints.down("xs")]: {
            width: 270,
        },
      
        "@media (min-width : 451px)": {
            width: 325,
        },
        "@media (min-width : 600px)": {
            marginTop: theme.spacing(1),
            width: 375,
            minHeight: 45
        },
        "@media (min-width : 960px)": {
            marginTop: theme.spacing(1),
            width: 650,
            minHeight: 45
        },
        "@media (min-width : 1280px)": {
            marginTop: theme.spacing(1),
            width: 800,
            minHeight: 45
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

        "@media (min-width : 300px)": {
            width: 400,
            marginLeft: theme.spacing(3),
        },
        "@media (min-width : 410px)": {
            marginLeft: theme.spacing(5),
        },
        "@media (min-width : 430px)": {
            marginLeft: theme.spacing(7),
        },

        "@media (min-width : 451px)": {
            width: 425,
            marginLeft: theme.spacing(5),
        },
        "@media (min-width : 475px)": {
            marginLeft: theme.spacing(8),
        },

        "@media (min-width : 530px)": {
            width: 450,
            marginLeft: theme.spacing(10),
        },
        
        "@media (min-width : 600px)": {
            width: 530,
            marginLeft: theme.spacing(5),
        },
        "@media (min-width : 768px)": {
            marginLeft: theme.spacing(15),
        },
        "@media (min-width : 960px)": {
            width: 800,
            marginLeft: theme.spacing(2),
        },
        "@media (min-width : 992px)": {
            marginLeft: theme.spacing(15),
        },
        "@media (min-width : 1025px)": {
            width: 850,
        },
         "@media (min-width : 1110px)": {
            marginLeft: theme.spacing(10),
        },
        "@media (min-width : 1200px)": {
            width: 950,
            marginLeft: theme.spacing(25),
        },
        "@media (min-width : 1280px)": {
            width: 1650,
            marginLeft: theme.spacing(0),
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
        [theme.breakpoints.only( "xs")]: {
            marginLeft: theme.spacing(-1),
        },
        "@media (min-width : 360px)": {
            marginLeft: theme.spacing(2),
        },
        "@media (min-width : 451px)": {
            marginLeft: theme.spacing(5),
        },
        "@media (min-width : 600px)": {
            marginLeft: theme.spacing(18),
        },
        "@media (min-width : 960px)": {
            marginLeft: theme.spacing(37),
        },
        marginTop: theme.spacing(2),
    },

    postGrid: {
        
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },

    pageCounter: {},


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
            <Grid container className={classes.mainGrid}>
                <Grid container item xs={8} sm={6} direction="column" className={classes.firstGrid} alignItems="center">
                    <Grid container item direction="column" >
                        <Paper component="form" className={classes.paper}>
                            <Grid container className={classes.GridInput}>
                                <InputBase
                                value={searchTitle}
                                onChange={this.onChangeSearchTitle}
                                className={classes.input}
                                placeholder="Поиск"
                                />
                                <IconButton className={classes.iconButton}>
                                    <SearchIcon type="button" onClick={this.getRecords} 
                                            aria-label="search"
                                            title={"Поиск"}/>
                                </IconButton>
                            </Grid>
                            
                        </Paper>

                        <FormControl className={classes.selectForm} fullWidth>
                            <Select
                                className={classes.root}
                                labelId="selected-topics"
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

                    <Grid container item className={classes.postGrid}>
                            <Typography variant="body2" gutterBottom>
                                Количество постов на странице: 
                            </Typography>
                            <SelectReact className="col-2"
                                            onChange={this.handlePageSizeChange}
                                            options={this.pageSizes}
                                            autoFocus={true}
                                            defaultValue={this.pageSizes[2]}
                                            styles={stylesForSmallSelectBox}
                                />

                      
                        
                    </Grid>

                    

                    <Grid container item direction="column">
                        
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
                        {this.state.records &&
                        this.state.records.map((record, index) => (
                            <Grid item
                                  style={{listStyleType: "none", padding: 0, marginBottom: "10px"}}
                                  key={index}
                            >
                                 
                                <RecordCard record={record} isPreview={true} isReply={false}
                                            getRecords={this.getRecords}/>
                            </Grid>

                        ))}
                    </Grid>
                    
                </Grid>

                <Hidden lgUp>
                    <div className={classes.Drawer}>
                        <TemporaryDrawer/>
                    </div>
                    
                </Hidden>


                <Hidden mdDown>
                    <Grid xs={2} item>
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
                    </Grid>
                </Hidden>
                    
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