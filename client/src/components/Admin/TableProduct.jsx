import React, { Component } from 'react';
import "./assets/css/Table.css";
import Modal from 'react-responsive-modal'
import {getFromStorage} from '../../utils/storage';

class TableProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      open: false,
      modalType: 1,
      currentID: null,
      currentRow: null,
      updateName: null,
      updateType: null,
      updateDesc: null,
      updateLink: null
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleCheckDelivery = this.handleCheckDelivery.bind(this);
    this.handleCheckDisable = this.handleCheckDisable.bind(this);
    this.handleOnChangeProductName = this.handleOnChangeProductName.bind(this);
    this.handleOnChangeProductType = this.handleOnChangeProductType.bind(this);
    this.handleOnChangeDescription = this.handleOnChangeDescription.bind(this);
    this.handleOnChangeProductImage = this.handleOnChangeProductImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.handleModalYes = this.handleModalYes.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() { this.getProduct(); }
  onOpenModal = () => { this.setState({ open: true }); };
  onCloseModal = () => { this.setState({ open: false }); };
  getProduct() {
    const obj = getFromStorage("login");

    if (obj && obj.access_token) {
      const { access_token } = obj;
      fetch("/admin/getProduct", {
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

  handleSearch = () => {
    var input, filter, table, tr, i, td;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("mainDataTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1].innerHTML;
      if (td) {
        if (td.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  handleCheckDelivery(event) {
    if (!window.confirm("R U SURE"))
      event.target.checked = !event.target.checked;
    this.setState({ checked: event.target.checked });
  }

  handleCheckDisable(event) {
    event.preventDefault();
    this.setState({
      currentID: event.target.id.substr(4)
    });
  }

  handleModalYes = () => {
    this.deleteProduct();
  };

  deleteProduct = () => {
    const obj = getFromStorage('login');

    if (obj && obj.access_token) {
      var ID = this.state.currentID; // ID checkbox
      var checkDisable = document.getElementById(`pdis${ID}`);
      const { access_token } = obj;
      fetch("/admin/deleteProduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify({
          key: this.state.currentID,
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

  handleAdd = () => {
    this.setState({
      updateName: "",
      updateType: "Figures",
      updateDesc: "",
      updateLink: "",
      modalType: 1
     }, () => {
      this.onOpenModal();
    });
  };

  handleUpdate(e) {
    if (e) {
      var t = this.state.list.filter(i => {
        return i._id === e.target.id.substr(4);
      });
      if (typeof t[0] !== 'undefined') {
        this.setState({
          updateName: t[0].productName,
          updateType: t[0].productType,
          updateDesc: t[0].description,
          updateLink: t[0].productImage,
          modalType: 2,
          currentID: e.target.id.substr(4)
        }, () => {
          this.onOpenModal();
        });
      }
      else {
        console.log('not cool 2');
      }
    }
    else {
      console.log('not cool');
    }
  };
  handleSubmit = () => {
    this.submitProduct();
    this.onCloseModal();
  }
  submitProduct = () => {
    const obj = getFromStorage('login');
    if (obj && obj.access_token) {
      var ID = this.state.currentID; // ID checkbox
      const { access_token } = obj;
      fetch(`/admin/${this.state.modalType === 1 ? "add" : "update"}Product`, {
        method: `${this.state.modalType === 1 ? "post" : "put"}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`
        },
        body: JSON.stringify({
          key: this.state.currentID,
          val: [
            this.state.updateName,
            this.state.updateType,
            this.state.updateDesc,
            this.state.updateLink
          ]
        })
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            if (this.state.modalType === 1) {
              this.getProduct();
            } 
            else {
              var temp = JSON.parse(JSON.stringify(this.state.list));
              temp.forEach((i) => {
                if (i._id === ID) {
                    i.productName = this.state.updateName;
                    i.productType = this.state.updateType;
                    i.description = this.state.updateDesc;
                    i.productImage = this.state.updateLink;
                }
              });
              this.setState({ list: temp });
            }
          } else {
            alert("Xảy ra lỗi");
          }
        });
    } 
  }
  validate = () => {
    return this.state.updateName === "" || this.state.updateType === "" || this.state.updateDesc === "" || this.state.updateLink === "";
  }
  handleOnChangeProductName = (e) => {
    this.setState({updateName : e.target.value})
  }
  handleOnChangeProductType = (e) => {
    this.setState({updateType : e.target.value})
  }
  handleOnChangeDescription = (e) => {
    this.setState({updateDesc : e.target.value})
  }
  handleOnChangeProductImage = (e) => {
    this.setState({updateLink : e.target.value})
  }
  render() {
    const tableStyle = {
      verticalAlign: "middle",
      textAlign: "center"
    };
    var arr = this.state.list;

    const createForm = () => {
        return (
          <div>
            <b><center><h2>{this.state.modalType === 1 ? "Thêm sản phẩm" : "Chỉnh sửa thông tin sản phẩm"}</h2></center></b>
            <form className="col-sm-12" onSubmit={(e) => {e.preventDefault();}}>
              <div className="form-group row col-sm-12">
                <label htmlFor="productName" className="col-sm-2 col-form-label">Tên sản phẩm</label>
                <div className="col-sm-8">
                  <input type="text" className="form-control" required value={this.state.updateName} onChange={this.handleOnChangeProductName}/>
                </div>
                <div className={this.state.updateName === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateName === "" ? "Đừng bỏ trống" : "✔"}</div>
              </div>
              <div className="form-group row col-sm-12">
                <label htmlFor="productName" className="col-sm-2 col-form-label">Loại sản phẩm</label>
                <div className="col-sm-8">
                  <select value={this.state.updateType} onChange={this.handleOnChangeProductType} className="form-control pt">
                    <option value="Figures">Figures</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Computers">Computers</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Luggage & Travel Gear">Luggage & Travel Gear</option>
                    <option value="Sports & Outdoors">Sports & Outdoors</option>
                  </select>
                </div>
              </div>
              <div className="form-group row col-sm-12">
                <label htmlFor="productName" className="col-sm-2 col-form-label">Miêu tả</label>
                <div className="col-sm-8">
                  <input type="text" className="form-control" required value={this.state.updateDesc} onChange={this.handleOnChangeDescription}/>
                </div>
                <div className={this.state.updateDesc === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateDesc === "" ? "Đừng bỏ trống" : "✔"}</div>
              </div>
              <div className="form-group row col-sm-12">
                <label htmlFor="productName" className="col-sm-2 col-form-label">Link ảnh</label>
                <div className="col-sm-8">
                  <input type="text" className="form-control" required value={this.state.updateLink} onChange={this.handleOnChangeProductImage}/>
                </div>
                <div className={this.state.updateLink === "" ? "col-sm-2 warning" : "col-sm-2 ok"}>{this.state.updateLink === "" ? "Đừng bỏ trống" : "✔"}</div>
              </div>
              <center><button className="btn btn-primary" disabled={this.validate() ? "disabled" : null} onClick={this.handleSubmit}>{this.state.modalType === 1 ? "Thêm" : "Cập nhật"}</button><button className="btn btn-danger" id="adminProductAdd" onClick={this.onCloseModal}>Thoát</button></center>
            </form>
          </div>
        );
    };

    return <div className="col-md-12">
        <Modal open={this.state.open} onClose={this.onCloseModal} center>
          {createForm()}
        </Modal>

        {/* Modal confirm */}
        <div className="modal fade" id="modalConfirmDelete" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-sm modal-notify modal-danger" role="document">
            <div className="modal-content text-center">
              <div className="modal-header d-flex justify-content-center">
                <p className="heading">Xác nhận thay đổi thông tin</p>
              </div>
              <div className="modal-body">
                <i className="fa fa-times fa-4x animated rotateIn" id="modal-x-icon" />
              </div>
              <div className="modal-footer flex-center">
                <button className="btn btn-outline-danger" onClick={this.handleModalYes} data-dismiss="modal">
                  Xác nhận
                </button>
                <button className="btn btn-danger waves-effect" data-dismiss="modal">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Modal confirm */}

        <div className="card table-with-switches" style={tableStyle}>
          <div className="card-header ">
            <h2 className="card-title">
              <b>Danh sách sản phẩm</b>
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
                  <th className="text-center">#</th>
                  <th>Tên sản phẩm</th>
                  <th>Loại</th>
                  <th className="text-center">Miêu tả</th>
                  <th className="text-center">Link ảnh</th>
                  <th className="text-center">Thao tác</th>
                  <th className="text-center">Vô hiệu hóa</th>
                </tr>
              </thead>
              <tbody id="mainDataTableBody">
                {arr.map((item, index) => <tr key={item._id}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center longtext">
                    {item.productName}
                    </td>
                    <td className="text-center">{item.productType}</td>
                    <td className="text-center longtext">
                      {item.description}
                    </td>
                    <td className="text-center longtext">
                      
                      <a href={`http://localhost:3000/${item.productImage}`} target="_blank">
                        <img src={`http://localhost:3000/${item.productImage}`} alt="" width="50px" height="50px" />
                      </a>
                    </td>
                    <td className="td-actions text-center ">
                      <button className="btn btn-success" tooltip="Xem/Sửa" disabled={item.isDeleted} id={`pfix${item._id}`} onClick={this.handleUpdate} tooltip-position="buttom">
                        <i className="nc-icon nc-settings-tool-66" />
                      </button>
                    </td>
                    <td className="text-center ">
                      <label className="switch">
                      <input type="checkbox" onClick={this.handleCheckDisable} id={`pdis${item._id}`} onChange={()=>{}} checked={item.isDeleted}/>
                        <span className="slider round disable" data-toggle="modal" data-target="#modalConfirmDelete" />
                      </label>
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>;
  }
}

export default TableProduct;