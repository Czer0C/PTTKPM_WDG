import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import './TopBar.css';
import { getFromStorage, removeFromStorage } from '../../../utils/storage';

class TopBar extends Component {
        constructor(props) {
            super(props);   
        this.onLogOut = this.onLogOut.bind(this);
    }

    onLogOut() {
        const obj = getFromStorage('login');
        if (obj && obj.token_key) {
            const { token_key } = obj;
            fetch('/account/logout?token=' + token_key)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {   
                        removeFromStorage('login');
                        window.location.replace('//localhost:3000');
                        //window.location.replace("https://chidori-auction.herokuapp.com/");                       
                    }
                });                        
        }        
    }
    
    render() {
        const btnStyle = {
            background: "#0e8ce4"
        }
        return (    
            <div className="top_bar">
                <div className="container">
                    <div className="row">
                        <div className="col d-flex flex-row">
                            <div className="top_bar_contact_item"><div className="top_bar_icon"><img src="images/phone.png" alt=""/></div>+84 165 554 9794</div>
                            <div className="top_bar_contact_item"><div className="top_bar_icon"><img src="images/mail.png" alt=""/></div><a href="mailto:chidorishop@gmail.com">chidorishop@gmail.com</a></div>
                            
                            <div className="top_bar_content ml-auto">   
                                <div className="btn-group" id="account">
                                    <button type="button" id="btn1" style={btnStyle} className="btn btn-primary" onClick={(e)=>{e.preventDefault();}}>
                                        <i className="fa fa-user"></i>  {this.props.username}
                                    </button>
                                    <button type="  " className="btn btn-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div className="dropdown-menu">
                                    
                                        <button className="btn btn-primary account" type="button">
                                            <NavLink to="/profile"><b>Tài khoản</b></NavLink>
                                        </button>
                                        {

                                           this.props.type === 0 ? <button className="btn btn-primary account" type="button">
                                            <NavLink to="/admin"><b>Dashboard</b></NavLink>
                                        </button> : null
                                        }
                                        <div className="dropdown-divider"></div>
                                        <button className="btn btn-primary account" onClick={this.onLogOut}><b>Đăng xuất</b></button>
                                    </div>
                                </div>                              
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TopBar