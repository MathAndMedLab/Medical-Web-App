import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import ViewAttachmentsComponent from "./components/view-attachments.component";
import UploadAttachmentsComponent from "./components/upload-attachments.component";
import PipelinesComponent from "./components/pipelines.component";
import PipelineResultsComponent from "./components/pipeline-results.component";
import ViewRecordsComponent from "./components/view-records.component";
import CreateRecordComponent from "./components/create-record.component";
import RecordThreadComponent from "./components/record-thread.component";
import SavePipelineConfigComponent from "./components/save-pipeline-config.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      AuthService.checkTokenIsExpired(user.token)
          .then(response => {
            this.setState({
              currentUser: user
            });
          })
          .catch(error => {
            this.logOut();
          }
      )
    }
  }

  logOut() {
    AuthService.logout();
    this.setState({currentUser: null});
  }

  render() {
    const { currentUser } = this.state;

    return (
        <div>
          <nav className="navbar navbar-expand color-dark-blue">
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link color-dark-blue">
                  Главная
                </Link>
              </li>

              {currentUser && (
                  <li className="nav-item">
                    <Link to={"/pipelines/create"} className="nav-link color-dark-blue">
                      Конвейеры
                    </Link>
                  </li>
              )}

              {currentUser && (
                  <li className="nav-item">
                    <Link to={"/records/view"} className="nav-link color-dark-blue">
                      Посты
                    </Link>
                  </li>
              )}
            </div>

            {currentUser ? (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link color-dark-blue">
                      Мой профиль
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link color-dark-blue" onClick={this.logOut}>
                      Выйти
                    </Link>
                    {/*<a href="/login" className="nav-link color-dark-blue" onClick={this.logOut}>*/}
                    {/*  Выйти*/}
                    {/*</a>*/}
                  </li>
                </div>
            ) : (
                <div className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link color-dark-blue">
                      Войти
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to={"/register"} className="nav-link color-dark-blue">
                      Зарегистрироваться
                    </Link>
                  </li>
                </div>
            )}
          </nav>

          <div className="container mt-3">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/pipelines/create" component={PipelinesComponent}/>
              <Route exact path="/pipelines/results" component={PipelineResultsComponent}/>
              <Route exact path="/pipelines/save" component={SavePipelineConfigComponent}/>
              <Route exact path="/files/view" component={ViewAttachmentsComponent}/>
              <Route exact path="/files/upload" component={UploadAttachmentsComponent}/>
              <Route exact path="/records/view" component={ViewRecordsComponent}/>
              <Route exact path="/records/create" component={CreateRecordComponent}/>
              <Route path="/records/thread/:recordId" component={RecordThreadComponent}/>
            </Switch>
          </div>
        </div>
    );
  }
}

export default App;