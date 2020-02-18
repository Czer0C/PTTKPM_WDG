import React, { Component } from 'react';
//import { timer } from '../../utils/timer'
import { bidBoxWork, initTimer, refreshAuctionTicketTable } from './script'
import './custom_grid.css';

import { getFromStorage } from '../../utils/storage';

class ProductDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mainObject: [],
            ticketObj: [],
            sessionID: '',
            description: [],
            intervalTicket: ''
        }
        this.beautify = this.beautify.bind(this);
        
    }

    beautify(str) {
        
        var arr = str.split(',');
        var res = [];
        arr.forEach(element => {
            res += element + '\n';
        });
        this.setState({ description: res });
    }
  
    componentDidMount() {
        this.getProductByID();        
    }
    
    componentDidUpdate() {
        bidBoxWork();                             
    }
    
    componentWillUnmount() {
        initTimer(0);
        refreshAuctionTicketTable(0);    
    }

    getAuctionTicket(accessToken) {                
        fetch('/bid/getAuctionTicket/'+this.state.sessionID, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }).then(res => res.json())
            .then(json => {
                this.setState({                    
                    ticketObj: json
                });
            });    
    }

    getProductByID() {        
        const { id, type } = this.props.match.params;
        const obj = getFromStorage('login');
      
        if (obj && obj.access_token) {
            const { access_token } = obj;
            fetch('/product/getProductDetail/'+ type + '/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(res => res.json())
                .then(json => {                    
                    this.setState({
                        sessionID: json[0].p[0].sessionID,
                        mainObject: json,
                        description: json[0].description,                        
                    });
                    this.getAuctionTicket(access_token);                    
                    this.beautify(this.state.description);                
                    initTimer(1, json[0].p[0].sessionID);
                    refreshAuctionTicketTable(1, this.state.sessionID);
                });
        }        
    }
    
    
    render() {
        const arr = this.state.mainObject;
        const ticketArr = this.state.ticketObj;

        const divStyle = {
            paddingTop: '56px',
            background: '#eff6fa',
            paddingBottom: '50px',
        }

        const productDescriptionStyle = {
            "whiteSpace" : "pre-line"
        }
                        
        return (
            <div className="box_shadow" style={divStyle}>
                <div className="container">
                {
                    arr.map((item) => 
                        <div className="grid-container" id="product-table" key={item._id}>
                            
                            <div className="head" id="product-title">
                                <h2>{item.productName}</h2>
                            </div>
                            
                            <div className="mx-auto left" id="product-image">
                                <img src={'../../'+item.productImage} alt={item.productName}/>
                            </div>                            

                            <div className="mx-auto right">
                                
                                <div className="panel" id="time-left-panel">
                                    <h3>Kết thúc trong</h3>
                                    <span id="end"></span>
                                    <div className="bestsellers_item">
                                        <div className="deals_timer_content ml-auto">
                                            <div className="deals_timer_box clearfix" data-target-time={(item.p[0].status === 1) ? item.p[0].bidTime : "00:00:00"}>
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
                                    </div>
                                </div>

                                <div className="panel" id="current-price-panel">
                                    <h3>Giá thầu hiện tại</h3>
                                    <div id="current-price">{item.p[0].currentPrice}</div>
                                </div>

                                <div className="panel" id="bidding-panel">
                                    <h3>Đấu giá ngay</h3>
                                    
                                    <div id="bid-box">
                                        
                                        <button id="minus" data-value="-1">-</button>
                                        <input type="text" name="bid-value" id="bid-value" value={item.p[0].currentPrice} data-step="4000" data-min={item.p[0].currentPrice} data-session={item.p[0].sessionID} disabled="true"/>
                                        <button id="plus" data-value="1">+</button>
                                        
                                    </div>

                                    <div id="bid-now">
                                        <button id="bid-now-btn">Đấu giá ngay</button>
                                    </div>
                                </div>

                            </div>
                            
                            <div className="view-history">
                                <table className="table table-striped" id="history-table">
                                    <thead>
                                        <tr>
                                            <th>Tài khoản đấu giá</th>
                                            <th>Giá dự thầu (vnd)</th>                                            
                                            <th>Thời gian đấu giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            ticketArr.map(item => 
                                                <tr key={item._id}>
                                                    <td>{item.accountID}</td>
                                                    <td>{item.bidValue}</td>
                                                    <td>{item.bidTime}</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>

                            <div className="content">
                                <div id="product-detail">
                                    <h2>Chi tiết sản phẩm</h2>
                                    <p>Mã sản phẩm: {item.productID}</p>
                                    <p>Loại sản phẩm: {item.productType}</p>
                                </div>
                                <div id="product-description">
                                    <h2>Mô tả sản phẩm</h2>
                                    <div style={productDescriptionStyle}>{this.state.description}</div>
                                </div>
                            </div>
                        </div>
                    )
                }   
                </div>
            </div>

        );
    }
}

export default ProductDetail;