import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Navbar from '../components/Navbar';
import { useRecoilState } from 'recoil';
import { userProfile, userToken } from '../State';
import { Link, useHistory } from 'react-router-dom';
import { getProfile } from '../api/Firebase';
import profilePicture from '../images/img-person-placeholder.jpg';
import Card from '../components/Card.js';
import BibleImage from '../images/bible.jpg';
import VeniceImage from '../images/venice.jpg';
import AlpineImage from '../images/alpine.jpg';
import LinkItem from '../components/LinkItem';


const Home = () => {
    const [profile, setProfile] = useRecoilState(userProfile);
    const [user, setUser] = useRecoilState(userToken);

    let history = useHistory();

    useEffect(() => {
        if (user !== 'none') {
            getProfile(user.uid, (data) => {
                // console.log("profile set");
                setProfile(data);
            }, err => {
                console.log(err);
            })
        }
    }, [])

    let imageStyle = {
        backgroundImage: `url(${profile.profileImage ? profile.profileImage : profilePicture})`,
        backgroundColor: 'grey',
    }

    const smallTimeZone = (t) => {
        let z = t.split("WORLD TIME ZONE ");

        return z[1];
    }

    return (
        <div className="home-container">
            <Navbar />

            <div className="home-card">
                <div className="home-card-left">
                    <div className="home-card-profile" style={imageStyle}>
                    </div>
                </div>
                <div className="home-card-right">
                    <p className="home-card-date">{new Date().toDateString()}</p>
                    <h4>Welcome {profile && profile.name}</h4>
                    <p className="home-card-title">Region</p>
                    <span>{profile && profile.region}</span>
                    <p className="home-card-title">Time Zone</p>
                    <span>{profile && smallTimeZone(profile.timezone)}</span>
                    <p className="home-card-title">Daily Reading</p>
                    <span>PSALM 123 - 132</span>
                </div>
                <div className="home-card-footer">
                    <div className="home-card-downloadables">
                        <h4>Downloadable Material</h4>
                        <a href="#" >New Zealand - Day Prayer Mountain</a>
                        <a href="#" >360 Prayer Points</a>
                    </div>
                    <div className="home-card-button">
                        <button>Start Prayer</button>
                    </div>
                </div>
            </div>


            <Card title="Bible Readings" bg={BibleImage} >
                <p className="home-bible-reading">Time Zone 0: 7pm - 8pm</p>
                <p className="home-bible-reading small">Yesterday: PSALM 123- 132</p>
                <p className="home-bible-reading small">Today: PSALM 133- 142</p>
                <p className="home-bible-reading small">Tomorrow: PSALM 143- 150 + PROVERBS 1-2 </p>

            </Card>

            <Card title="Global Prayer Links" bg={VeniceImage} overlay="rgba(0,0,0,0.45)">
                <LinkItem
                    url="#"
                    title="Prayer and Intercession - 6pm"
                />
                <LinkItem
                    url="#"
                    title="Bible Reading & Proclamation - 7pm"
                />
                <LinkItem
                    url="#"
                    title="Praise & Worship - 8pm"
                />
            </Card>

            <Card title="Countries and Time Zones" bg={AlpineImage} overlay="rgba(0,0,0,0.45)" >
                <p className="home-timezone">Your Current Time Zone:</p>
                <p className="home-timezone small">+12 : Auckland, New Zealand</p>
                <p className="home-timezone">Other Countries included:</p>
                <p className="home-timezone small">Fiji, Kiribati, Nauru, Tuvalu, AU-Norfolk Island, Wallis & Futuna</p>
            </Card>

        </div>
    );
}

export default Home;