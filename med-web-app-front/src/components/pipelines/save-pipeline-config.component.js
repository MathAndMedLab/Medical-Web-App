import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import Button from "@material-ui/core/Button";
import {Card, withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import PipelineService from "../../services/pipeline.service";
import {Link} from "react-router-dom";

export default class SavePipelineConfigComponent extends Component {
    constructor(props) {
        super(props);
        this.handleSaveRecord = this.handleSaveRecord.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeConfiguration = this.onChangeConfiguration.bind(this);
        // this.delete = this.delete.bind(this);
        // this.handleClickOpen = this.handleClickOpen.bind(this)
        // this.handleClose = this.handleClose.bind(this)

        this.state = {
            description: "",
            configuration: "",
            submittedSuccessfully: false,
            message: null,
            pipelines: [],
            open: false
        };
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangeConfiguration(e) {
        this.setState({
            configuration: e.target.value
        });
    }

    handleSaveRecord(e) {
        e.preventDefault();

        if (this.checkBtn.context._errors.length === 0) {
            PipelineService.savePipeline(this.state.configuration, this.state.description).then(
                () => {
                    this.setState({
                        submittedSuccessfully: true,
                        message: "Успешно сохранено",
                        description: "",
                        configuration: ""
                    });
                },
                error => {
                    const resMessage =
                        (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

                    this.setState({
                        submittedSuccessfully: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    componentDidMount() {
        PipelineService.getAllPipelines().then(
            response => {
                let pipelinesForSelect = response.data.map(el => {
                    return {id: el.id, name: el.description};
                })
                this.setState({
                    pipelines: pipelinesForSelect
                });
            },
            error => {
                this.setState({
                    content: (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
                });
            }
        );
    }


    render() {

        return (
            <div>
                <Grid container direction="column" justifyContent="center">
                    <Grid item>
                        <div className="card record-create-form color-light-blue">
                                <Form
                                    onSubmit={this.handleSaveRecord}
                                    ref={c => {
                                        this.inputForm = c;
                                    }}
                                >
                                    <div className="form-group">
                                        <label htmlFor="title">Краткое описание:</label>
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            className="form-control"
                                            name="description"
                                            value={this.state.description}
                                            onChange={this.onChangeDescription}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="content">Конфигурация (json):</label>
                                        <textarea className="form-control"
                                                id="exampleFormControlTextarea1"
                                                rows="4"
                                                onChange={this.onChangeConfiguration}
                                                value={this.state.configuration}
                                                autoComplete="off"
                                        >
                                    </textarea>
                                    </div>

                                    <div className="form-group top-buffer-10">
                                        <button
                                            className="btn btn-primary btn-block color-dark-blue"
                                            disabled={!this.state.description || !this.state.configuration}
                                        >
                                            <span>Сохранить</span>
                                        </button>
                                    </div>

                                    {this.state.message && (
                                        <div className="form-group">
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
                                        </div>
                                    )}

                                    <CheckButton
                                        style={{display: "none"}}
                                        ref={c => {
                                            this.checkBtn = c
                                        }}
                                    />
                                </Form>
                            </div>
                    </Grid>

                    <Grid item>
                            <Link to={"/pipelines/create"} className="nav-link card-link-custom color-orange" style={{maxWidth: "300px"}}>Запустить
                                конвейер</Link>
                            <Link to={"/pipelines/results"} className="nav-link card-link-custom color-orange" style={{maxWidth: "300px"}}>Запущенные
                                конвейеры</Link>
                    </Grid>
                    <Grid container item direction="column" alignItems="center">
                        Уже имеющиеся конфигурации:
                        {this.state.pipelines.map(el => (
                            <div key={el.id} style={{width: "100px", display: 'inline-block', wordWrap: 'break-word',}}>{el.name}</div>
                        ))}
                    </Grid>
                </Grid>
            </div>
        );
    }
}