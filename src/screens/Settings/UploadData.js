import React, { useState } from 'react';
import '../../css/UploadData.css';
import Navbar from '../../components/Navbar';
import CustomButton from '../../components/CustomButton';
import Loading from '../../components/Loading';
import { getDB } from '../../api/Firebase';

const UploadData = () => {
    const [file, setFile] = useState();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState();
    const [response, setResponse] = useState('');
    const [names, setNames] = useState();

    const handleChange = e => {

        var reader = new FileReader();
        reader.onload = () => {
            setLoading(true);
            var text = reader.result;
            var words = convertRawtoArray(text);
            var n = getNames(words);
            // var objA = createObjArray(words);
            // console.log("text: ", text);
            console.log("names: ", n);
            // console.log("objects: ", objA);
            // setResults(objA);
            setNames(n)
            setLoading(false);
        }

        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            reader.readAsText(e.target.files[0]);
        }

    }

    const convertRawtoArray = (raw) => {
        let words = raw.split(",");
        let filteredWords = words.filter(word => word.length > 0);

        return filteredWords;
    }

    const createObjArray = (array) => {
        let objs = [];

        let line = 0;
        let index = 0;
        let maxLength = array.length;
        let register = 0;
        let ignore = ["DAY", "DATE", "SCRIPTURES", "'\n'"];

        for (index = 0; index < maxLength; index++) {
            var item = array[index];
            //add new line if new line character found
            if (item.includes('\n')) {
                line++;
                register = 0;
            }

            //if it just a solo new line go to next item
            if (item.includes('\n') && item.trim() === '') {
                register++;
                continue;
            }


            //skip first line
            if (line === 0) continue;

            //get the heading names
            if (line === 1) {
                var obj = {
                    name: item
                }
                objs.push(obj);
                continue;
            }

            //ignore title headings
            if (ignore.includes(item.trim())) {
                register++;
                // console.log(`ignored ${item} on line ${line}`);
                continue;

            }

            let objIndex = register / 3;
            let itemIndex = register % 3;
            if (itemIndex === 0) {
                //create day obj
                let day = item.trim();

                let data = {
                    date: array[index + 1],
                    scripture: array[index + 2]
                }


                objs[objIndex]["day-" + day] = data;
                console.log(`obj[${objIndex}]: `, objs[objIndex]);
            }
            register++;

        }

        return objs;
    }

    const getNames = (array) => {
        let n = [];

        let line = 0;
        let index = 0;
        let maxLength = array.length;
        let register = 0;

        for (index = 0; index < maxLength; index++) {
            var item = array[index];
            //add new line if new line character found
            if (item.includes('\n')) {
                line++;
                register = 0;
            }

            //if it just a solo new line go to next item
            if (item.includes('\n') && item.trim() === '') {
                register++;
                continue;
            }


            //skip first line
            if (line === 0) continue;

            //get the heading names
            if (line === 1) {
                n.push(item);
                continue;
            }

            return n;
        }

    }

    const submit = () => {
        const db = getDB();

        var batch = db.batch();

        results.forEach(item => {
            var ref = db.collection('schedule1').doc(item.name);
            batch.set(ref, item);
        });

        batch.commit().then(() => {
            setResponse("complete");
        }).catch(err => {
            setResponse(err.toString());
        })

    }

    const saveNames = () => {
        const db = getDB();

        db.collection('public_globals').doc('test').set({ names: names }).then(() => {
            console.log('complete');
            setResponse("complete");
        }).catch(err => {
            setResponse(err.toString());
        })
    }

    return (
        <div className="updata-container">
            <Navbar />

            <Loading Loading={loading} />

            <form className="updata-form">
                <label>CSV input</label>
                <input type="file" onChange={handleChange} accept=".csv" />
                <CustomButton onClick={saveNames}>Upload Data</CustomButton>
            </form>

            <p>{response}</p>
        </div>
    );
}

export default UploadData;