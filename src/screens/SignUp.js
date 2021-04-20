import React, { useState, useEffect } from 'react';
import '../css/SignUp.css';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useHistory } from 'react-router-dom';
import { createUser, createProfile, getStorageRef, updateProfile } from '../api/Firebase';
import { userToken } from '../State';
import { useRecoilState } from 'recoil';
import { HiLocationMarker } from 'react-icons/hi';
import { getUserLocation } from '../api/Google';
import Uploader from '../components/Uploader';
import Loading from '../components/Loading';


const SignUp = () => {
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const [image, setImage] = useState();
    const [progress, setProgress] = useState(0);
    const [updateImage, setUpdateImage] = useState(false);

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useRecoilState(userToken);
    let history = useHistory();

    const signup = () => {
        //validation
        if (validation() === 1) {
            setError("Please fill all fields");
            return;
        }
        if (validation() === 2) {
            setError("Both passwords must match");
            return;
        }

        setLoading(true);

        //create the user
        createUser(username, password, (myUser) => {

            //save the user token globally
            setUser(myUser.user);

            //create Profile
            let data = {
                name: name,
                region: region,
                city: city,
                country: country,
                email: username,
                profileImage: profileImage
            };


            createProfile(myUser.user.uid, data, docRef => {

                //profile created
                if (image) {
                    updateProfileImage(myUser.user.uid);
                } else {
                    setLoading(false);
                    history.push("/");
                }
            }, error => {
                setError("Error creating profie");
                console.log("Profile Error: ", error);
                setLoading(false);
            });
        }, error => {
            //Handle any errors
            setError("Error: " + error.code + " :: " + error.message);
            setLoading(false);

        });
    }

    const updateName = e => {
        setName(e.target.value);
        setError('');
    }

    const updateUsername = e => {
        setUsername(e.target.value);
        setError('');
    }

    const updatePassword = e => {
        setPassword(e.target.value);
        setError('');
    }

    const updateConfirm = e => {
        setConfirm(e.target.value);
        setError('');
    }

    const updateRegion = () => {
        getUserLocation(data => {
            setCity(data.city);
            setCountry(data.country_name);
            setRegion(`${data.city}, ${data.country_name}`);
        });
    }

    const updateProfileImage = (id) => {
        if (!image) return;
        let ref = getStorageRef();
        let uploadTask = ref.child('profile/' + image.name).put(image);

        uploadTask.on('state_changed',
            (snapshot) => {
                var p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(p);
            },
            (error) => {
                setError(error.code);
                console.log("upload error: ", error);
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(uri => {
                    setProfileImage(uri);
                    updateProfile(id, { profileImage: uri }).then(() => {
                        setLoading(false);
                        history.push("/");
                        console.log("update successful");
                    }).catch(error => {
                        setError("Error: " + error.message);
                        console.log(error);
                    });

                    // handleUploadCompleted(uri);
                    console.log("image link: ", uri);
                });
            }
        );
    }


    const validation = () => {
        if (region.trim() === '') return 1;
        if (name.trim() === '') return 1;
        if (username.trim() === '') return 1;
        if (password.trim() === '') return 1;
        if (confirm.trim() === '') return 1;
        if (confirm !== password) return 2;

        return 0;
    }

    return (
        <div className="signup-container">

            <Loading Loading={loading} />

            <div className="signup-card">
                <div className="signup-card-header">
                    <h1>Create An Account</h1>
                </div>

                <form className="signup-card-main">

                    <CustomInput
                        label="Display Name *"
                        id="name"
                        type="text"
                        value={name}
                        onChange={updateName}
                        containerClass="signup-input"
                    />


                    <CustomInput
                        label="Email *"
                        id="username"
                        type="text"
                        value={username}
                        onChange={updateUsername}
                        containerClass="signup-input"
                    />

                    <CustomInput
                        label="Password *"
                        id="password"
                        type="password"
                        value={password}
                        onChange={updatePassword}
                        containerClass="signup-input"
                    />

                    <CustomInput
                        label="Confirm Password *"
                        id="confirm"
                        type="password"
                        value={confirm}
                        onChange={updateConfirm}
                        containerClass="signup-input"
                    />

                    <div className="signup-location">
                        <CustomInput
                            label="Region *"
                            id="region"
                            type="text"
                            value={region}
                            containerClass="signup-input"
                            inputClass="signup-location-input"
                            readonly
                            placeholder="Click icon to get location"
                        />
                        <HiLocationMarker onClick={updateRegion} />
                    </div>

                    <div className="signup-uploader">
                        {/* <img src={profileImage === '' ? staticImage : profileImage} /> */}
                        <Uploader
                            id="profile"
                            label="Upload Profile Picture"
                            onImageSet={setImage}
                            progress={progress}
                        />
                    </div>

                    <div className="signup-control">
                        <CustomButton className="signup-button" onClick={() => history.goBack()}>Back</CustomButton>
                        <CustomButton className="signup-button" onClick={signup}>Create</CustomButton>
                    </div>


                </form>

                <div className="signup-card-footer">
                    <p className="signup-error">{error}</p>
                </div>
            </div>
        </div>
    );
}

export default SignUp;