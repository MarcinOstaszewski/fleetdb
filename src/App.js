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
		   originalDB : {},
		   user : null,
		   invisible : 'invisible',
		   invalidRegistrationNumber : '',
		   invalidVIN : '',
		   invalidMileage : '',
		   popUpTopPosition : 150,
		   popUpRightPosition : 0,
		   modifyId : '',
		   modifyRegistration_number : '',
		   modifyVin_number : '',
		   modifyBrand : '',
		   modifyModel : '',
		   modifyCreated_at : '',
		   modifyModified_at : '',
		   modifyMileage : '',
		   modifyIs_active : '',
		   modifyCarTopPosition : 0,
		   modifyCarInvisible : 'invisible',
		   invalidModifyRegistrationNumber: '',
		   invalidModifyVin : '',
		   invalidModifyMileage : ''
        };
		// this.handleAddCar = this.handleAddCar.bind(this);
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
			console.log(user);
			this.setState({
				user
			});
		});
	}

	verifyRegistrationNumber(reg) {
			this.setState({
				invalidRegistrationNumber : (reg === '' || reg.length > 10) ? 'Registration Number must be 1 to 10 letters long.' : ''
			});
			return (reg === '' || reg.length > 10) ? 1 : 0;
	}
	verifyVIN(vin) {
			this.setState({
				invalidVIN : (vin === '' || vin.length > 17) ? 'VIN Number must be 1 to 17 letters long.' : ''
			});
			return (vin === '' || vin.length > 17) ? 1 : 0;
	}
	verifyMileage(mil) {
			this.setState({
				invalidMileage : (mil < 0) ? 'Mileage can not be less than 0.' : ''
			});
			return (mil < 0) ? 1 : 0;
	}

	handleAddCar = (e) => {
		e.preventDefault();
		// create reference for the DB
		const carsRef = firebase.database().ref('cars');
		// verify the data of the car to add before adding to FireBase
		const verification = 
			this.verifyRegistrationNumber(this.state.registration_number) +
			this.verifyVIN(this.state.vin_number) +
			this.verifyMileage(this.state.mileage);
		const now = new Date();
		if (verification === 0) {
			const car = {
				id : this.state.id,
				registration_number : this.state.registration_number.replace(/\s+/g, '').toUpperCase(),
				vin_number : this.state.vin_number.replace(/\s+/g, '').toUpperCase(),
				brand : this.state.brand.toUpperCase(),
				model : this.state.model.toUpperCase(),
				created_at : now.toISOString(),
				modified_at : now.toISOString(),
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
	}

	convertDateToUTC(date) { 
		return new Date(date).toISOString();
		// new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
	}

	removeCar = (carIndex) => {
		const carRef = firebase.database().ref(`/cars/${carIndex}`);
		carRef.remove();
		
		this.setState({
			invisible : 'invisible',
			carIndex : ''
		})
	}

	cancelRemoveCar = (e) => {
		e.preventDefault();
		this.setState({
			invisible : 'invisible',
			invalidRegistrationNumber : '',
			invalidVIN : '',
			invalidMileage : ''
		});
	}

	cancelModifyCar = (e) => {
		e.preventDefault();
		this.setState({
			modifyCarInvisible : 'invisible',
			invalidModifyRegistrationNumber : '',
			invalidModifyVIN : '',
			invalidModifyMileage : ''
		});
	}


	verifyModifiedRegistrationNumber(reg) {
			this.setState({
				invalidModifyRegistrationNumber : (reg === '' || reg.length > 10) ? 'Registration Number must be 1 to 10 letters long.' : ''
			});
			return (reg === '' || reg.length > 10) ? 1 : 0;
	}
	verifyModifiedVIN(vin) {
			this.setState({
				invalidModifyVIN : (vin === '' || vin.length > 17) ? 'VIN Number must be 1 to 17 letters long.' : ''
			});
			return (vin === '' || vin.length > 17) ? 1 : 0;
	}
	verifyModifiedMileage(mil) {
			this.setState({
				invalidModifyMileage : (mil < 0) ? 'Mileage can not be less than 0.' : ''
			});
			return (mil < 0) ? 1 : 0;
	}

	handleModifyCar = (e) => {
		e.preventDefault();

		const verification = 
			this.verifyModifiedRegistrationNumber(this.state.modifyRegistration_number) +
			this.verifyModifiedVIN(this.state.modifyVin_number) +
			this.verifyModifiedMileage(this.state.modifyMileage);
			
		let dateCreated = this.state.originalDB[this.state.modifyCarIndex].created_at; //store the original date for created_at
		let now = new Date().toISOString();
		const carRef = firebase.database().ref(`/cars/${this.state.modifyCarIndex}`);
		const carsRef = firebase.database().ref('cars'); // reference to the whole cars_DB

		if (verification === 0) {
			const car = {
				id : this.state.modifyId,
				registration_number : this.state.modifyRegistration_number.replace(/\s+/g, '').toUpperCase(),
				vin_number : this.state.modifyVin_number.replace(/\s+/g, '').toUpperCase(),
				brand : this.state.modifyBrand.toUpperCase(),
				model : this.state.modifyModel.toUpperCase(),
				created_at : dateCreated,
				modified_at : now,
				mileage : this.state.modifyMileage,
				is_active : this.state.modifyIs_active
			};
			
			carRef.remove();  // remove old car data
			carsRef.push(car); // push new car data

			this.setState({
				modifyCarInvisible : 'invisible',
				carIndex : ''
			});

		}
	}

	modifyCarButtonPressed = (carIndex, e) => {
		// shortcut var used to set the values of input fields
		var cars = this.state.originalDB;

		this.setState ({
			modifyCarTopPosition : e.pageY-20,
			modifyCarLeftPosition : e.pageX-20,
			modifyCarInvisible: 'white-bg',
			modifyCarIndex : carIndex,
			modifyId : cars[carIndex].id,
			modifyRegistration_number : cars[carIndex].registration_number,
			modifyVin_number : cars[carIndex].vin_number,
			modifyBrand : cars[carIndex].brand,
			modifyModel : cars[carIndex].model,
			modifyModified_at : Date.now(),
			modifyMileage : cars[carIndex].mileage,
			modifyIs_active : cars[carIndex].is_active
		});
	}

	showPopUp = (car, e) => {
		this.setState ({
			invisible: 'white-bg',
			carIndex : car,
			popUpTopPosition : e.pageY,
			popUpRightPosition : e.pageX-350
		});
	}



	// ********************************************************************************************************
	// *****  COMPONENT DID MOUNT *****************************************************************************
	// ********************************************************************************************************


	componentDidMount() {

		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({ user });
			} 
		});

		const carsRef = firebase.database().ref('cars');
		// create reference to FireBase and build data for table and stores it in state for handleModifyCar method
		carsRef.on('value', (snapshot) => {
			let cars = snapshot.val();
			let tableData = [];
			for (let car in cars) {
				tableData.push({
					modify : <button onClick={(e) => this.modifyCarButtonPressed(car, e)}>Modify</button>,
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
					remove : <button onClick={(e) => this.showPopUp(car, e)}>Remove</button>
				});				
			}
			this.setState({
				originalDB : cars,
				cars: tableData
			});
		});

	
			// USED ONLY FOR CREATING CARS_DB ON FIREBASE
		// fetch(`https://vehiclefakedb.firebaseio.com/masterSheet.json`).then( r =>   r.json() ).then( response => {		
		// 	const carsRef = firebase.database().ref('cars');
		// 	response.forEach( element => {
		// 		const car = {
		// 			id : element[0],
		// 			registration_number : element[1],
		// 			vin_number : element[2],
		// 			brand : element[3],
		// 			model : element[4],
		// 			created_at : element[5],
		// 			modified_at : element[6],
		// 			mileage : element[7],
		// 			is_active : element[8]
		// 		}
		// 		carsRef.push(car);
		// 		console.log(car);
		// 	});
		// });
	}  // END of COMPONENT_DID_MOUNT


	render() {

		var popUp = 
			<div className={this.state.invisible}>
				<div className="pop-up" style={{top: this.state.popUpTopPosition, left: this.state.popUpRightPosition}}>
					<p className="question">
						ARE YOU SURE YOU WANT TO<br/>
						<span>DELETE</span> THIS CAR?
					</p>
					<div className="buttons">
						<div className="button cancel" onClick={this.cancelRemoveCar}>CANCEL</div>
						<div className="button delete" onClick={() => this.removeCar(this.state.carIndex)}>DELETE</div>
					</div>
				</div>
			</div>;
		

		return (
			<div className='app'>
				<header>
					<div className='wrapper'>
							<div className='title'>
								<h1>Car Fleet DB Manager</h1>
							</div>							
							<div>
								{this.state.user ? 
									<span  className='logInInfo'>
										<div className='rightAlign'>Hello, {this.state.user.displayName || this.state.user.email} </div>
										<div className="buttonHeader" onClick={this.logout}>Log Out</div>                
									</span>
									: <div className="buttonHeader" onClick={this.login}>Log In</div>}
							</div>
					</div>
				</header>


				{/* *****  VISIBLE ONLY when user logged in ***** */}
				{this.state.user ?
					<div>
						<div className='container'>

						{/* ***** SECTION ADD CAR ***** */}
						
							<section className='add-car'>
								<form onSubmit={this.handleAddCar}>
									<div><input type="text" name="id" placeholder="Car's ID" onChange={this.handleChange} value={this.state.id} /></div>
									<div><input type="text" name="registration_number" placeholder="Registration number" onChange={this.handleChange} value={this.state.registration_number.toUpperCase()} /></div>
									<div><input type="text" name="vin_number" placeholder="Vin number" onChange={this.handleChange} value={this.state.vin_number.toUpperCase()} /></div>
									<div><input type="text" name="brand" placeholder="Brand" onChange={this.handleChange} value={this.state.brand.toUpperCase()} /></div>
									<div><input type="text" name="model" placeholder="Model" onChange={this.handleChange} value={this.state.model.toUpperCase()} /></div>
									<div><input type="number" name="mileage" placeholder="Mileage" onChange={this.handleChange} value={this.state.mileage} /></div>
									<div>
										<select
											name="is_active"
											className="is-active"
											onChange={this.handleChange}
											value={this.state.is_active}>
											<option value="1">Active</option>
											<option value="0">Inactive</option>
										</select>
									</div>
									<div><button>Add new car</button></div>
								</form>

								<div className="invalid-new-car-data-alert">
									<div>{this.state.invalidRegistrationNumber}</div>
									<div>{this.state.invalidVIN}</div>
									<div>{this.state.invalidMileage}</div>
								</div>
							</section>
						</div>
						
						<div className='container'>
							<section className='display-cars'>
								<ReactTable 
								data={this.state.cars}
								columns={[
									{
										Header: "Modify",
										accessor: "modify"
									},
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
								defaultPageSize={10}
								className="-striped -highlight"/>
							</section>
						</div>

						{/* ***** SECTION MODIFY CAR ***** */}

						<div className={this.state.modifyCarInvisible}>
							<div className="container">
								<section className="modify-car" style={{top: this.state.modifyCarTopPosition, left: this.state.modifyCarLeftPosition}}>
									<form onSubmit={this.handleModifyCar}>
										<div><button className="cancel-modify-car" onClick={this.cancelModifyCar}>Cancel</button></div>
										<div><input type="text" name="modifyId" placeholder="Car's ID" onChange={this.handleChange} value={this.state.modifyId} /></div>
										<div><input type="text" name="modifyRegistration_number" placeholder="Registration number" onChange={this.handleChange} value={this.state.modifyRegistration_number.toUpperCase()} /></div>
										<div><input type="text" name="modifyVin_number" placeholder="Vin number" onChange={this.handleChange} value={this.state.modifyVin_number.toUpperCase()} /></div>
										<div><input type="text" name="modifyBrand" placeholder="Brand" onChange={this.handleChange} value={this.state.modifyBrand.toUpperCase()} /></div>
										<div><input type="text" name="modifyModel" placeholder="Model" onChange={this.handleChange} value={this.state.modifyModel.toUpperCase()} /></div>
										<div><input type="number" name="modifyMileage" placeholder="Mileage" onChange={this.handleChange} value={this.state.modifyMileage} /></div>
										<div>
											<select
												name="modifyIs_active"
												className="is-active"
												onChange={this.handleChange}
												value={this.state.modifyIs_active}>
												<option value="1">Active</option>
												<option value="0">Inactive</option>
											</select>
										</div>
										<div><button>Modify data</button></div>
									</form>
									<div className="invalid-new-car-data-alert">
										<div>{this.state.invalidModifyRegistrationNumber}</div>
										<div>{this.state.invalidModifyVIN}</div>
										<div>{this.state.invalidModifyMileage}</div>
									</div>
								</section>
							</div>
						</div>


						<footer>
							<div className='wrapper'>
									<div className='foot'>
										<p> Copyright Car Fleet DB Manager Co.</p>
									</div>							
							</div>
						</footer>

						{popUp}

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
