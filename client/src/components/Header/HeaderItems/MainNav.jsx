import React, { Component } from 'react';
import './MainNav.css';
import { NavLink } from "react-router-dom";
import { stickyNav } from './script';

class MainNav extends Component {

    componentDidMount() {
        stickyNav();
    }

    render() {

        return (
            <nav className="main_nav" id="navbar">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="main_nav_content d-flex flex-row">
                                <div className="main_nav_menu ml-auto">
                                    <ul className="standard_dropdown main_nav_dropdown">
                                        <li><NavLink to="/">Trang chủ</NavLink></li>
                                        <li><NavLink to="/Figures">Figures</NavLink></li>
                                        <li><NavLink to="/Electronics">Đồ điện tử</NavLink></li>
                                        <li><NavLink to="/Computers">Linh kiện máy tính</NavLink></li>
                                        <li><NavLink to="/Appliances">Đồ điện gia dụng</NavLink></li>
                                        <li><NavLink to="/LuggageAndTravelGear">Du lịch</NavLink></li>
                                        <li><NavLink to="/SportsAndOutdoors">Đồ thể thao</NavLink></li>
                                    </ul>
                                </div>
                                <div className="menu_trigger_container ml-auto">
                                    <div className="menu_trigger d-flex flex-row align-items-center justify-content-end">
                                        <div className="menu_burger">
                                            <div className="menu_trigger_text">menu</div>
                                            <div className="cat_burger menu_burger_inner"><span></span><span></span><span></span></div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default MainNav;