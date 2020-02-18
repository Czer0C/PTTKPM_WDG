import React, { Component } from 'react';
import TableProduct from "./TableProduct";
import Sidebar from './Sidebar';

class AdminComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }
    render() {
        return (
            <React.Fragment>
                <div className="wrapper">
                    <Sidebar />
                    <div className="main-panel">
                        <div className="content">
                            <div className="container-fluid">
                                <div className="row">
                                    <TableProduct />  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default AdminComponent;