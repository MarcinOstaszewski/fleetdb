import React, { Component } from 'react';
import ReactTable from 'react-table';
import './App.css';
import './react-table.css';

import firebase from './firebase.js';

class App extends Component {
	constructor(props){
        super(props);
        this.state={
		   id : '',
		   registration_number : '',
		   vin_number : '',
		   brand : '',
		   model : '',
		   created_at : '',
		   modified_at : '',
		   mileage : '',
		   is_active : '',
		   cars : []
        };
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
	}
	
	handleSubmit(e) {
		e.preventDefault();
		const carsRef = firebase.database().ref('cars');
		const car = {
			id : this.state.id,
			registration_number : this.state.registration_number,
			vin_number : this.state.vin_number,
			brand : this.state.brand,
			model : this.state.model,
			created_at : this.state.created_at,
			modified_at : this.state.modified_at,
			mileage : this.state.mileage,
			is_active : this.state.is_active
		}
		carsRef.push(car);
		this.setState({
			id : '',
			registration_number : '',
			vin_number : '',
			brand : '',
			model : '',
			created_at : '',
			modified_at : '',
			mileage : '',
			is_active : ''
		});
	}

	removeCar(carId) {
		const carRef = firebase.database().ref(`/cars/${carId}`);
		carRef.remove();
	}

	componentDidMount() {
		const carsRef = firebase.database().ref('cars');
		carsRef.on('value', (snapshot) => {
			let cars = snapshot.val();
			let tableData = [];
			for (let car in cars) {
				tableData.push({
					index: car,
					id: cars[car].id,
					registration_number : cars[car].registration_number,
                    vin_number : cars[car].vin_number,
                    brand : cars[car].brand,
                    model : cars[car].model,
                    created_at : cars[car].created_at,
                    modified_at : cars[car].modified_at,
					mileage: cars[car].mileage,
                    is_active : cars[car].is_active
				});
			}
			tableData.shift(); // removes first ( unneeded ) element - header
			console.log(tableData);
			this.setState({
				cars: tableData
			});
		});


		
			


	
	// USED ONLY FOR CREATING CARS_DB ON FIREBASE
	// 	fetch(`https://vehiclefakedb.firebaseio.com/masterSheet.json`).then( r =>   r.json() ).then( response => {		
	// 		const carsRef = firebase.database().ref('cars');
	// 		response.forEach( element => {
	// 			const car = {
	// 				id : element[0],
	// 				registration_number : element[1],
	// 				vin_number : element[2],
	// 				brand : element[3],
	// 				model : element[4],
	// 				created_at : element[5],
	// 				modified_at : element[6],
	// 				mileage : element[7],
	// 				is_active : element[8]
	// 			}
	// 			carsRef.push(car);
	// 		});
	// 	});

	}  // END of COMPONENT_DID_MOUNT


	render() {
		return (
			<div className='app'>
				<header>
					<div className='wrapper'>
						<h1>Car Fleet DB Manager</h1>
					</div>
				</header>
				<div className='container'>
					<section className='add-item'>
						<form onSubmit={this.handleSubmit}>
							<span>Add a car: </span>
							<input type="text" name="id" placeholder="Car's ID" onChange={this.handleChange} value={this.state.id} />
							<input type="text" name="registration_number" placeholder="Registration number" onChange={this.handleChange} value={this.state.registration_number} />
							<input type="text" name="vin_number" placeholder="Vin number" onChange={this.handleChange} value={this.state.vin_number} />
							<input type="text" name="brand" placeholder="Brand" onChange={this.handleChange} value={this.state.brand} />
							<input type="text" name="model" placeholder="Model" onChange={this.handleChange} value={this.state.model} />
							<input type="text" name="created_at" placeholder="Created at" onChange={this.handleChange} value={this.state.created_at} />
							<input type="text" name="modified_at" placeholder="Modified at" onChange={this.handleChange} value={this.state.modified_at} />
							<input type="text" name="mileage" placeholder="Mileage" onChange={this.handleChange} value={this.state.mileage} />
							<input type="text" name="is_active" placeholder="Is active?" onChange={this.handleChange} value={this.state.is_active}/>
							<button>Add</button>
						</form>
					</section>
				</div>
				<div className='container'>
					<section className='display-cars'>
						<ReactTable 
						data={this.state.cars}
						columns={[
							{       
								Header: "ID",
								accessor: "id"
							},
							{
								Header: "Registration No",
								accessor: "registration_number"
							},
							{
								Header: "Vin No",
								accessor: "vin_number"
							},
							{
								Header: "Brand",
								accessor: "brand"
							},
							{
								Header: "Model",
								accessor: "model"
							},
							{
								Header: "Created",
								accessor: "created_at"
							},
							{
								Header: "Modified",
								accessor: "modified_at"
							},
							{
								Header: "Mileage",
								accessor: "mileage"
							},
							{
								Header: "Is Active",
								accessor: "is_active"
							}
						]}
						defaultPageSize={20}
						className="-striped -highlight"/>
					</section>
				</div>
				<div className="loggedOut" id="loggedOut">
						<h1>Hello Stranger, please log in.</h1>
						<form>
							<p>Podaj login</p>
							<input className="input email" 
								type="text" 
								name="login"
								onChange={this.handleChange}
								value={this.state.login}/>
							<p>Podaj hasło</p>
							<input className="input password" 
								type="password" 
								name="pass"
								onChange={this.handleChange}
								value={this.state.pass}/>
							<div className="logInButton" 
								onClick={this.logInCheck}>Zaloguj się</div>
						</form>
						{/* <IndexLink to="/loggedIn" activeClassName="active-tab">Loging In</IndexLink> */}
					</div>
			</div>
		);
 	}
}

export default App;
