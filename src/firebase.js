import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyDZIjp1ub4e6xITAgwssRe5HUR2gce6jlw",
    authDomain: "fleetdbmanager.firebaseapp.com",
    databaseURL: "https://fleetdbmanager.firebaseio.com",
    projectId: "fleetdbmanager",
    storageBucket: "fleetdbmanager.appspot.com",
    messagingSenderId: "417950217627"
};
firebase.initializeApp(config);
export default firebase;