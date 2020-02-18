import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import './FooterComponent.css';
class FooterComponent extends Component {
    render() {
        return <footer className="footer">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 footer_col">
                  <div className="footer_column footer_contact">
                    <div className="logo_container">
                      <div className="logo">
                        <NavLink to="/">Chidori</NavLink>
                      </div>
                    </div>
                    <div className="footer_title">
                      Cần được tư vấn? Hãy gọi chúng tôi 24/7
                    </div>
                    <div className="footer_phone">+84 xxx xxx xxxx</div>
                    <div className="footer_contact_text">
                      <p>227 Đường Nguyễn Văn Cừ</p>
                      <p>Phường 4, Quận 5, Hồ Chí Minh</p>
                    </div>
                    <div className="footer_social">
                      <ul>
                        <li>
                          <a role="button" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/">
                            <i className="fab fa-facebook-f" />
                          </a>
                        </li>
                        <li>
                          <a role="button" target="_blank" rel="noopener noreferrer" href="https://twitter.com/">
                            <i className="fab fa-twitter" />
                          </a>
                        </li>
                        <li>
                          <a role="button" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/">
                            <i className="fab fa-youtube" />
                          </a>
                        </li>
                        <li>
                          <a role="button" target="_blank" rel="noopener noreferrer" href="https://plus.google.com/">
                            <i className="fab fa-google" />
                          </a>
                        </li>
                        <li>
                          <a role="button" target="_blank" rel="noopener noreferrer" href="https://www.vimeo.com">
                            <i className="fab fa-vimeo-v" />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2 offset-lg-2">
                  <div className="footer_column">
                    <div className="footer_title">Tìm kiếm nhanh chóng</div>
                    <ul className="footer_list">
                        <li>
                            <NavLink to="/Figures">Figures</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Electronics">điện tử</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Computers">Linh kiện máy tính</NavLink>
                        </li>
                        <li>
                            <NavLink to="/Appliances">điện gia dụng</NavLink>
                        </li>
                        <li>
                            <NavLink to="/LuggageAndTravelGear">du lịch</NavLink>
                        </li>
                        <li>
                            <NavLink to="/SportsAndOutdoors">Thể thao</NavLink>
                        </li>
                    </ul>
                  </div>
                </div>

                <div className="col-lg-2">
                  <div className="footer_column">
                    
                  </div>
                </div>

                <div className="col-lg-2">
                  <div className="footer_column">
                    <div className="footer_title">Chăm sóc khách hàng</div>
                    <ul className="footer_list">
                        <li>FAQ</li>
                        <li>Đơn hàng</li>
                        <li>Lịch sử đấu giá</li>
                        <li>Góp ý</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </footer>;
    }
}

export default FooterComponent;