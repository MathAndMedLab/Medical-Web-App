import React, {Component} from 'react';
import RecordService from "../../services/record.service";
import AttachmentService from "../../services/attachment.service";
import AuthService from "../../services/auth.service";
import {Grid, withStyles} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";


const useStyles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3),
            width: 238
        },
    },
    filesWidth: {
        width: 238,
        margin: theme.spacing(1,1,1,1)
    },
    grid: {
        margin: theme.spacing(1),
        display: 'flex',
    },
    layout: {
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    submit: {
        width: 50,
        height: 73,
        backgroundColor: '#1B435D',
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: 0,
        backgroundColor: '#01579b',
    },
    root: {
        "& .MuiFormLabel-root": {
            margin: 0
        }
    },
    typography: {
        width: 680,
        marginRight: theme.spacing(1),
        "& .MuiFormLabel-root": {
            margin: 0,
            color: "black"
        }
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    formControl: {
        "& .MuiFormLabel-root": {
            margin: 0
        },
        margin: theme.spacing(0,1,0,1),
        width: '97%',
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
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

class ReplyRecordForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmitReply = this.handleSubmitReply.bind(this);
        this.onChangeContent = this.onChangeContent.bind(this);
        this.handleFiles = this.handleFiles.bind(this);

        this.state = {
            content: "",
            contentPresence: false,
            contentCorrect: "",
            availableFiles: [],
            selectedFilesId: null,
            selectedFilesValue: [],
            submittedSuccessfully: false,
            message: null,
        };
    }

    onChangeContent(e) {
        let str = e.target.value
        str = str.replace(/ {2,}/g, ' ').trim();
        str = str.replace(/[\n\r ]{3,}/g, '\n\r\n\r');
        if (str.charCodeAt(0) > 32) {
            this.setState({
                content: e.target.value,
                contentCorrect: str,
                contentPresence: true
            });
        } else {
            this.setState({
                content: e.target.value,
                contentCorrect: str,
                contentPresence: false
            });
        }
    }

    handleFiles(e) {
        let filesIds = [];
        this.state.availableFiles.map(file => {
            if (e.target.value.indexOf(file.label) !== -1) {
                filesIds.push(file.value)
            }
        });
        this.setState({
            selectedFilesId: filesIds,
            selectedFilesValue: e.target.value
        })
    }

    handleSubmitReply(e) {
        e.preventDefault();

        RecordService.saveRecord(null, this.state.contentCorrect, null, this.state.selectedFilesId, this.props.parentId).then(
            () => {
                this.setState({
                    submittedSuccessfully: true,
                    message: "Успешно опубликовано",
                    content: "",
                    contentCorrect: "",
                    contentPresence: true,
                    selectedFilesId: [],
                    selectedFilesValue: [],
                });
                this.props.refreshRecords();
            },
            error => {
                const resMessage =
                    (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                this.setState({
                    submittedSuccessfully: false,
                    message: resMessage,
                    contentCorrect: "",
                    contentPresence: false,
                });
            }
        );

    }

    componentDidMount() {
        AttachmentService.getAttachmentsForUser(AuthService.getCurrentUser().username)
            .then(response => {
                    let filteredDicomsForSelect = response.data.map(el => {
                        return {value: el.id, label: el.initialName};
                    })
                    this.setState({
                        availableFiles: filteredDicomsForSelect
                    });
                },
                error => {
                    console.log(error);
                }
            );
    }

    render() {
        const {classes} = this.props;

        return (
            <div>
                <Grid className={classes.grid}>
                    <TextField
                        className={classes.typography}
                        multiline
                        minRows={2}
                        maxRows={10}
                        variant="outlined"
                        fullWidth
                        id="content"
                        label="Оставьте комментарий"
                        name="content"
                        autoComplete="off"
                        value={this.state.content}
                        onChange={this.onChangeContent}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmitReply}
                        className={classes.submit}
                        disabled={!this.state.contentPresence}
                        title={"Опубликовать"}
                    >
                        <DoneOutlineIcon/>
                    </Button>
                </Grid>
                {this.state.message && (
                    <Grid className={classes.gridMessage}>
                        <div
                            className={
                                this.state.submittedSuccessfully
                                    ? "alert alert-success"
                                    : "alert alert-danger"
                            }
                            role="alert"
                        >
                            {this.state.message}
                        </div>
                    </Grid>
                )}
                {/*<FormControl className={classes.formControl}>
                    <InputLabel id="selected-files" className={classes.filesWidth}>Прикрепить:</InputLabel>
                    <Select
                        className={classes.root}
                        multiple
                        labelId="selected-files"
                        value={this.state.selectedFilesValue}
                        onChange={this.handleFiles}
                        input={<Input id="select-multiple-chip-for-files"/>}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip}/>
                                ))}
                            </div>
                        )}
                        MenuProps={MenuProps}
                    >

                        {this.state.availableFiles.map(x => (
                            <MenuItem key={x.value} value={x.label} id={x.value}>
                                {x.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>*/}
            </div>
        )
    }
}

export default withStyles(useStyles)(ReplyRecordForm)