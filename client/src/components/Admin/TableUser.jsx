import React, { Component } from 'react';
import {getFromStorage} from '../../utils/storage';
import Modal from 'react-responsive-modal';


class TableUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			open: false,
			modalType: 0, // 0 add | 1 edit
			updateName: "",
			updateFullname: "",
			updateEmail: "",
			updatePhone: "",
			updateAddress: "",
			updateType: "user",
			updatePass: "",
			rePass: ""
		}
		this.handleAdd = this.handleAdd.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onOpenModal = this.onOpenModal.bind(this);
		this.createForm = this.createForm.bind(this);
		this.validate = this.validate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOnChangeAccName = this.handleOnChangeAccName.bind(this);
		this.handleOnChangeFullname = this.handleOnChangeFullname.bind(this);
		this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
		this.handleOnChangePhone = this.handleOnChangePhone.bind(this);
		this.handleOnChangeAddress = this.handleOnChangeAddress.bind(this);
		this.handleOnChangeAccType = this.handleOnChangeAccType.bind(this);
		this.handleOnChangePass = this.handleOnChangePass.bind(this);
		this.handleOnChangeRepass = this.handleOnChangeRepass.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}
	onCloseModal() { this.setState({open: false}); };
	onOpenModal() { this.setState({open: true}); };
	handleOnChangeAccName(e) { this.setState({ updateName: e.target.value }) }
	handleOnChangeFullname(e) { this.setState({ updateFullname: e.target.value }) }
	handleOnChangeEmail(e) { this.setState({ updateEmail: e.target.value }) }
	handleOnChangePhone(e) { this.setState({ updatePhone: e.target.value }) }
	handleOnChangeAddress(e) { this.setState({ updateAddress: e.target.value }) }
	handleOnChangeAccType(e) { this.setState({ updateType: e.target.value  }) }
	handleOnChangePass(e) { this.setState({updatePass: e.target.value}) }
	handleOnChangeRepass(e) { this.setState({rePass: e.target.value}) }
	componentDidMount() {
		this.getUser();
	} 
	handleSearch = () => {
		var input, filter, table, tr, i, td, th, j;
		input = document.getElementById("searchInput");
		filter = input.value.toUpperCase();
		table = document.getElementById("mainDataTable");
		tr = table.getElementsByTagName("tr");
		th = table.getElementsByTagName("th");
		for (i = 1; i < tr.length; i++) {
			for (j = 1; j < th.length; j++) {
				td = tr[i].getElementsByTagName("td")[j].innerHTML;
				if (td) {
					if (td.toUpperCase().indexOf(filter) > -1) {
						tr[i].style.display = "";
						break;
					} else {
						tr[i].style.display = "none";
					}
				}
			}
			
		}
	};
	handleAdd() {
		this.setState({
			open: true,
			modalType: 0,
			updateName: "",
			updateFullname: "",
			updateEmail: "",
			updatePhone: "",
			updateAddress: "",
			updateType: "user",
			updatePass: "",
			rePass: ""
		})
	}
	handleUpdate(e) {
		if (e) {
			var t = this.state.list.filter(i => {
				return i._id === e.target.id.substr(4);
			})[0];
			if (typeof t !== 'undefined') {
				console.log(t);
				this.setState({
					modalType: 1,
					currentID: e.target.id.substr(4),
					updateName: t.username,
					updateFullname: t.fullname,
					updateEmail: t.email,
					updatePhone: t.phone,
					updateAddress: t.address,
					updateType: t.accountType.name,
					updatePass: "",
					rePass: ""
				}, this.onOpenModal());
			}
			else {
				console.log("not cool 2");
			}
			
		}
		else {
			console.log("not cool!")
		}
		
	}
	handleSubmit() {
		const user = {
			updateName: this.state.updateName,
			updateFullname: this.state.updateFullname,
			updateEmail: this.state.updateEmail,
			updatePhone: this.state.updatePhone,
			updateAddress: this.state.updateAddress,
			updateType: this.state.updateType,
			updatePass: this.state.updatePass
		}
		this.onCloseModal();
		this.submitUser(user);
	}
	getUser = () => {
		const obj = getFromStorage("login");

		if (obj && obj.access_token) {
			const { access_token } = obj;
			fetch("/admin/user", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				}
			})
				.then((res) => res.json())
				.then((json) => {
					this.setState({ list: json.list });
					//console.log(json);
				});
		}
	}
	submitUser = (user) => {
		const obj = getFromStorage('login');
		if (obj && obj.access_token) {
			var ID = this.state.currentID; // ID 
			const { access_token } = obj;
			fetch(`/admin/user`, {
				method: `${this.state.modalType === 0 ? "post" : "put"}`,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${access_token}`
				},
				body: JSON.stringify({
					key: ID,
					user: user
				})
			})
				.then((res) => res.json())
				.then((json) => {
					if (json.success) {
						this.getUser();
					} else {
						alert(json.message);
					}
				});
		} 
	}
	validate() {
		if (this.state.modalType === 0) {
			return this.state.updateName === "" ||	this.state.updateFullname === "" ||	this.state.updateEmail === "" || this.state.updatePhone === "" ||this.state.updateAddress === "" ||	this.state.updateType === "" || this.state.rePass === "" || this.state.updatePass === "" || this.state.rePass !== this.state.updatePass;
		}
		return this.state.updateName === "" || this.state.updateFullname === "" || this.state.updateEmail === "" || this.state.updatePhone === "" || this.state.updateAddress === "" || this.state.updateType === "" || this.state.rePass !== this.state.updatePass;
	}
	createForm() {
		return (
			<div>
				<b><center><h2>{this.state.modalType === 1 ? "Thêm người dùng" : "Chỉnh sửa thông tin ngườ dùng"}</h2></center></b>
				<form className="col-sm-12" onSubmit={(e) => { e.preventDefault(); }}>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Tên tài khoản</label>
						<div className="col-sm-8">
							<input type="text" className="form-control" disabled={this.state.modalType === 1 ? "disabled" : null} required value={this.state.updateName} onChange={this.handleOnChangeAccName} />
						</div>
						<div className={this.state.updateName === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateName === "" ? "Đừng bỏ trống" : "✔"}</div>
					</div>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Mật khẩu</label>
						<div className="col-sm-8">
							<input type="password" className="form-control" required value={this.state.updatePass} onChange={this.handleOnChangePass} />
						</div>
						<div className={this.state.updatePass === "" ? this.state.modalType === 0 ? "col-sm-2 warning" : "col-sm-2 ok" : "col-sm-2 ok"}>{this.state.updatePass === "" ? this.state.modalType === 0 ? "Đừng bỏ trống" : "✔" : "✔"}</div>
					</div>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Lặp lại</label>
						<div className="col-sm-8">
							<input type="password" className="form-control" required value={this.state.rePass} onChange={this.handleOnChangeRepass} />
						</div>
						<div className={this.state.rePass === this.state.updatePass ? this.state.rePass === "" ? this.state.modalType === 0 ? "col-sm-2 warning" : "col-sm-2 ok" : "col-sm-2 ok" : "col-sm-2 warning"}>
							{this.state.rePass === this.state.updatePass ? this.state.rePass === "" ? this.state.modalType === 0 ? "Đừng bỏ trống" : "✔" : "✔" : "Không khớp"}</div>
						</div>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Tên đầy đủ</label>
						<div className="col-sm-8">
							<input type="text" className="form-control" required value={this.state.updateFullname} onChange={this.handleOnChangeFullname} />
						</div>
						<div className={this.state.updateFullname === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateFullname === "" ? "Đừng bỏ trống" : "✔"}</div>
					</div>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Email</label>
						<div className="col-sm-8">
							<input type="email" className="form-control" required value={this.state.updateEmail} onChange={this.handleOnChangeEmail} />
						</div>
						<div className={this.state.updateEmail === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateEmail === "" ? "Đừng bỏ trống" : "✔"}</div>
					</div>
					
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Số điện thoại</label>
						<div className="col-sm-8">
							<input type="number" className="form-control" required value={this.state.updatePhone} onChange={this.handleOnChangePhone} />
						</div>
						<div className={this.state.updatePhone === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updatePhone === "" ? "Đừng bỏ trống" : "✔"}</div>
					</div>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Địa chỉ</label>
						<div className="col-sm-8">
							<input type="text" className="form-control" required value={this.state.updateAddress} onChange={this.handleOnChangeAddress} />
						</div>
						<div className={this.state.updateAddress === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateAddress === "" ? "Đừng bỏ trống" : "✔"}</div>
					</div>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Loại người dùng</label>
						<div className="col-sm-8">
							<select value={this.state.updateType} onChange={this.handleOnChangeAccType} className="form-control pt">
								<option value="user">User</option>
								<option value="admin">Admin</option>
							</select>
						</div>
					</div>
					<center><button className="btn btn-primary" type="button" disabled={this.validate() ? "disabled" : null} onClick={this.handleSubmit}>{this.state.modalType === 0 ? "Thêm" : "Cập nhật"}</button><button className="btn btn-danger" type="button" id="adminProductAdd" onClick={this.onCloseModal}>Thoát</button></center>
				</form>
			</div>
		)
	}
	render() {
		const arr = this.state.list;
		const tableStyle = {
			verticalAlign: "middle",
			textAlign: "center"
		}
		return (
			<div className="col-md-12">
				<Modal open={this.state.open} onClose={this.onCloseModal} center>
					{this.createForm()}
				</Modal>
				<div className="card table-with-switches" style={tableStyle}>
					<div className="card-header ">
						<h2 className="card-title"><b>Danh sách người dùng</b></h2>
						<button className="btn btn-info col-sm-1" tooltip="Thêm" id="btnAdd" onClick={this.handleAdd} tooltip-position="buttom">
							<i className="nc-icon nc-simple-add" />
						</button>
						<div className="form-group row">
							<label htmlFor="searchInput" className="col-sm-1 col-form-label">Tìm kiếm:</label>
							<div className="col-sm-8">
								<input type="text" className="form-control tab-search col-sm-3" id="searchInput" onKeyUp={this.handleSearch} placeholder="Nhập bất kì dữ liệu nào.."/>
							</div>
						</div>
					</div>
					<div className="card-body table-full-width">
						<table className="table table-striped table-bordered" id="mainDataTable">
							<thead>
								<tr>
									<th className="text-center">#</th>
									<th className="text-center">Tên tài khoản</th>
									<th className="text-center">Tên đầy đủ</th>
									<th className="text-center">email</th>
									<th className="text-center">Số điện thoại</th>
									<th className="text-center">Địa chỉ</th>
									<th className="text-center">Loại</th>
									<th className="text-center">Cập nhật</th>
								</tr>
							</thead>
							<tbody id="mainDataTableBody">
								{
									arr.map((item, index) => 
										<tr key={item._id}>
											<td className="text-center">{index + 1}</td>
											<td className="text-center">{item.username}</td>
											<td className="text-center">{item.fullname}</td>
											<td className="text-center">{item.email}</td>
											<td className="text-center">{item.phone}</td>
											<td className="text-center">{item.address}</td>
											<td className="text-center">{item.accountType.name}</td>
											<td className="td-actions text-center ">
												<button className="btn btn-success" tooltip="Sửa thông tin" disabled={item.isDeleted} id={`ufix${item._id}`} onClick={this.handleUpdate} tooltip-position="buttom">
													<i className="nc-icon nc-settings-tool-66" />
												</button>
											</td>
										</tr>
									)
								}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

export default TableUser;