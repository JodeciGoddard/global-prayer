// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";


// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
    apiKey: "AIzaSyD47q6wYls6HFnFDTEEztn-ijF2ctVOXAE",
    authDomain: "global-prayer-3c404.firebaseapp.com",
    projectId: "global-prayer-3c404",
    storageBucket: "global-prayer-3c404.appspot.com",
    messagingSenderId: "510425684034",
    appId: "1:510425684034:web:3d61e88a1e89ed9af435db",
    measurementId: "G-4MEGHWNV52"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);



export function createUser(email, password, success, fail) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(cred => {
        // user created successfully
        success(cred);

    }).catch(error => {
        fail(error);
    });
}

export function createProfile(userId, data, success, fail) {
    const db = firebase.firestore();

    db.collection("users").doc(userId).set({
        ...data,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(docRef => {
        // user profile created
        success(docRef);
        console.log("profile: ", data);
    }).catch(error => {
        fail(error);
    });
}

export function getProfile(uid, pass, fail) {
    var ref = firebase.firestore().collection('users').doc(uid);

    ref.get().then(doc => {
        if (doc.exists) {
            pass(doc.data());
        } else {
            fail("No document found");
        }
    }).catch(error => {
        fail("Error getting document: " + error.code);
    });
}

export function updateProfile(id, data) {
    console.log("user id: ", id);
    var ref = firebase.firestore().collection('users').doc(id);

    return ref.update(data);
}

export function IsLoggedIn(loginFnc, logoutFnc) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loginFnc(user);
        } else {
            logoutFnc();
        }
    });
}

export function logUserIn(email, password, fail) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in 
            // ...
        })
        .catch((error) => {
            fail(error);
        });
}

export function logUserOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.log("failed to sign user out: ", error);
    });
}


export function getDB() {
    return firebase.firestore();
}

export function getStorageRef() {
    return firebase.storage().ref();
}
