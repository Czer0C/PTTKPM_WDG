import React, { Component } from 'react';
import './LoadingComponent.css';
class LoadingComponent extends Component {
	render() {
		return (
		<div className="loadingBox">
        <img src="https://cdn.dribbble.com/users/80078/screenshots/995621/loading.gif" alt="" />
		<h1>Loading...</h1>
      </div>);
	}
}

export default LoadingComponent;