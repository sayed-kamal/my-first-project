import React, { useEffect, useState } from 'react';
import style from './Aladhan.module.css'
import axios from 'axios';
import moment from 'moment';
import "moment/locale/ar";
moment.locale("ar");


export default function Aladhan() {
 
    const [updatData, setUpdatdata] = useState({});

    const [updatDate, setUpdatdate] = useState('');

 const [reminingTim, setReminingTim] = useState('')


    const [handelCity, setHandelCity] = useState({
        disPlayName: 'القاهرة',
        apiNamme:'Cairo'
    });

    let avilabelCitys = [
    
        {
            disPlayName: 'القاهرة',
            apiNamme: 'Cairo'
        },

        {
            disPlayName: 'الجيزة',
            apiNamme: 'Giza'
        },

        {
            disPlayName: 'الاسكندرية',
            apiNamme: 'Alexandria'
        }
                          
        
    ];

    const [nextPrayer, setNextPrayer] = useState(2);

    let prayersName = [
        { key: 'Fajr', apiName: 'الفجر' },
        { key: 'Sunrise', apiName: 'الشروق' },
        { key: 'Dhuhr', apiName: 'الظهر' },
        { key: 'Asr', apiName: 'العصر' },
        { key: 'Maghrib', apiName: 'المغرب' },
        { key: 'Isha', apiName: 'العشاء' }
        
    ]


    async function getmouqitAlsalah() {
        
        let {data} = await axios.get(`https://api.aladhan.com/v1/timingsByCity/:date?country=eg&city=${handelCity.apiNamme}`);
       
        setUpdatdata(data.data.timings  );
        
       
    }
    
    useEffect(() => {

        
        
        getmouqitAlsalah();

    }, [handelCity]);

    useEffect(() => {
        let interval = setInterval(() => {
            updatTimer();
             let t =moment()
            setUpdatdate(t.format(' Do MMM YYYY | hh:mm'));
            
        }, 1000);

       

        return () => {
            clearInterval(interval)
        }
    },[updatData])

    function handelOnChange(event) {
        let citiesObject = avilabelCitys.find((city)=> {
            return city.apiNamme == event.target.value;
        })
        
        setHandelCity(citiesObject)
       
    }
    
    
    let updatTimer = () => {

        let momentNow = moment();
        
        let prymerIndex = 2;
         

        if (momentNow.isAfter(moment(updatData['Fajr'], 'hh:mm'))
            && momentNow.isBefore(moment(updatData['Sunrise'], 'hh:mm'))) {
            prymerIndex = 1;
            
        } else if (momentNow.isAfter(moment(updatData['Sunrise'], 'hh:mm'))
            && momentNow.isBefore(moment(updatData['Dhuhr'], 'hh:mm'))) {
            prymerIndex = 2;
            
        } else if (momentNow.isAfter(moment(updatData['Dhuhr'], 'hh:mm'))
            && momentNow.isBefore(moment(updatData['Asr'], 'hh:mm'))) {
            prymerIndex = 3;
            
        } else if (momentNow.isAfter(moment(updatData['Asr'], 'hh:mm'))
            && momentNow.isBefore(moment(updatData['Maghrib'], 'hh:mm'))) {
            prymerIndex = 4;
            
        } else if (momentNow.isAfter(moment(updatData['Maghrib'], 'hh:mm'))
            && momentNow.isBefore(moment(updatData['Isha'], 'hh:mm'))) {
            prymerIndex = 5;
            
        } else {
            prymerIndex = 0;
            
        }

        setNextPrayer(prymerIndex);

        let nextPrayerObject = prayersName[prymerIndex];

        let nextPrayerTiming = updatData[nextPrayerObject.key];

        let nextPrayerTimingMoment = moment(nextPrayerTiming, 'hh:mm');
        // console.log(nextPrayerTimingMoment);
        

        let remeinigTime = moment(nextPrayerTiming, 'hh:mm').diff(momentNow);
        
        if ( remeinigTime < 0 ) {
            let midTimingdiff = moment('23:59:59', 'hh:mm:ss').diff(momentNow);

            let fjerPryerTime =nextPrayerTimingMoment.diff(moment('00:00:00', 'hh:mm:ss'))
            //  console.log(midTimingdiff.format('23:59:59', 'hh:mm:ss'));
            let timeAdanElfajr = fjerPryerTime + midTimingdiff;

            remeinigTime = timeAdanElfajr;
            // console.log(timeAdanElfajr);
            
            
        };
        
    
        let durationRemeinigTime = moment.duration(remeinigTime);

        setReminingTim(`${durationRemeinigTime.seconds()} : ${durationRemeinigTime.minutes()} : ${durationRemeinigTime.hours()}`)
        
        

    };
    
    

    return <>
        <div className="mt-5 p-4 container text-white  ">
            <div className="d-flex justify-content-around text-white align-items-center ">
                 <div className="">
                <h1 className='fs100'>{ handelCity.disPlayName}</h1>
                    <p className='fs-1 text-center'>{updatDate} </p>
                   
            </div>
            <div className="me-3 text-center">
                    <h2>متبقي حتي صلاة { prayersName[nextPrayer].apiName } </h2>
                    <p className='h1 p-3'>{ reminingTim}</p>
            </div>
            </div>
           
            <hr className='hrm' />
        <div className='row g-2 col-md-12 align-items-center justify-content-center'>
            <div className="col p-0 text-center bg-success ms-4 bg-white  ">
                <h1 className='bg-h mb-4 '>الفجر</h1>
                <h5  className='text-black fs50 hh5 fw-bold d-flex align-items-center justify-content-center '>{updatData.Fajr} </h5>
            </div>
            <div className="col p-0 text-center bg-success ms-4 bg-white  ">
                <h1 className='bg-h mb-4'>الشروق</h1>
                <h5  className='text-black fs50 hh5 fw-bold d-flex align-items-center justify-content-center '>{updatData.Sunrise}</h5>
            </div>
            <div className="col p-0 text-center bg-success ms-4 bg-white  ">
                <h1 className='bg-h mb-4'>الظهر</h1>
                <h5  className='text-black fs50 hh5 fw-bold d-flex align-items-center justify-content-center '>{updatData.Dhuhr}</h5>
            </div>
            <div className="col p-0 text-center bg-success ms-4 bg-white  ">
                <h1 className='bg-h mb-4'>العصر</h1>
                <h5  className='text-black fs50 hh5 fw-bold d-flex align-items-center justify-content-center '>{updatData.Asr}</h5>
            </div>
            <div className="col p-0 text-center bg-success ms-4 bg-white  ">
                <h1 className='bg-h mb-4'>المغرب</h1>
                <h5 className='text-black fs50 hh5 fw-bold d-flex align-items-center justify-content-center '>{updatData.Maghrib}</h5>
            </div>
            <div className="col p-0 text-center bg-success ms-4 bg-white  ">
                <h1 className='bg-h mb-4'>العشاء</h1>
                <h5  className='text-black fs50 hh5 fw-bold d-flex align-items-center justify-content-center '>{updatData.Isha}</h5>
            </div>
           
            </div>

            <div className="text-center h-50 mt-5 ">
                <label className='fs-1' htmlFor="">المدينة : </label>
                <select onChange={handelOnChange} className='w-25 fs-2 p-1 selectHeight text-center'>
                    {avilabelCitys.map((city) => {
                        return (
                            <option key={city.apiNamme} value={city.apiNamme} className='fs-1'>{ city.disPlayName}</option> 
                        )
                    })}
                    
                

                </select>
</div>

        </div>
    </>
}
