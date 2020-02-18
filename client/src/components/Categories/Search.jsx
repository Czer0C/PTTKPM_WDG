import React, { Component } from 'react';

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			productList: []	
		};
		
	}

	componentDidMount() {
		this.getProduct();
	}

	getProduct() {
		var url = new URL(window.location.href);
		var arr = url.pathname.split("/");
		fetch("/product/search/" + arr[2], {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then((res) => res.json())
          .then((json) => {
			  this.setState({ productList: json.data});
              console.log(json);
          });
	}

	
	render() {
		const arr = this.state.productList;
		return (
			<div>
				{
					arr.map((item, index) => (
						<p>{item.description}</p>
					))
				}
			</div>
		);
	}
}

export default Search;