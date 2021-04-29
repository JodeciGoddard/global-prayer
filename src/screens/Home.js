import React, { useState, useEffect } from 'react';
import '../css/Home.css';
import Navbar from '../components/Navbar';
import { useRecoilState } from 'recoil';
import { userProfile, userToken } from '../State';
import { Link, useHistory } from 'react-router-dom';
import { getProfile, getBibleReading, getDB } from '../api/Firebase';
import profilePicture from '../images/img-person-placeholder.jpg';
import Card from '../components/Card.js';
import BibleImage from '../images/bible.jpg';
import VeniceImage from '../images/venice.jpg';
import AlpineImage from '../images/alpine.jpg';
import LinkItem from '../components/LinkItem';
import Loading from '../components/Loading';
import moment from 'moment';
import { motion } from 'framer-motion';


const Home = () => {
    const [profile, setProfile] = useRecoilState(userProfile);
    const [user, setUser] = useRecoilState(userToken);

    const [reading, setReading] = useState();
    const [links, setLinks] = useState();
    const [todaysReading, setTodaysReading] = useState();

    const [loaded, setLoaded] = useState(false);
    let history = useHistory();

    useEffect(() => {

        if (user !== 'none') {
            getProfile(user.uid, (data) => {
                // console.log("profile set");
                loadLinks();
                setProfile(data);
                loadBibleReading(data);
            }, err => {
                console.log(err);
            })
        } else {
            history.push('/');
        }


    }, []);

    useEffect(() => {
        if (reading) {
            loadTodaysReading();
        }
    }, [reading])

    useEffect(() => {
        if (user && profile && reading && links && todaysReading) {
            setLoaded(true);
        }
    }, [user, profile, reading, links, todaysReading]);

    let imageStyle = {
        backgroundImage: `url(${profile.profileImage ? profile.profileImage : profilePicture})`,
        backgroundColor: 'grey',
    }

    const smallTimeZone = (t) => {
        if (!t) return;
        let z = t.split("WORLD TIME ZONE ");

        return z[1];
    }

    const loadBibleReading = (p) => {
        if (!p) return;

        getBibleReading(p.timezone, (data) => {
            setReading(data);
            //console.log("Readings: ", data);
        }, (err) => {
            alert(err);
        })
    }

    const loadLinks = () => {
        const ref = getDB().collection('public_globals').doc('links');

        ref.get().then(doc => {
            if (doc.exists) {
                var values = Object.values(doc.data());
                setLinks(values);
            } else {
                setLinks([]);
            }
        }).catch(error => {
            alert('Network Error:: pub global/links');
            console.log(error);
        });
    }

    const getBibleReadingByDay = day => {
        if (!reading) return;

        return reading["day-" + day];
    }

    const getBibleReadingByDate = (date) => {
        if (!reading) return;

        let value = Object.values(reading);
        let key = Object.keys(reading);
        for (let i = 0; i < value.length; i++) {
            if (value[i].date === date) {
                let d = key[i].split('day-');
                return {
                    ...value[i],
                    day: d[1]
                }
            };

        }

        console.log('date not found: ', date);
        return null;
    }

    const loadTodaysReading = () => {
        const d = moment().format("M/D/YYYY");

        setTodaysReading(getBibleReadingByDate(d));
    }


    const emptyVariants = {
        init: { opacity: 0 },
        anim: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                delay: 0.2,
                staggerChildren: 0.5
            }
        }

    }

    const containerVariants = {
        init: {
            x: '-100vw',
            opacity: 0
        },
        anim: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.4,
                type: 'spring',
                stiffness: 90
            }
        }
    }


    return (
        <>
            {loaded ? <motion.div className="home-container"
                variants={emptyVariants}
                initial="init"
                animate="anim"
            >

                <Navbar />

                <motion.div
                    className="home-card"
                    variants={containerVariants}
                >
                    <div className="home-card-left">
                        <div className="home-card-profile" style={imageStyle}>
                        </div>
                    </div>
                    <div className="home-card-right">
                        <p className="home-card-date">{moment().format("DD MMM YYYY")}</p>
                        <h4>Welcome {profile && profile.name}</h4>
                        <p className="home-card-title">Region</p>
                        <span>{profile && profile.region}</span>
                        <p className="home-card-title">Time Zone</p>
                        <span>{profile && smallTimeZone(profile.timezone)}</span>
                        <p className="home-card-title">Daily Reading</p>
                        <span>{todaysReading && todaysReading.scripture}</span>
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

                </motion.div>


                <Card title="Bible Readings" bg={BibleImage} >
                    {todaysReading && <> <p className="home-bible-reading">{profile && profile.timezone}</p>
                        <p className="home-bible-reading small">Yesterday: {getBibleReadingByDay(parseInt(todaysReading.day) - 1).scripture}</p>
                        <p className="home-bible-reading small">Today: {todaysReading.scripture}</p>
                        <p className="home-bible-reading small">Tomorrow: {getBibleReadingByDay(parseInt(todaysReading.day) + 1).scripture}</p> </>}

                </Card>

                <Card title="Global Prayer Links" bg={VeniceImage} overlay="rgba(0,0,0,0.45)" hideShowMore>
                    {links && links.map((item, index) => {
                        return (
                            <LinkItem
                                url={item.url}
                                title={item.title}
                                key={index}
                            />
                        );
                    })}
                </Card>

                <Card title="Countries and Time Zones" bg={AlpineImage} overlay="rgba(0,0,0,0.45)" >
                    <p className="home-timezone">Your Current Time Zone:</p>
                    <p className="home-timezone small">+12 : Auckland, New Zealand</p>
                    <p className="home-timezone">Other Countries included:</p>
                    <p className="home-timezone small">Fiji, Kiribati, Nauru, Tuvalu, AU-Norfolk Island, Wallis & Futuna</p>
                </Card>

            </motion.div> : <Loading Loading={!loaded} />}
        </>
    );
}

export default Home;