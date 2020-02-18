import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { getFromStorage } from '../../utils/storage';

class TableParameters extends Component {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			open: false,
			modalType: 0, // 0 add | 1 edit
			updateName: "",
			updateValue: "",
			currentID: ""
		}
		this.handleAdd = this.handleAdd.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleOnChangeName = this.handleOnChangeName.bind(this);
		this.handleOnChangeValue = this.handleOnChangeValue.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	onCloseModal() { this.setState({ open: false}) }
	handleOnChangeName(e) { this.setState({ updateName: e.target.value }) }
	handleOnChangeValue(e) { this.setState({ updateValue: e.target.value }) }
	componentDidMount() {
		this.getParameters();
	}
	getParameters() {
		const obj = getFromStorage("login");

		if (obj && obj.access_token) {
			const { access_token } = obj;
			fetch("/admin/parameters", {
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
	handleAdd() {
		this.setState({
			modalType: 0,
			open: true,
			updateName: "",
			updateValue: ""
		})
	}
	handleUpdate(e) {
		if (e) {
			var t = this.state.list.filter(i => {
				return i._id === e.target.id.substr(5)
			})[0]
			if (typeof t !== undefined) {
				console.log(t)
				this.setState({
					modalType: 1,
					updateName: t.pName,
					updateValue: t.pValue,
					currentID: t._id,
					open: true
				})
			}
			else {
				console.log('not good 2')
			}
		}	
		else {
			console.log('not good');
		}
	}
	handleSubmit() {
		if (this.state.updateName !== "" && this.state.updateValue !== "") {
			this.submitParameter();
			this.onCloseModal();
		}
		
	}
	submitParameter() {
		const p = {
			pName: this.state.updateName,
			pValue: this.state.updateValue
		}
		const obj = getFromStorage("login");
		if (obj && obj.access_token) {
		var ID = this.state.currentID; // ID
		const { access_token } = obj;
		fetch(`/admin/parameters`, {
			method: `${this.state.modalType === 0 ? "post" : "put"}`,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${access_token}`
			},
			body: JSON.stringify({
				key: ID,
				p: p
			})
		})
			.then((res) => res.json())
			.then((json) => {
				if (json.success) {
					this.getParameters();
				} else {
					alert('Thêm thất bại');
				}
			});
		}
	}
	createForm = () => {
		return (
			<div>
				<b><center><h2>{this.state.modalType === 0 ? "Thêm tham số" : "Cập nhật tham số"}</h2></center></b>
				<form className="col-sm-12" onSubmit={(e) => { e.preventDefault(); }}>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Tên tham số</label>
						<div className="col-sm-8">
							<input type="text" className="form-control" required value={this.state.updateName} onChange={this.handleOnChangeName} />
						</div>
					</div>
					<div className="form-group row col-sm-12">
						<label htmlFor="productName" className="col-sm-2 col-form-label">Miêu tả</label>
						<div className="col-sm-8">
							<input type="number" className="form-control" required value={this.state.updateValue} onChange={this.handleOnChangeValue} />
						</div>
					</div>
					<center><button className="btn btn-primary" onClick={this.handleSubmit}>{this.state.modalType === 0 ? "Thêm" : "Cập nhật"}</button><button className="btn btn-danger" id="adminProductAdd" onClick={this.onCloseModal}>Thoát</button></center>
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
						<h2 className="card-title"><b>Bảng tham số</b></h2>
						<button className="btn btn-info col-sm-1" tooltip="Thêm" id="btnAdd" onClick={this.handleAdd} tooltip-position="buttom">
							<i className="nc-icon nc-simple-add" />
						</button>
					</div>
					<div className="card-body table-full-width">
						<table className="table table-striped table-bordered" id="mainDataTable">
							<thead>
								<tr>
									<th className="text-center">#</th>
									<th className="text-center">Loại</th>
									<th className="text-center">Giá trị</th>
									<th className="text-center">Sửa</th>
								</tr>
							</thead>
							<tbody id="mainDataTableBody">
								{
									arr.map((item, index) =>
										<tr key={item._id}>
											<td className="text-center">{index + 1}</td>
											<td className="text-center">{item.pName}</td>
											<td className="text-center">{item.pValue}</td>
											<td className="td-actions text-center ">
												<button className="btn btn-success" tooltip="Sửa thông tin" id={`pafix${item._id}`} onClick={this.handleUpdate} tooltip-position="buttom">
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

export default TableParameters;