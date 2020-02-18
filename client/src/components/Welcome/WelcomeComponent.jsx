import React, { Component } from 'react';
import { getFromStorage, setInStorage } from '../../utils/storage';
import MainComponent from '../Main/MainComponent';
import './WelcomeComponent.css';
import BackgroundPage from './imgSrc/bg.jpg';
import BackgroundForm from './imgSrc/bg3.jpg';
import { cambiar_login, cambiar_sign_up, ocultar_login_sign_up } from './Welcome.js';
import LoadingComponent from '../Loading/LoadingComponent';

export default class WelcomeComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            token: '',
            accountType: 1,
            signUpError: '',
            signUpUsername:'',
            signUpPassword:'',
            signUpFullname:'',
            signUpEmail:'',
            signUpPhone:'',
            signUpAddress:'',

            signInError: '',
            signInUsername: '',
            signInPassword: ''
        };

        this.onTextboxChangeSignInUsername = this.onTextboxChangeSignInUsername.bind(this);
        this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
        this.onTextboxChangeSignUpUsername = this.onTextboxChangeSignUpUsername.bind(this);
        this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
        this.onTextboxChangeSignUpFullname = this.onTextboxChangeSignUpFullname.bind(this);
        this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
        this.onTextboxChangeSignUpPhone = this.onTextboxChangeSignUpPhone.bind(this);
        this.onTextboxChangeSignUpAddress = this.onTextboxChangeSignUpAddress.bind(this);

        this.onSignIn = this.onSignIn.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
    }
    
    componentDidMount() {
        this.verifyToken();       
    }

    verifyToken() {
        const obj = getFromStorage('login');

        if (obj && obj.token_key) {
            const { username, token_key } = obj;
            // Verify token
            fetch('/account/verify?token=' + token_key)
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        this.setState({
                            token: token_key,
                            signInUsername: username,                            
                            isLoading: false
                        });
                    } else {
                        this.setState({
                            token: '',
                            isLoading: false
                        });
                    }
                });
        } else {
            this.setState({
                token: '',
                isLoading: false
            });
        }
    }

    // Button Sign In Clicked event
    onSignIn() {
        const {
            signInUsername,
            signInPassword
        } = this.state;

        fetch('/account/signin', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: signInUsername,
                password: signInPassword,                
            }) 
        }).then(res => res.json())
            .then(json => {
                if (json.success) {                    
                    setInStorage('login', {
                        access_token: json.access_token, 
                        token_key: json.token,
                        username: signInUsername
                    });
                    this.setState({
                        signInError: json.message,
                        isLoading: false,
                        token: json.token,
                        accountType: json.accountType        
                    });
                    console.log(this.state.accountType);
                } else {
                    this.setState({
                        signInError: json.message,
                        isLoading: false
                    });
                }
            });
    }

    // Button Sign Up Clicked event
    onSignUp() {
        const {
            signUpUsername,
            signUpPassword,
            signUpFullname,
            signUpEmail,
            signUpPhone,
            signUpAddress,
        } = this.state;

        fetch('/account/signup', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: signUpUsername,
                password: signUpPassword,
                fullname: signUpFullname,
                email: signUpEmail,
                phone: signUpPhone,
                address: signUpAddress,
            }) 
        }).then(res => res.json())
            .then(json => {
                if (json.success) {
                    this.setState({
                        signUpError: json.message,
                        isLoading: false,
                        signUpUsername: '',
                        signUpPassword: '',
                        signUpFullname: '',
                        signUpEmail: '',
                        signUpPhone: '',
                        signUpAddress: ''
                    });
                } else {
                    this.setState({
                        signUpError: json.message,
                        isLoading: false
                    });
                }
            });
    }

    onTextboxChangeSignInUsername(event) {
        this.setState({
            signInUsername: event.target.value,
        });
    }

    onTextboxChangeSignInPassword(event) {
        this.setState({
            signInPassword: event.target.value,
        });
    }

    onTextboxChangeSignUpUsername(event) {
        this.setState({
            signUpUsername: event.target.value,
        });
    }

    onTextboxChangeSignUpPassword(event) {
        this.setState({
            signUpPassword: event.target.value,
        });
    }

    onTextboxChangeSignUpFullname(event) {
        this.setState({
            signUpFullname: event.target.value,
        });
    }

    onTextboxChangeSignUpEmail(event) {
        this.setState({
            signUpEmail: event.target.value,
        });
    }

    onTextboxChangeSignUpPhone(event) {
        this.setState({
            signUpPhone: event.target.value,
        });
    }

    onTextboxChangeSignUpAddress(event) {
        this.setState({
            signUpAddress: event.target.value,
        });
    }

    render() {
        const {
            isLoading,
            token,
            accountType,

            signInError,
            signInUsername,
            signInPassword,

            signUpError,
            signUpUsername,
            signUpPassword,
            signUpFullname,
            signUpEmail,
            signUpPhone,
            signUpAddress,            
        } = this.state;

        if (isLoading) {
            return (
            <LoadingComponent/>
        );
        }
        if (!token) {
            return (                
                <div>
                    <img className="imgPage" src={BackgroundPage} alt=""/>
                    <div className="cotn_principal">
                        <div className="cont_centrar">
                            <br/>
                            <span className="titlePage">Chào mừng đến với trang web đấu giá Chidori</span>
                            <div className="cont_login">
                                <div className="cont_info_log_sign_up">
                                    <div className="col_md_login">
                                        <div className="cont_ba_opcitiy">
                                            <h2>ĐĂNG NHẬP</h2>  
                                            <p>Đăng nhập ngay để có thể sử dụng dịch vụ của chúng tôi.</p> 
                                            <button className="btn_login" onClick={cambiar_login}>ĐĂNG NHẬP</button>
                                        </div>
                                    </div>
                                        <div className="col_md_sign_up">
                                        <div className="cont_ba_opcitiy">
                                            <h2>ĐĂNG KÝ</h2>
                                            <p>Đăng ký tài khoản ngay nếu bạn chưa có tài khoản.</p>
                                            <button className="btn_sign_up" onClick={cambiar_sign_up}>ĐĂNG KÝ</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="cont_back_info">
                                    <div className="cont_img_back_grey">
                                        <img src={BackgroundForm} alt="" />
                                    </div>
                                </div>
                                <div className="cont_forms" >
                                    <div className="cont_img_back_">
                                        <img src={BackgroundForm} alt="" />
                                    </div>
                                    <div className="cont_form_login">
                                        <button className="welcomeButtonForm" onClick={ocultar_login_sign_up}><i className="material-icons">&#xE5C4;</i></button>
                                        <h2>ĐĂNG NHẬP</h2>
                                        <input type="text" name="username" id="lo-u-name" value={signInUsername} onChange={this.onTextboxChangeSignInUsername} placeholder="Tên đăng nhập..."/>
                                        <input type="password" name="password" id="lo-pw" value={signInPassword} onChange={this.onTextboxChangeSignInPassword} placeholder="Mật khẩu..."/>
                                        {
                                            (signInError) ? (
                                                <p className="loginNoti">{signInError}</p>
                                            ) : (null)
                                        }
                                        <button className="btn_login" id="btnSignin" onClick={this.onSignIn}>ĐĂNG NHẬP</button>
                                    </div>
                                    <div className="cont_form_sign_up">
                                        <button className="welcomeButtonForm" onClick={ocultar_login_sign_up}><i className="material-icons">&#xE5C4;</i></button>
                                        <h2>ĐĂNG KÝ</h2>                                       
                                        <input type="text" name="username" id="reg-u-name" value={signUpUsername} onChange={this.onTextboxChangeSignUpUsername} placeholder="Tên đăng nhập..."/>
                                        <input type="password" name="password" id="reg-pw" value={signUpPassword} onChange={this.onTextboxChangeSignUpPassword} placeholder="Mật khẩu..."/>
                                        <input type="text" name="fullname" id="reg-fu-name" value={signUpFullname} onChange={this.onTextboxChangeSignUpFullname} placeholder="Họ tên..."/>
                                        <input type="email" name="email" id="email" value={signUpEmail} onChange={this.onTextboxChangeSignUpEmail} placeholder="Email..."/>
                                        <input type="text" name="phone" id="reg-phone" value={signUpPhone} onChange={this.onTextboxChangeSignUpPhone} placeholder="Điện thoại..."/>
                                        <input type="text" name="address" id="reg-address" value={signUpAddress} onChange={this.onTextboxChangeSignUpAddress} placeholder="Địa chỉ..."/>
                                        {
                                            (signUpError) ? (
                                                <p className="signupNoti">{signUpError}</p>
                                            ) : (null)
                                        }
                                        <button className="btn_sign_up" id="btnSignup" onClick={this.onSignUp}>ĐĂNG KÝ</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (token && (accountType === 1 || accountType === 0)){            
            return (
                 <MainComponent username={this.state.signInUsername}/>
            );
        }             
    }
}
