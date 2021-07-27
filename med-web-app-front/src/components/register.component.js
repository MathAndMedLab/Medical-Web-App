import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                Нужно заполнить это поле!
            </div>
        );
    }
};

// const email = value => {
//     if (!isEmail(value)) {
//         return (
//             <div className="alert alert-danger" role="alert">
//                 This is not a valid email.
//             </div>
//         );
//     }
// };

const vusername = value => {
    if (value.length < 3 || value.length > 25) {
        return (
            <div className="alert alert-danger" role="alert">
                Имя должно содержать от 3 до 25 символов.
            </div>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                Пароль должен быть не менее 6 символов.
            </div>
        );
    }
};

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeFirstname = this.onChangeFirstname.bind(this);
        this.onChangeLastname = this.onChangeLastname.bind(this);
        // this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        // this.onChangeRole = this.onChangeRole.bind(this);

        this.state = {
            username: "",
            firstname: null,
            lastname: null,
            // firstAndLastName: null,
            // email: "",
            password: "",
            chosenRole: "ROLE_USER",
            successful: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        });
    }

    // onChangeEmail(e) {
    //     this.setState({
    //         email: e.target.value
    //     });
    // }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeFirstname(e) {
        this.setState({
            firstname: e.target.value
        });
    }

    onChangeLastname(e) {
        this.setState({
            lastname: e.target.value
        });
    }

    // onChangeRole(e) {
    //     console.log("onChangeRole")
    //     this.setState({
    //         chosenRole: e.target.value
    //     });
    //     console.log(e.target.value)
    //     console.log(this.state.chosenRole)
    // }

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();
        const firstAndLastName = this.state.lastname + " " + this.state.firstname
        if (this.checkBtn.context._errors.length === 0) {
            AuthService.register(
                this.state.username,
                firstAndLastName,
                this.state.firstname,
                this.state.lastname,
                // this.state.email,
                this.state.password,
                this.state.chosenRole
            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        successful: true
                    });
                },
                error => {
                    const resMessage =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message || error.toString();

                    this.setState({
                        successful: false,
                        message: resMessage
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container color-light-blue">

                    <Form
                        onSubmit={this.handleRegister}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="lastname">Фамилия</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="lastname"
                                        value={this.state.lastname}
                                        onChange={this.onChangeLastname}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="firstname">Имя</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="firstname"
                                        value={this.state.firstname}
                                        onChange={this.onChangeFirstname}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="username">Логин</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={this.state.username}
                                        onChange={this.onChangeUsername}
                                        validations={[required, vusername]}
                                    />
                                </div>

                                {/*<div className="form-group">*/}
                                {/*    <label htmlFor="email">Почта</label>*/}
                                {/*    <Input*/}
                                {/*        type="text"*/}
                                {/*        className="form-control"*/}
                                {/*        name="email"*/}
                                {/*        value={this.state.email}*/}
                                {/*        onChange={this.onChangeEmail}*/}
                                {/*        validations={[required, email]}*/}
                                {/*    />*/}
                                {/*</div>*/}

                                <div className="form-group">
                                    <label htmlFor="password">Пароль</label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangePassword}
                                        validations={[required, vpassword]}
                                    />
                                </div>

                                {/*<div>*/}
                                {/*    <label htmlFor="role">Выберите роль</label>*/}
                                {/*    <p>*/}
                                {/*        <input type="radio"*/}
                                {/*               value="ROLE_USER"*/}
                                {/*               onChange={this.onChangeRole}*/}
                                {/*               checked name="role"*/}
                                {/*        />*/}
                                {/*        Пользователь*/}
                                {/*    </p>*/}
                                {/*    <p>*/}
                                {/*        <input type="radio"*/}
                                {/*               value="ROLE_DOCTOR"*/}
                                {/*               onChange={this.onChangeRole}*/}
                                {/*               name="role"/>*/}
                                {/*        Врач*/}
                                {/*    </p>*/}
                                {/*</div>*/}

                                {/*<div className="radio">*/}
                                {/*    <label>*/}
                                {/*        <p>*/}
                                {/*            <input*/}
                                {/*                type="radio"*/}
                                {/*                value="ROLE_DOCTOR"*/}
                                {/*                name="role"*/}
                                {/*                checked={this.state.selectedOption === "ROLE_DOCTOR"}*/}
                                {/*                onChange={this.onChangeRole}*/}
                                {/*            />*/}
                                {/*            Врач*/}
                                {/*        </p>*/}

                                {/*        <p>*/}
                                {/*            <input*/}
                                {/*                type="radio"*/}
                                {/*                value="ROLE_USER"*/}
                                {/*                checked={this.state.selectedOption === "ROLE_USER"}*/}
                                {/*                onChange={this.onChangeRole}*/}
                                {/*            />*/}
                                {/*            Пользователь*/}
                                {/*        </p>*/}
                                {/*    </label>*/}
                                {/*</div>*/}

                                <div className="form-group">
                                    <button className="btn btn-block color-dark-blue">Зарегистрироваться</button>
                                </div>
                            </div>
                        )}

                        {this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.successful
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
                                this.checkBtn = c;
                            }}
                        />
                    </Form>
                </div>
            </div>
        );
    }
}