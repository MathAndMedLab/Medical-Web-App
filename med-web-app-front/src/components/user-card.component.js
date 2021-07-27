import React, {Component} from "react";
import '../styles/Search.css'

export default class UserCard extends Component {
    constructor(props) {
        super(props);
        this.user = this.props.user
    }

    render() {
        return (
            <td>
                {this.user.initials} &nbsp; {this.user.username}
            </td>
        )
    }
}