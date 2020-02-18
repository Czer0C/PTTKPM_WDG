import React, { Component } from 'react';
import './assets/css/light-bootstrap-dashboard.css';
import {getFromStorage} from '../../utils/storage';
import CanvasJS from './assets/js/canvasjs-2.1.3/canvasjs.min.js';
import './assets/css/Admin.css';

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }
    componentDidMount() {
        this.getData();
        
    }
    getData() {
        const obj = getFromStorage("login");

        if (obj && obj.access_token) {
            const { access_token } = obj;
            fetch("/admin/chartData", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`
                }
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.success) { 
                        //console.log(json);
                        var t = 0, t2 = 0;
                        json.userData.forEach(i => {
                            t += i.count
                        })
                        json.saleData.forEach(i => {
                            t2 += i.count
                        })

                        this.setState({ 
                            userData: json.userData,
                            saleData: json.saleData,
                            totalUser: t,
                            totalSale: t2,
                            totalProduct: json.totalProduct,
                            totalAuction: json.totalAuction
                        });
                        //console.log(this.state);
                        this.loadChart();
                    }
                });
        } 
    }
    loadChart() {
        var temp = this.processChartData(this.state.userData);
        var chart = new CanvasJS.Chart("chartUser", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: ""
          },
          data: [
            {
              type: "pie",
              startAngle: 45,
              yValueFormatString: '#,##0.0#"%"',
              dataPoints: temp
            }
          ]
        });
        chart.render();
        var temp2 = this.processChartData(this.state.saleData);
        var chart2 = new CanvasJS.Chart("chartProduct", {
          theme: "light2",
          animationEnabled: true,
          exportEnabled: true,
          title: {
            text: ""
          },
          data: [
            {
              type: "pie",
              startAngle: 45,
              yValueFormatString: '#,##0.0#"%"',
              dataPoints: temp2
            }
          ]
        });
        chart2.render();
    }
    processChartData(list) {
        var temp = [];
        list.forEach((i, index) => {
            temp.push({
                y: i.count,
                label: i._id
            });
        });
        return temp;
    }

    render() {
        return <div className="col-sm-12">
            <div className="row">
                <div className="col-lg-3 col-sm-6">
                    <div className="card card-stats">
                        <div className="card-body ">
                            <div className="row">
                                <div className="col-5">
                                    <div className="icon-big text-center icon-warning">
                                        <i className="nc-icon nc-single-02 text-warning"></i>
                                    </div>
                                </div>
                                <div className="col-7">
                                    <div className="numbers">
                                        <p className="card-category">Số thành viên</p>
                                        <h4 className="card-title">{this.state.totalUser}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer ">
                                    <hr/>
                                        <div className="stats">
                                            <i className="fa fa-clock-o"></i> Từ lúc khai trương
                                    </div>
                                </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-sm-6">
                        <div className="card card-stats">
                            <div className="card-body ">
                                <div className="row">
                                    <div className="col-5">
                                        <div className="icon-big text-center icon-warning">
                                            <i className="nc-icon nc-money-coins text-success"></i>
                                        </div>
                                    </div>
                                    <div className="col-7">
                                        <div className="numbers">
                                            <p className="card-category">Tổng doanh thu</p>
                                            <h4 className="card-title">{this.state.totalSale}VNĐ</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer ">
                                <hr/>
                                    <div className="stats">
                                        <i className="fa fa-calendar-o"></i> Từ lúc khai trương
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-body ">
                                    <div className="row">
                                        <div className="col-5">
                                            <div className="icon-big text-center icon-warning">
                                                <i className="nc-icon nc-tag-content text-danger"></i>
                                            </div>
                                        </div>
                                        <div className="col-7">
                                            <div className="numbers">
                                                <p className="card-category">Tổng số sản phẩm</p>
                                                <h4 className="card-title">{this.state.totalProduct}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer ">
                                    <hr/>
                                        <div className="stats">
                                            <i className="fa fa-clock-o"></i> Từ lúc khai trương
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-sm-6">
                                <div className="card card-stats">
                                    <div className="card-body ">
                                        <div className="row">
                                            <div className="col-5">
                                                <div className="icon-big text-center icon-warning">
                                                    <i className="nc-icon nc-credit-card text-primary"></i>
                                                </div>
                                            </div>
                                            <div className="col-7">
                                                <div className="numbers">
                                                    <p className="card-category">Số phiên đã hoàn thành</p>
                                                    <h4 className="card-title">{this.state.totalAuction}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer ">
                                        <hr/>
                                            <div className="stats">
                                                <i className="fa fa-refresh"></i> Hiện tại
                                    </div>
                                </div>
                                    </div>
                                </div>
                            </div>
            <div className="container-fluid">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card ">
                                <div className="card-header ">
                                    <h4 className="card-title">Thống kê người dùng </h4>
                                    <p className="card-category">Theo loại</p>
                                </div>
                                <div className="card-body ">
                                    <div id="chartPerformance" className="ct-chart">
                                        <div id="chartUser"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card ">
                                <div className="card-header ">
                                    <h4 className="card-title">Thống kê doanh thu</h4>
                                    <p className="card-category">Theo loại sản phẩm</p>
                                </div>
                                <div className="card-body ">
                                    <div id="chartStock" className="ct-chart">
                                        <div id="chartProduct"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-sm-4">
                <div id="chartAuction"></div>
            </div>
          </div>;
    }
}

export default Admin;