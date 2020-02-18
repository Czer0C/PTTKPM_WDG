import React, { Component } from 'react';
import "./assets/css/Table.css";

import Modal from 'react-responsive-modal';
import { getFromStorage } from '../../utils/storage';

class TableAuction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			open: false,
			openDelivery: false,
			checkType: 1, // 1 bắt đầu, 
			currentID: null,
			modalType: 1, // 1 Thêm, 2 sửa
			updateBidTime: null,
			updateStatus: null,
			updateInitPrice: null,
			updateProductID: null,
			openConfirm: false,
			productList: [],
			msg: "",
			currentTicket: {
				accountID: "",
				ats: {
					statusName: ""
				},
				bidValue: 0,
				sessionID: "",
				status: 0,
				_id: "",
				isDeleted: false
			},
			ticketList: []

		};
	}
	handleOnChangeProductID = (e) => { this.setState({ updateProductID: e.target.value});}
	handleOnChangeBidTime = (e) => {
		this.setState({
			updateBidTime: e.target.value
		})
	}
	handleOnChangeInitPrice = (e) => {this.setState({updateInitPrice: e.target.value});}
	componentDidMount() { 
		this.getAuction(); 
		this.getProduct(); 
		this.getTicket(); 
		setInterval(() => {
			this.getAuction();
			this.getProduct();
			this.getTicket();
		}, 5000)
	}
	onOpenModal = () => { this.setState({ open: true }); };
	onCloseModal = () => { this.setState({ open: false }); };
	onCloseDelivery = () => {this.setState({openDelivery: false}); };
	onOpenDeliveryBox = () => { this.setState({openDelivery: true}); };
	onCloseConfirm = () => {this.setState({openConfirm: false});};
	onOpenConfirm = () => {this.setState({openConfirm: true});};
	handleSearch = () => {
		var input, filter, table, tr, td, i;
		input = document.getElementById("searchInput");
		filter = input.value.toUpperCase();
		table = document.getElementById("mainDataTable");
		tr = table.getElementsByTagName("tr");
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td")[1];
			if (td) {
				if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
					tr[i].style.display = "";
				} else {
					tr[i].style.display = "none";
				}
			}
		}
	};

	getAuction() {
		const obj = getFromStorage("login");
		if (obj && obj.access_token) {
			const { access_token } = obj;
			fetch("/admin/auction", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				}
			})
			.then((res) => res.json())
			.then((json) => {
				this.setState({ list: json.list });
				//console.log(this.state.list);
			});
		}
	}
	getProduct() {
		const obj = getFromStorage("login");

		if (obj && obj.access_token) {
			const { access_token } = obj;
			fetch("/admin/productListAU", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				}
			})
			.then((res) => res.json())
			.then((json) => {
				this.setState({ productList: json.plist });
				//console.log(this.state.productList);
			});
		}
	}
	getTicket() {
		const obj = getFromStorage("login");
		if (obj && obj.access_token) {
			const { access_token } = obj;
			fetch("/admin/ticket/", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				}
			})
				.then((res) => res.json())
				.then((json) => {	
					this.setState({
						ticketList: json.tlist
					});
					//console.log(this.state.ticketList);
				});
		}
	} 
	handleDelivery = (e) => {
		e.preventDefault();
		if (e.target.id) {
			var sID = this.state.list.filter(i => {
				return i._id === e.target.id.substr(4);
			})[0].sessionID; // get current row' sessionID
			var ct = this.state.ticketList.filter(j => {
				return j.sessionID === sID; 
			})[0]; // Find ticket that matches current row' session ID.
			if (ct) {
				this.setState({
					currentID: e.target.id.substr(4),
					currentTicket: ct
				}, this.onOpenDeliveryBox());
			}
			else {
				alert("Lỗi ngoài ý muốn xảy ra");
			}
				
		}
		//this.setState({ currentID: e.target.id.substr(4), checkType: 2 });
	}
	submitAuctionSession() {
		const obj = getFromStorage('login');
		if (obj && obj.access_token) {
			var ID = this.state.currentID; // get current row ID
			const { access_token } = obj;
			fetch(`/admin/auction`, {
				method: `${this.state.modalType === 1 ? "POST" : "PUT"}`,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					key: ID,
					val: [
						this.state.updateBidTime,
						this.state.updateStatus,
						this.state.updateInitPrice,
						this.state.updateProductID
					]
				})
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						this.getAuction();
					} else {
						alert("Xảy ra lỗi");
					}
				});
		} 
	}
	handleModalYes = () => {
		switch (this.state.checkType) {
			case 1:
				this.beginAU();
				break;
			case 2:
				
				break;
			case 3:
				this.deleteAU();
				break;
			case 4:
				this.deliver();
				this.onCloseConfirm();
				break;
			case 5:
				this.deleteAT();
				this.onCloseConfirm();
				break;
		
			default:
				break;
		}
	}
	deleteAU = () => {
		const obj = getFromStorage('login');

		if (obj && obj.access_token) {
			var ID = this.state.currentID; // current row
			var checkDisable = document.getElementById(`adel${ID}`);
			const { access_token } = obj;
			fetch("/admin/auction", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					key: ID,
					val: !checkDisable.checked
				})
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						var temp = JSON.parse(JSON.stringify(this.state.list));
						temp.forEach((i) => {
							if (i._id === ID) {
								i.isDeleted = !i.isDeleted;
							}
						});
						this.setState({ list: temp });
					} else {
						alert("Xảy ra lỗi");
					}
				});
		} 
	}
	deleteAT = () => {
		const obj = getFromStorage('login');

		if (obj && obj.access_token) {
			var ID = this.state.currentID; // current row
			var checkDisable = document.getElementById(`dele${ID}`);
			const { access_token } = obj;
			fetch("/admin/ticket", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					key: ID,
					val: !checkDisable.checked
				})
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						var temp = JSON.parse(JSON.stringify(this.state.ticketList));
						temp.forEach((i) => {
							if (i._id === ID) {
								i.isDeleted = !i.isDeleted;
								this.setState({currentTicket: i});
							}
						});
						this.setState({ ticketList: temp });
					} else {
						alert("Xảy ra lỗi");
					}
				});
		} 	
	}
	beginAU = () => {
		const obj = getFromStorage('login');

		if (obj && obj.access_token) {
			var ID = this.state.currentID; // current row
			var checkBox = document.getElementById(`abeg${ID}`);
			const { access_token } = obj;
			fetch("/admin/beginAuction", {
				method: "POST",	
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					key: ID,
					val: this.state.checkType
				})
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						this.getAuction();
						checkBox.checked = true;
					} else {
						alert("Xảy ra lỗi");
					}
				});
		} 
	}
	deliver = () => {
		const obj = getFromStorage('login');

		if (obj && obj.access_token) {
			var ID = this.state.currentID; // current row
			var checkBox = document.getElementById(`deli${ID}`);
			const { access_token } = obj;
			fetch("/admin/delivery", {
				method: "POST",	
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					key: ID
				})
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						var temp = JSON.parse(JSON.stringify(this.state.ticketList));
						temp.forEach((i) => {
							if (i._id === ID) {
								i.status = 4;
								i.ats.statusName = "Đang giao hàng";
							}
						});
						this.setState({ ticketList: temp });
						checkBox.checked = true;
						checkBox.disabled = true;
					} else {
						alert("Xảy ra lỗi");
					}
				});
		} 
	}
	handleAdd = () => {
		this.setState({
			open: true, 
			modalType: 1, 
			currentID: "",
			updateBidTime: "00:00:10",
			updateStatus: 0,
			updateInitPrice: 10000,
			updateProductID: this.state.productList[0]._id // Mặc định là cái đầu tiên.
		})
	}
	handleCheckDeleteAT = (e) => {
		e.preventDefault();
		if (e.target.id) {
			this.setState({
				currentID: e.target.id.substr(4),
				checkType: 5,
				msg: "Vô hiệu hóa phiếu này?",
				openConfirm: true
			})
		}
	}
	handleUpdate = (e) => {
		if (e.target.id) {
			var q = this.state.list.filter(i => {
				return i._id === e.target.id.substr(4);
			})[0];
			this.setState({
				modalType: 2,
				currentID: q._id,
				updateStatus: q.status,
				updateBidTime: q.bidTime,
				updateInitPrice: q.initPrice,
				updateProductID: q.p._id
			}, this.onOpenModal());
		}
	}
	handleSubmit = () => {
		this.submitAuctionSession();
		this.onCloseModal();
	}
	handleCheckBegin = (e) => {
		e.preventDefault();
		this.setState({currentID: e.target.id.substr(4), checkType: 1, msg: "Bắt đầu phiên đấu? (không thề hoàn tác)"});
	}
	
	handleCheckDeleted = (e) => {
		e.preventDefault();
		this.setState({ currentID: e.target.id.substr(4), checkType: 3, msg: "Vô hiệu hóa phiên này?" });
	}
	handleCheckDelivery = (e) => {
		e.preventDefault();
		if (e.target.id) {
			this.setState({ 
				currentID: e.target.id.substr(4), 
				checkType: 4, 
				msg: "Tiến hành giao hàng? (không thề hoàn tác)",
				openConfirm: true
			});
		}
	}
	validate = () => {
		return (this.state.updateBidTime === "" || this.state.updateStatus === "" | this.state.updateInitPrice === "" || this.state.updateProductID === "");
	}
	createForm = () => {
		var t = this.state.productList;
		return (
          <div>
            <b><center><h2>{this.state.modalType === 1 ? "Thêm phiên đấu giá" : "Chỉnh sửa thông tin phiên đấu giá"}</h2></center></b>
            <form className="col-sm-12" onSubmit={(e) => {e.preventDefault();}}>
              <div className="form-group row col-sm-12">
                <label htmlFor="productName" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                <div className="col-sm-8">
                  <select value={this.state.updateProductID} onChange={this.handleOnChangeProductID} className="form-control au">
                    {
						t.map((item, index) => (
							<option key={item._id} value={item._id}>{item.productName}</option>
						))
					}
                  </select>
                </div>
              </div>
              <div className="form-group row col-sm-12">
				<label htmlFor="productName" className="col-sm-2 col-form-label">Thời lượng</label>
                <div className="col-sm-8">
                  	<input type="text" step="1" className="form-control" required value={this.state.updateBidTime} onChange={this.handleOnChangeBidTime}/>
                </div>
                <div className={this.state.updateBidTime === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateBidTime === "" ? "Đừng bỏ trống" : "✔"}</div>
              </div>
			  <div className="form-group row col-sm-12">
                <label htmlFor="productName" className="col-sm-2 col-form-label">Giá khởi đầu</label>
                <div className="col-sm-8">
                  <input type="number" className="form-control" required value={this.state.updateInitPrice} onChange={this.handleOnChangeInitPrice}/>
                </div>
                <div className={this.state.updateInitPrice === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateInitPrice === "" ? "Đừng bỏ trống" : "✔"}</div>
              </div>
              <center><button className="btn btn-primary" disabled={this.validate() ? "disabled" : null} onClick={this.handleSubmit}>{this.state.modalType === 1 ? "Thêm" : "Cập nhật"}</button><button className="btn btn-danger" id="adminProductAdd" onClick={this.onCloseModal}>Thoát</button></center>
            </form>
          </div>
        );
	}
	deliveryBox = () => {
		const tableStyle = {
			verticalAlign: "middle",
			textAlign: "center"
		};
		var ct = this.state.currentTicket;
		return (
			<div className="card table-with-switches" style={tableStyle}>
				<div className="card-header ">
					<h2 className="card-title">
						<b>Quá trình giao hàng</b>
					</h2>					
				</div>
				<div className="card-body table-full-width">	
					<table className="table table-striped table-bordered" id="mainDataTable">
						<thead>
							<tr>
								<th className="text-center">Tài khoản thắng phiên</th>
								<th className="text-center">Số tiền phải trả</th>
								<th className="text-center">Trạng thái</th>
								<th className="text-center">Giao hàng</th>
								<th className="text-center">Vô hiệu hóa</th>
							</tr>
						</thead>
						<tbody id="mainDataTableBody">
							<tr>
								<td className="text-center">{ct.accountID}</td>
								<td className="text-center">{ct.bidValue}</td>
								<td className="text-center">{ct.ats.statusName}</td>
								<td className="text-center ">
									<label className="switch">
										<input type="checkbox" onClick={this.handleCheckDelivery} disabled={(!ct.isDeleted && ct.status === 2) ? null : "disabled"} id={`deli${ct._id}`} checked={ct.status === 4 ? true : null} />
										<span className="slider round delivery" />
									</label>
								</td>
								<td className="text-center ">
									<label className="switch">
										<input type="checkbox" onChange={() => { }} onClick={this.handleCheckDeleteAT} id={`dele${ct._id}`} checked={ct.isDeleted} disabled={(ct.status !== 3 && ct.status !== 5 && ct.status !== 6) ? "disabled" : null} />
										<span className="slider round disable" />
									</label>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		);
	}
	
	confirmBox = () => {
		return <div>
			<div className="asdasads">
				<p className="heading">{this.state.msg}</p>
			</div>
			<br/><br/>
			<div>
				<button className="btn btn-primary" onClick={this.handleModalYes}>Xác nhận</button><button className="btn btn-danger" onClick={this.onCloseConfirm}>Hủy</button>
			</div>
		</div>;
	}
	render() {
		const tableStyle = {
			verticalAlign: "middle",
			textAlign: "center"
		};
		
		var arr = this.state.list;

		return (
			<div className="col-md-12">
				<Modal open={this.state.open} onClose={this.onCloseModal} center>
					{this.createForm()}
				</Modal>
				<Modal open={this.state.openDelivery} onClose={this.onCloseDelivery} center>
					{this.deliveryBox()}
				</Modal>
				<Modal open={this.state.openConfirm} onClose={this.onCloseConfirm} center>
					{this.confirmBox()}
				</Modal>

				{/* Modal confirm */}
				<div className="modal fade" id="modalConfirmDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-sm modal-notify modal-primary" role="document">
						<div className="modal-content text-center">
						<div className="modal-header d-flex justify-content-center">
							<p className="heading">{this.state.checkType === 1 ? "Bắt đầu phiên đấu? (Không thể hoàn tác)" : "Xác nhận thay đổi?"}</p>
						</div>
						<div className="modal-body">
							<i className="fa fa-times fa-4x animated rotateIn" id="modal-x-icon" />
						</div>
						<div className="modal-footer flex-center">
							<button className="btn btn-outline-primary" onClick={this.handleModalYes} data-dismiss="modal">
								Xác nhận
							</button>
							<button className="btn btn-primary waves-effect" data-dismiss="modal">
								Thoát
							</button>
						</div>
						</div>
					</div>
				</div>
				{/* Modal confirm */}

				<div className="card table-with-switches" style={tableStyle}>
					<div className="card-header ">
						<h2 className="card-title">
							<b>Danh sách phiên đấu giá</b>
						</h2>
						<button className="btn btn-info col-sm-1" tooltip="Thêm" id="btnAdd" onClick={this.handleAdd} tooltip-position="buttom">
							<i className="nc-icon nc-simple-add" />
						</button>
						<div className="form-group row">
							<label htmlFor="searchInput" className="col-sm-1 col-form-label">
								Tìm kiếm:
              				</label>
							<div className="col-sm-8">
								<input type="text" className="form-control tab-search col-sm-3" id="searchInput" onKeyUp={this.handleSearch} placeholder="Nhập tên cần tìm.." title="Tìm kiếm theo tên sản phẩm" />
							</div>
						</div>
					</div>
					<div className="card-body table-full-width">
						<table className="table table-striped table-bordered" id="mainDataTable">
							<thead>
								<tr>
									<th className="text-center">Mã phiên</th>
									<th className="text-center">Tên sản phẩm</th>
									<th className="text-center">Thời gian bắt đầu</th>
									<th className="text-center">Thời gian đấu</th>
									<th className="text-center">Trạng thái</th>
									<th className="text-center">Giá khởi đầu</th>
									<th className="text-center">Giá hiện tại</th>
									<th className="text-center">Thao tác</th>
									<th className="text-center">Bắt đầu</th>
									<th className="text-center">Vô hiệu hóa</th>
								</tr>
							</thead>
							<tbody id="mainDataTableBody">
								{arr.map((item, index) => <tr key={item._id}>
									<td className="text-center">{item.sessionID}</td>
									<td className="text-center longtext">
									{item.p.productName}
									</td>
									<td className="text-center">{item.startTime}</td>
									<td className="text-center">{item.bidTime}</td>
									<td className="text-center">{item.aus.statusName}</td>
									<td className="text-center">{item.initPrice}</td>
									<td className="text-center">{item.currentPrice}</td>
									<td className="td-actions text-center ">
										<button className="btn btn-success" tooltip="Xem/Sửa" disabled={!item.isDeleted ? item.status === 0 ? null : "disabled" : "disabled"} id={`afix${item._id}`} onClick={this.handleUpdate} tooltip-position="buttom">
											<i className="nc-icon nc-settings-tool-66" />
										</button>
										<button className="btn btn-primary" tooltip="Giao hàng" disabled={!item.isDeleted ? item.status === -1 ? null : "disabled" : "disabled"} id={`asen${item._id}`} onClick={this.handleDelivery} tooltip-position="buttom">
											<i className="nc-icon nc-delivery-fast" />
										</button>
									</td>
									<td className="text-center ">
										<label className="switch">
											<input type="checkbox" onClick={this.handleCheckBegin} disabled={!item.isDeleted ? item.status === 0 ? null : "disabled" : "disabled" } data-toggle ="modal" data-target="#modalConfirmDelete" id={`abeg${item._id}`} checked={item.status === 1 ? true : null} />
											<span className="slider round" />
										</label>
									</td>
									<td className="text-center ">
										<label className="switch">
											<input type="checkbox" onChange={() => { }} onClick={this.handleCheckDeleted} id={`adel${item._id}`} checked={item.isDeleted} data-toggle="modal" data-target="#modalConfirmDelete" disabled={item.status === 1 ? "disabled" : null}/>
											<span className="slider round disable" />
										</label>
									</td>
								</tr>)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

export default TableAuction;