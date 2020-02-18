import React, { Component } from 'react';
import { getFromStorage, removeFromStorage } from "../../utils/storage";
import {Link} from 'react-router-dom';
import './assets/css/Sidebar.css';
class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.onLogout = this.onLogout.bind(this);
	}

	onLogout() {
		const obj = getFromStorage('login');
		if (obj && obj.token_key) {
			const { token_key } = obj;
			fetch('/account/logout?token=' + token_key)
				.then(res => res.json())
				.then(json => {
					if (json.success) {
						removeFromStorage('login');
						window.location.replace('//localhost:3000');
					}
				});
		}
	}
	render() {
		const iconStyle = { verticalAlign: "middle", paddingTop: 5 };
		const linkStyle = {	paddingLeft: 50	};
		const menuStyle = { paddingTop: 10 };
		return (
			<div className="sidebar" data-color="blue">
				<div className="sidebar-wrapper">
					<div className="user">
						<div className="photo">
							<center><i className="nc-icon nc-single-02" style={iconStyle}></i></center>
						</div>
						<div className="info ">
							<a data-toggle="collapse" href="#collapseExample" className="collapsed">
								<span>{getFromStorage('login').username}
                                	<b className="caret"></b>
								</span>
							</a>
							<div className="collapse" id="collapseExample">
								<ul className="nav" style={menuStyle}>
									<li className="nav-item">
										<Link className="profile-dropdown" to="/profile">
											<span className="sidebar-mini">TK</span>
											<span className="sidebar-normal" style={linkStyle}>Tài khoản</span>
										</Link>
									</li>
									<li className="nav-item">
										<a className="profile-dropdown" onClick={this.onLogout} href="">
											<span className="sidebar-mini">ĐX</span>
											<span className="sidebar-normal" style={linkStyle}>Đăng Xuất</span>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<ul className="nav">
						<li className="nav-item ">
							<Link className="nav-link" to="/admin">
								<i className="nc-icon nc-chart-pie-35"></i>
								<p>Dashboard</p>
							</Link>
						</li>
						<li className="nav-item ">
							<Link className="nav-link" to="/">
								<i className="nc-icon nc-bank"></i>
								<p>Trang chủ</p>
							</Link>
						</li>
						<li className="nav-item">
							<a className="nav-link" data-toggle="collapse" href="#componentsExamples">
								<i className="nc-icon nc-bullet-list-67"></i>
								<p>Danh mục<b className="caret"></b></p>
							</a>
							<div className="collapse " id="componentsExamples">
								<ul className="nav">
									<li className="nav-item ">
										<Link className="nav-link" to="/admin/product">
											<span className="sidebar-mini">SP</span>
											<span className="sidebar-normal">Sản phẩm</span>
										</Link>
									</li>
									<li className="nav-item ">
										<Link className="nav-link" to="/admin/auction">
											<span className="sidebar-mini">PĐG</span>
											<span className="sidebar-normal">Phiên đấu giá</span>
										</Link>
									</li>
									<li className="nav-item ">
										<Link className="nav-link" to="/admin/user">
											<span className="sidebar-mini">ND</span>
											<span className="sidebar-normal">Người dùng</span>
										</Link>
									</li>
									<li className="nav-item ">
										<Link className="nav-link" to="/admin/parameters">
											<span className="sidebar-mini">TS</span>
											<span className="sidebar-normal">Tham Số</span>
										</Link>
									</li>
								</ul>
							</div>
						</li>
					</ul>
				</div>
			</div>
		);
	}
}

export default Sidebar;