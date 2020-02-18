import React, { Component } from 'react';
import { BrowserRouter as Link ,Route,  Switch } from 'react-router-dom';
import {getFromStorage} from '../../utils/storage';
import Header from '../Header/HeaderComponent';
import Footer from '../Footer/FooterComponent';
import Copyright from '../Copyright/CopyrightComponent';
import Characteristics from '../Characteristics/CharacteristicsComponent';
import Home from '../Home/Home';
import Profile from '../Profile/Profile';
import Figures from '../Categories/Figures';
import Electronics from '../Categories/Electronics';
import Computers from '../Categories/Computers';
import Appliances from '../Categories/Appliances';
import LuggageAndTravelGear from '../Categories/LuggageAndTravelGear';
import SportsAndOutdoors from '../Categories/SportsAndOutdoors';
import ProductDetail from '../Product/ProductDetail';
import ErrorComponent from '../404/ErrorComponent';
import './MainComStyle.css';
import Sidebar from '../Admin/Sidebar';
import TableProduct from '../Admin/TableProduct';
import TableAuction from "../Admin/TableAuction";
import '../Admin/assets/css/light-bootstrap-dashboard.css';
import TableUser from '../Admin/TableUser';
import TableParameters from '../Admin/TableParameters';
import Admin from '../Admin/Admin';
const UserRoute = (Component, Username, Type) => {	
	return (
        (props) => (
			<React.Fragment>
				<Header username={Username} type={Type}/>
				<Characteristics />
				<Component {...props}/>
				<Footer />
				<Copyright />
			</React.Fragment>
		)
		
	)
};

const AdminRoute = (Component, Username, Type) => {
    return (
        (props) => (
            Type === 0 ? (
                <React.Fragment>
                    <div className="wrapper">
                        <Sidebar />
                        <div className="main-panel">
                            <div className="content">
                                <div className="container-fluid">
                                    <div className="row">
                                        <Component username={Username} {...props} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            ) : (
                <ErrorComponent message="Đây là khu vực của admin, bạn không được phép truy cập!"/>
            )
        )
    )
};

class MainComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accountType: 1
		}
	}
	 
	componentDidMount() {
		this.getType();
	}

	getType() {
		const obj = getFromStorage('login');

        if (obj && obj.access_token) {
            const { access_token } = obj;
            fetch("/account/gettype/" + this.props.username, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`
              }
            })
              .then((res) => res.json())
              .then((json) => {
                this.setState({accountType: json.acc[0].accountType._id});
                console.log(this.state.accountType);
              });
        }
    }
    
    render() {
        const t = this.state.accountType;
        const u = this.props.username;
        return (
            <Link>
                <React.Fragment>
                    <Switch>                        
                        <Route exact path="/" render={UserRoute(Home, u, t)} />
                        <Route path="/profile" render={UserRoute(Profile, u, t)} />
                        <Route path="/Figures" render={UserRoute(Figures, u, t)} />
                        <Route path="/Electronics" render={UserRoute(Electronics, u, t)} />
                        <Route path="/Computers" render={UserRoute(Computers, u, t)} />
                        <Route path="/Appliances" render={UserRoute(Appliances, u, t)} />
                        <Route path="/LuggageAndTravelGear" render={UserRoute(LuggageAndTravelGear, u, t)} />
                        <Route path="/SportsAndOutdoors" render={UserRoute(SportsAndOutdoors, u, t)} />
                        <Route path="/Auction/:type/:id" render={UserRoute(ProductDetail, u, t)} />
                        <Route exact path="/admin" render={AdminRoute(Admin, u, t)} />
                        <Route path="/admin/product" render={AdminRoute(TableProduct, u, t)} />
                        <Route path="/admin/auction" render={AdminRoute(TableAuction, u, t)} />
                        <Route path="/admin/user" render={AdminRoute(TableUser, u, t)} />
                        <Route path="/admin/parameters" render={AdminRoute(TableParameters, u, t)} />
                        <Route path="/:wrong" component={ErrorComponent} />
                    </Switch>
                </React.Fragment>
            </Link>
            );
	}
}

export default MainComponent;