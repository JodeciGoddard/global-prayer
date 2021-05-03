import React, { useState, useEffect } from 'react';
import '../css/BibleReadings.css'
import Navbar from '../components/Navbar';
import BibleImage from '../images/bible.jpg';
import { userProfile, userToken } from '../State';
import { useRecoilValue } from 'recoil';
import { useHistory } from 'react-router-dom';
import { getBibleReading, getDB } from '../api/Firebase';
import Loading from '../components/Loading';
import moment from 'moment';
import { BsClockFill } from 'react-icons/bs';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const emptyVariants = {
    init: { opacity: 0 },
    anim: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            delay: 0.5,
            staggerChildren: 0.3
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
            stiffness: 100
        }
    }
}

const BibleReadings = () => {
    const [reading, setReading] = useState();
    const [loaded, setLoaded] = useState(false);
    const [timezones, setTimezones] = useState();
    const [selectedTimezone, setSelectedTimezone] = useState();
    const [pageItem, setPageItems] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const profile = useRecoilValue(userProfile);
    const user = useRecoilValue(userToken);

    let history = useHistory();

    useEffect(() => {
        if (user === 'none') {
            history.push('/');
        } else {
            loadBibleReading();
        }

    }, []);

    useEffect(() => {
        if (reading) {
            loadPageItems();

        }
    }, [reading, currentPage]);

    let backgroundStyle = {
        backgroundImage: `url(${BibleImage})`
    }

    const loadBibleReading = () => {
        if (!profile) return;
        setSelectedTimezone(profile.timezone);
        getBibleReading(profile.timezone, (data) => {
            setReading(data);
            loadTimezones();
        }, (err) => {
            alert(err);
        })
    }

    const loadTimezones = () => {
        let db = getDB();
        let ref = db.collection('public_globals').doc('timezones');

        ref.get().then(doc => {
            if (doc.exists) {
                setTimezones(doc.data().names);
                setLoaded(true);
                // console.log("public data: ", doc.data().names);
            } else {
                alert('Search Error: Please reload');
            }
        }).catch(error => {
            alert("Network Error: see log");
            console.log("Network Error: ", error);
        });
    }

    const loadNewTimezone = (t) => {
        setSelectedTimezone(t);
        getBibleReading(t, (data) => {
            setReading(data);
        }, (err) => {
            alert(err);
        })
    }

    const getNumberOfPages = () => {
        if (!reading) return 0;

        return parseInt(Object.keys(reading).length / 7) + 1;
    }

    const loadPageItems = () => {
        let a = [];
        let keys = Object.keys(reading)
        keys.sort((a, b) => {
            let text1 = a.split("day-");
            let text2 = b.split("day-");
            if (text1[0] === 'name') return 1;
            if (text2[0] === 'name') return -1;

            return parseInt(text1[1]) - parseInt(text2[1]);
        });
        let pageIndex = (currentPage - 1) * 7;
        let obj = {};

        for (let i = pageIndex; i < pageIndex + 7; i++) {
            if (i >= keys.length - 1) break;
            obj = { ...reading[keys[i]], day: keys[i] };
            a.push(obj);
        }


        setPageItems(a);
    }

    const nextPage = () => {
        let n = getNumberOfPages();
        if (currentPage === n) {
            setCurrentPage(1);
            return;
        }
        setCurrentPage(currentPage + 1);
    }

    const prevPage = () => {
        let n = getNumberOfPages();
        if (currentPage === 1) {
            setCurrentPage(n);
            return;
        };
        setCurrentPage(currentPage - 1);
    }

    return (
        <>
            {loaded ? <motion.div
                className="bible-container"
                style={backgroundStyle}
                variants={emptyVariants}
                initial="init"
                animate="anim"
            >
                <Navbar />
                {console.log("secondary page load")}
                <div className="bible-wrapper" >
                    <motion.div
                        className="bible-header"
                        variants={containerVariants}
                    >
                        <h4>{selectedTimezone}</h4>
                        <p className="bible-date">{moment().format('DD MMM YYYY')}</p>
                        <div className="bible-selector">
                            <BsClockFill />
                            <select name="titles" onChange={e => loadNewTimezone(e.target.value)}>
                                <option value="default">Select Different TimeZone</option>
                                {timezones && timezones.map((item, index) => {
                                    return (
                                        <option value={item} key={index}>{item}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <p className="bible-pg">Page {`${currentPage}/${getNumberOfPages()}`}</p>
                    </motion.div>

                    <div className="bible-main-wrapper">
                        {pageItem.length > 0 && pageItem.map((item, index) => {
                            return (
                                <motion.div
                                    className="bible-main"
                                    key={index}
                                    variants={containerVariants}
                                >
                                    <h3>{item.day}</h3>
                                    <p className="bible-date">{item.date}</p>
                                    <p className="bible-scrip">{item.scripture}</p>
                                </motion.div>
                            );
                        })}
                    </div>


                </div>

                <div className="bible-pgLeft" onClick={prevPage}>
                    <FaChevronLeft />
                </div>

                <div className="bible-pgRight" onClick={nextPage}>
                    <FaChevronRight />
                </div>

            </motion.div> : <Loading Loading={!loaded} />}
        </>

    );
}

export default BibleReadings;