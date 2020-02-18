import React, { Component } from 'react';
//import logo from './logo.svg';

import TopBar from './HeaderItems/TopBar';
import HeaderMain from './HeaderItems/HeaderMain';
import MainNav from './HeaderItems/MainNav';
import Menu from './HeaderItems/Menu';

class HeaderComponent extends Component {
    render() {
        return (
            <header className="header">
                <TopBar username={this.props.username} type={this.props.type} />
                <HeaderMain/>
                <MainNav/>
                <Menu/>
            </header>
        );
    }        
}

export default HeaderComponent;