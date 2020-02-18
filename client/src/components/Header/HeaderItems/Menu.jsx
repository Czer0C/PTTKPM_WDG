import React, { Component } from 'react';

class Menu extends Component {
    render() {
        return (
            <div className="page_menu">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            
                            <div className="page_menu_content">
                                
                                <div className="page_menu_search">
                                    <form action="#">
                                        <input type="search" required="required" className="page_menu_search_input" placeholder="Search for products..."/>
                                    </form>
                                </div>
                                {/* <ul className="page_menu_nav">                               
                                    <li className="page_menu_item">
                                        <a href="#">Home<i className="fa fa-angle-down"></i></a>
                                    </li>
                                    <li className="page_menu_item has-children">
                                        <a href="#">Super Deals<i className="fa fa-angle-down"></i></a>
                                        <ul className="page_menu_selection">
                                            <li><a href="#">Super Deals<i className="fa fa-angle-down"></i></a></li>
                                            <li className="page_menu_item has-children">
                                                <a href="#">Menu Item<i className="fa fa-angle-down"></i></a>
                                                <ul className="page_menu_selection">
                                                    <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                                    <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                                    <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                                    <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                                </ul>
                                            </li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                        </ul>
                                    </li>
                                    <li className="page_menu_item has-children">
                                        <a href="#">Featured Brands<i className="fa fa-angle-down"></i></a>
                                        <ul className="page_menu_selection">
                                            <li><a href="#">Featured Brands<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                        </ul>
                                    </li>
                                    <li className="page_menu_item has-children">
                                        <a href="#">Trending Styles<i className="fa fa-angle-down"></i></a>
                                        <ul className="page_menu_selection">
                                            <li><a href="#">Trending Styles<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                            <li><a href="#">Menu Item<i className="fa fa-angle-down"></i></a></li>
                                        </ul>
                                    </li>
                                    <li className="page_menu_item"><a href="blog.html">blog<i className="fa fa-angle-down"></i></a></li>
                                    <li className="page_menu_item"><a href="contact.html">contact<i className="fa fa-angle-down"></i></a></li>
                                </ul> */}
                                
                                <div className="menu_contact">
                                    <div className="menu_contact_item"><div className="menu_contact_icon"><img src="images/phone_white.png" alt=""/></div>+38 068 005 3570</div>
                                    <div className="menu_contact_item"><div className="menu_contact_icon"><img src="images/mail_white.png" alt=""/></div><a href="mailto:fastsales@gmail.com">fastsales@gmail.com</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Menu;