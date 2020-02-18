import React, { Component } from 'react'; 
import Modal from 'react-responsive-modal';
import { NavLink } from 'react-router-dom';
import './HeaderMain.css';
import {getFromStorage} from '../../../utils/storage';
import ReactOverflowTooltip from 'react-overflow-tooltip';
class HeaderMain extends Component {
    constructor(props) {
      super(props);
      this.state = {
        search: '',
        productList: [],
        cartList: [],
        open: false,
        getList: [],
        delList: []
      };
      
      this.handleChangeSearch = this.handleChangeSearch.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.getCartList = this.getCartList.bind(this);
      this.handleGet = this.handleGet.bind(this);
      this.handleDel = this.handleDel.bind(this);
      this.handleConfirm = this.handleConfirm.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.handleChangeSearch = this.handleChangeSearch.bind(this);
      this.onOpenModal = this.onOpenModal.bind(this);
      this.onCloseModal = this.onCloseModal.bind(this);
  }

  componentDidMount() {
    this.getCartList();
  }
  getCartList() {
    const obj = getFromStorage('login');

    if (obj && obj.access_token) {
      const { access_token, username } = obj;
      fetch("/account/getOrder/" + username, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${access_token}`
        }
      })
        .then((res) => res.json())
        .then((json) => {
          this.setState({ cartList: json })
          //console.log(this.state.cartList);
        });
    }    
  }
  onOpenModal = () => { this.getCartList(); this.setState({ open: true });};
  onCloseModal = () => {this.setState({ open: false });};

  handleChangeSearch(event) {this.setState({search: event.target.value});}
  handleSearch(event) {event.preventDefault();}


  handleGet = (e) => {
    var currentID = e.target.id.substr(3);
    if (e.target.checked === true) {
      this.setState({ getList: [...this.state.getList, currentID] });
      document.getElementById(`del${currentID}`).setAttribute("disabled", "disabled");
    }
    else {
      this.setState({getList: this.state.getList.filter(g => {
        return g !== currentID;
      })});
      document.getElementById(`del${currentID}`).removeAttribute("disabled");
    }
  }


  handleDel = (e) => {
    var currentID = e.target.id.substr(3);
    if (e.target.checked === true) {
      this.setState({ delList: [...this.state.delList, currentID] });
      document.getElementById(`get${currentID}`).setAttribute("disabled", "disabled");
    }
    else {
      this.setState({
        delList: this.state.delList.filter(g => {
          return g !== currentID;
        })
      });
      document.getElementById(`get${currentID}`).removeAttribute("disabled");
    }
  }

  handleConfirm = (e) => {
    e.preventDefault();
    const obj = getFromStorage('login');

    if (obj && obj.access_token) {
      const { access_token } = obj;
      fetch('/account/updateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify({
          getL: this.state.getList,
          delL: this.state.delList
        })
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            alert('Thành công');
            this.onCloseModal();
          }
          else {
            alert('Xảy ra lỗi');
            this.onCloseModal();
          }
        });
    }        
  }
  
    render() {
      const open = this.state.open; 
      const tableStyle = {
        "verticalAlign": "middle",
        "textAlign": "center"
      }
      const sliderStyle = {
        
      }
      const arr = this.state.cartList;
      const tableCart = () => {
        return ( 
          <div className="col-md-12">
            <div className="card table-with-switches" style={tableStyle}>
              <div className="card-header ">
                <h4 className="card-title"><center><h3>Danh sách chờ đặt hàng</h3></center></h4>
              </div>
              <div className="card-body table-full-width">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th>Tên sản phẩm</th>
                      <th className="text-center">Miêu tả</th>
                      <th className="text-center">Số tiền phải trả</th>
                      <th className="text-center">Đặt hàng</th>
                      <th className="text-center">Hủy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      arr.map((item, index) => (
                        <tr key={item._id}>
                          <td className="text-center">{item.sessionID}</td>
                          <td className="text-center longtext" >
                            <ReactOverflowTooltip title={item.p.productName}>
                              <div>{item.p.productName}</div>
                            </ReactOverflowTooltip>
                          </td>
                          <td className="text-center longtext" >{item.p.description}</td>
                          <td className="text-center">{item.au.currentPrice}</td>
                          <td className="text-center">
                            <label className="switch">
                              <input type="checkbox" id={`get${item._id}`} onChange={this.handleGet} />
                              <span className="slider round" ></span>
                            </label>
                          </td>
                          <td className="text-center">
                            <label className="switch">
                              <input type="checkbox" id={`del${item._id}`} onChange={this.handleDel} />
                              <span className="slider round del" style={sliderStyle}></span>
                            </label>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <button className="btn btn-success" disabled={(this.state.getList.length === 0 && this.state.delList.length === 0) ? "disabled" : null} onClick={this.handleConfirm}>Xác nhận</button>
              </div>
            </div>
          </div>   
          )
      }
        return <div className="header_main">
            <div className="container">
              <div className="row">
                {/*Logo*/}
                <div className="col-lg-2 col-sm-3 col-3 order-1">
                  <div className="logo_container">
                    <div className="logo">
                      <NavLink to="/">
                        <img src="images/logo.png" alt="" width="120" height="75.6" />
                      </NavLink>
                    </div>
                  </div>
                </div>

                {/*Search*/}
                <div className="col-lg-8 col-12 order-lg-2 order-3 text-lg-left text-right">
                  {/* <div className="header_search">
                    <div className="header_search_content">
                      <div className="header_search_form_container">
                        <form className="header_search_form clearfix" onSubmit={this.handleSearch}>
                          <input type="search" required className="header_search_input" placeholder="Tìm sản phẩm..." value={this.state.search} onChange={this.handleChangeSearch} />

                          <button type="submit" className="header_search_button trans_300" value="Submit">
                            <i className={this.state.search === "" ? "fa fa-search on" : "off"} />
                            
                          </button>
                        </form>
                      </div>
                    </div>
                  </div> */}
                </div>

                {/*Wishlist*/}
                <div className="col-lg-2 col-9 order-lg-3 order-2 text-lg-left text-right">
                  <div className="wishlist_cart d-flex flex-row align-items-center justify-content-end">
                    {/*Cart*/}
                    <div className="cart">
                      <div className="cart_container d-flex flex-row align-items-center justify-content-end">
                        <div className="cart_content">
                          <div className="cart_text">
                            <button className="btn btn-primary cart" onClick={this.onOpenModal}>
                              <img src="images/Bag.png" alt="" width="40" height="40" /> Giỏ hàng
                            </button>
                            <Modal open={open} onClose={this.onCloseModal} center>
                              {tableCart()}
                            </Modal>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>;
    }
}

 export default HeaderMain;