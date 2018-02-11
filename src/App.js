import React, { Component } from 'react';
import ReactTable from 'react-table';
import './App.css';
import './react-table.css';

import firebase, { auth, provider } from './firebase.js';

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
		   cars : [],
		   user : null
        };
		this.handleChange = this.handleChange.bind(this);
		this.handleAddCar = this.handleAddCar.bind(this);
		this.login = this.login.bind(this); 
		this.logout = this.logout.bind(this); 
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        });
	}
	
	logout() {
		auth.signOut()
			.then(() => {
			this.setState({
				user: null
			});
		});
	}
	login() {
	auth.signInWithPopup(provider) 
		.then((result) => {
			const user = result.user;
			this.setState({
				user
			});
		});
	}

	handleAddCar(e) {
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

	removeCar(carIndex) {
		const carRef = firebase.database().ref(`/cars/${carIndex}`);
		carRef.remove();
	}

	componentDidMount() {

		auth.onAuthStateChanged((user) => {
			if (user) {
			this.setState({ user });
			} 
		});

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
					is_active : cars[car].is_active,
					remove : <button onClick={() => this.removeCar(car)}>Remove</button>
				});
			}
			tableData.shift(); // removes first ( unneeded ) element - the header
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
		// let userName = (
		// 	<div>
		// 		<div className='rightAlign'>Witaj, {this.state.user.displayName || this.state.user.email} </div>
		// 		<div onClick={this.logout}>Log Out</div>                
		// 	</div>);

		return (
			<div className='app'>
				<header>
					<div className='wrapper'>
							<div className='title'>
								<h1>Car Fleet DB Manager</h1>
							</div>							
							<div className="buttonHeader">
								{this.state.user ? 
									<span>
										<div className='rightAlign'>Witaj, {this.state.user.displayName || this.state.user.email} </div>
										<div onClick={this.logout}>Log Out</div>                
									</span>
									: <div onClick={this.login}>Log In</div>}
							</div>
					</div>
				</header>
				
				{this.state.user ?
					<div>
						<div className='container'>
							<section className='add-item'>
								<form onSubmit={this.handleAddCar}>
									{/* <div><span>Add a car: </span></div> */}
									<div><input type="text" name="id" placeholder="Car's ID" onChange={this.handleChange} value={this.state.id} /></div>
									<div><input type="text" name="registration_number" placeholder="Registration number" onChange={this.handleChange} value={this.state.registration_number.toUpperCase()} /></div>
									<div><input type="text" name="vin_number" placeholder="Vin number" onChange={this.handleChange} value={this.state.vin_number.toUpperCase()} /></div>
									<div><input type="text" name="brand" placeholder="Brand" onChange={this.handleChange} value={this.state.brand.toUpperCase()} /></div>
									<div><input type="text" name="model" placeholder="Model" onChange={this.handleChange} value={this.state.model.toUpperCase()} /></div>
									<div><input type="text" name="created_at" placeholder="Created at" onChange={this.handleChange} value={this.state.created_at} /></div>
									<div><input type="text" name="modified_at" placeholder="Modified at" onChange={this.handleChange} value={this.state.modified_at} /></div>
									<div><input type="text" name="mileage" placeholder="Mileage" onChange={this.handleChange} value={this.state.mileage} /></div>
									<div><input type="text" name="is_active" placeholder="Is active?" onChange={this.handleChange} value={this.state.is_active}/></div>
									<div><button>Add new car</button></div>
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
									},
									{
										Header: "Remove",
										accessor: "remove"
									}
								]}
								defaultPageSize={20}
								className="-striped -highlight"/>
							</section>
						</div>
					</div>
					:
					<div className='container flex'>
						<h2>Welcome on our Single Page Application. </h2>
						<h2>Please log in to continue.</h2>
					</div>
				}
			</div>
		);
 	}
}

export default App;

