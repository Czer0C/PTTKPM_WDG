import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { timer } from '../../utils/timer';
import { getFromStorage } from '../../utils/storage';


//const {clearInterval, setInterval} = window;

class BestSellerComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            obj: []
        }
    }
    
    componentDidMount() {
        this.getAllAuction();
    }

    componentWillUnmount() {
        timer(0);
    }


    getAllAuction() {
        const obj = getFromStorage('login');

        if (obj && obj.access_token) {
            const { access_token } = obj;
            fetch('/auction/getAllAuctionSession', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                } 
            })
            .then(res => res.json())
            .then(json => {
                if (json.length >= 1) {
                    this.setState({obj: json});
                    timer(1, json[0].sessionID);
                }        
                console.log(json)        
            });
        }         
    }
    
    render() {

        const gridStyle = {
            display: 'grid',
            grid: 'auto / auto auto auto',
            gridGap: '10px',            
        }

        const arr = this.state.obj;
       
        return(
            <div className="best_sellers box_shadow">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="tabbed_container">
                                <div className="clearfix padding">
                                    <div className="new_arrivals_title">Sản phẩm đang đấu giá</div>                                                        
                                    <div className="tabs_line demo"><span></span></div>
                                </div>

                                <div style={gridStyle}>
                                {
                                    arr.map((item, index) => 

                                    <div className="bestsellers_item" key={item._id}>
                                        <div className="bestsellers_item_container d-flex flex-row align-items-center justify-content-start">
                                            <div className="bestsellers_image"><img src={item.p[0].productImage} alt=""/></div>
                                            <div className="bestsellers_content">
                                                
                                                <div className="bestsellers_category">{item.productType}</div>
                                                <div className="bestsellers_name">Item {index}</div>
                                                <div className="bestsellers_price">{item.currentPrice} VND</div>
                                                <div className="deals_timer_content ml-auto">
                                                    <div className="deals_timer_box clearfix" data-target-time={item.bidTime}>
                                                        <div className="deals_timer_unit">
                                                            <div id="deals_timer1_hr" className="deals_timer_hr"></div>
                                                            <span>hours</span>  
                                                        </div>
                                                        <div className="deals_timer_unit">
                                                            <div id="deals_timer1_min" className="deals_timer_min"></div>
                                                            <span>mins</span>
                                                        </div>
                                                        <div className="deals_timer_unit">
                                                            <div id="deals_timer1_sec" className="deals_timer_sec"></div>
                                                            <span>secs</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bid_btn">
                                                    <NavLink to={'Auction/'+item.p[0].productType+'/'+item.p[0].productID}>Đấu giá ngay</NavLink>
                                                    {/* <a href="javascript:void(0)"></a> */}
                                                </div>                                                        
                                            </div>
                                        </div>
                                    </div>

                                    )
                                }
                                </div>
                                                                
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BestSellerComponent;