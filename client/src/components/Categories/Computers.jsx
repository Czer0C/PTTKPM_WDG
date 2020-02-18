import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { timer } from "../../utils/timer";
import {getFromStorage} from "../../utils/storage";
class Computers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mainData: []
        };
    }
    componentDidMount() {
        this.getProduct();
    }

    componentWillUnmount() {
        timer(0);
    }

    getProduct() {
        const obj = getFromStorage('login');

        if (obj && obj.access_token) {
            const { access_token } = obj;
            fetch('/auction/getAuctionSession/Computers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(json => {
                    if (json.length >= 1) {
                        this.setState({
                            mainData: json
                        });
                        timer(1, json[0].p[0].sessionID);
                    }                    
                });
        }
    }

    render() {
        const divStyle = {
            paddingTop: '56px',
            background: '#eff6fa',
            paddingBottom: '50px',
        }

        const gridStyle = {
            display: 'grid',
            grid: 'auto / auto auto auto',
            gridGap: '10px',
        }
        const arr = this.state.mainData;

        return( 
            <div className="box_shadow" style={divStyle}>
                <div className="container">
                <div className="row">
                    <div className="col">
                    <div className="tabbed_container">
                        <div className="clearfix padding">
                        <div className="new_arrivals_title">
                            Linh kiện máy tính
                        </div>
                        <div className="tabs_line demo">
                            <span />
                        </div>
                        </div>

                        <div style={gridStyle}>
                        {arr.map((item, index) => (
                            <div className="bestsellers_item" key={item._id}>
                            <div className="bestsellers_item_container d-flex flex-row align-items-center justify-content-start">
                                <div className="bestsellers_image">
                                <img src={item.productImage} alt="" />
                                </div>
                                <div className="bestsellers_content">
                                <div className="bestsellers_category">
                                    {item.productType}
                                </div>
                                <div className="bestsellers_name">
                                    Item {index}
                                </div>
                                <div className="bestsellers_price">
                                    {item.p[0].currentPrice} VND
                                </div>
                                <div className="deals_timer_content ml-auto">
                                    <div
                                    className="deals_timer_box clearfix"
                                    data-target-time={item.p[0].bidTime}
                                    >
                                    <div className="deals_timer_unit">
                                        <div
                                        id="deals_timer1_hr"
                                        className="deals_timer_hr"
                                        />
                                        <span>hours</span>
                                    </div>
                                    <div className="deals_timer_unit">
                                        <div
                                        id="deals_timer1_min"
                                        className="deals_timer_min"
                                        />
                                        <span>mins</span>
                                    </div>
                                    <div className="deals_timer_unit">
                                        <div
                                        id="deals_timer1_sec"
                                        className="deals_timer_sec"
                                        />
                                        <span>secs</span>
                                    </div>
                                    </div>
                                </div>
                                <div className="bid_btn">
                                    <NavLink
                                    to={
                                        "Auction/" +
                                        item.productType +
                                        "/" +
                                        item.productID
                                    }
                                    >
                                    Đấu giá ngay
                                    </NavLink>
                                    {/* <a href="javascript:void(0)"></a> */}
                                </div>
                                </div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        );
          
  }
}

export default Computers;