import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './ErrorComponent.css';
class ErrorComponent extends Component {
	
	render() {
		console.log(this.props.message);
		return (
			<div className="bigBadBox">
				<div className="header">
					<h1>Đã xảy ra lỗi!</h1>
				</div>
				<div className="w3-main">
					<div className="agile-info">
						<h2>{this.props.message === undefined ? 404: 403}</h2>
						<h3>Rất tiếc</h3>
						<p>{this.props.message === undefined ? "Có vẻ bạn đã tới nhầm nơi!" : this.props.message}</p>
						<Link to="/"><i className="fa fa-angle-double-left" aria-hidden="true"></i>Về trang chủ</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default ErrorComponent;