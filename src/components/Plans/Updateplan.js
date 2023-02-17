import React, { useEffect, useState } from 'react';
import './Createplan.css';
import axios from 'axios';
import { json, Link, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import logoutIcon from '../../Icons/logout.png'
import crossIcon from '../../Icons/cross.png'

const Createplan = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [singleplan, setSingleplan] = useState({})

  useEffect(() => {
    if (localStorage.getItem('accesstoken')) {
      axios.post('http://localhost:3031/admincrud/getsingleplan', { id: location.state.id }).then((res) => {
        setSingleplan(res.data)
        //Following line will fetch data of services and add to Added Description Fields
        setFinalBucket(res.data.services)
        setCheck(res.data.mediator)
        // console.log(res.data)
      }).catch((err) => {
        console.log(err)
      })
    }
    else {
      navigate('/login')
    }

  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formdata = new FormData(e.target);
    const data = Object.fromEntries(formdata.entries());

    const payLoad = { ...data, services: JSON.stringify(finalBucket), id: location.state.id, mediator: data.mediator ? (JSON.parse(data.mediator)) : (JSON.parse('false')) }

    axios.post('http://localhost:3031/admincrud/updateplan', payLoad).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  // ************* Bucket For Plan Description *****************
  const [initialData, setInitialData] = useState('')
  const [finalBucket, setFinalBucket] = useState([])

  const [check, setCheck] = useState(false)

  const handleBucketData = () => {
    setFinalBucket([...finalBucket, initialData])
  }

  const handleDescDelete = (id) => {
    const newArr = finalBucket.filter((value, index) => {
      return index !== id
    })

    setFinalBucket(newArr)
  }

  return (
    <>
      <div className="col-lg-3">
        <Sidebar />
      </div>
      <div className="col-lg-9">

        <div className="row mt-3">
          <Link to="/logout">
            <img src={logoutIcon} alt="" className='float-end' />
          </Link>
        </div>

        <div classNameNameName="container">

          <form className='mt-5 createplan_div p-3' onSubmit={handleSubmit}>
            <h4 className='mb-5'>Update Plan</h4>

            <div className="mb-4">
              <input type="text" name='price' placeholder='Update Price of Plan' value={singleplan.price} className="form-control" />
            </div>

            <div className="mb-4">
              <input type="text" onChange={(e) => { setInitialData(e.target.value) }} placeholder='Update Plan Description' className="form-control" />
              <input type="button" className='bucket_button' onClick={handleBucketData} value="Update Description" />
            </div>

            {
              finalBucket.length === 0 ? ('') : (<h5 className='fw-bold mb-4'>Added Description:</h5>)
            }

            {
              finalBucket?.map((val, idx) => {
                return (
                  <div className="mb-4 d-flex flex-column desciption_div" key={idx} onClick={() => { handleDescDelete(idx) }}>
                    <img src={crossIcon} height="24px" width="24px" className='img-fluid' />
                    <p>{val}</p>
                  </div>
                )
              })
            }

            <div className="mb-4">
              <input type="number" name='contact_count' value={singleplan.contact_count} onChange={(e) => { setSingleplan({ ...singleplan, contact_count: e.target.value }) }} placeholder='Update Count of Profile Views' className="form-control" aria-describedby="emailHelp" />
            </div>

            <div className="mb-4">
              <input type="number" name='expiresinMonths' value={singleplan.expiresinMonths} onChange={(e) => { setSingleplan({ ...singleplan, expiresinMonths: e.target.value }) }} placeholder='Update Duration: (Example: 6)' className="form-control" />
            </div>

            <div className="form-check mb-4">

              <input type="checkbox" name='mediator'
                onChange={(e) => {
                  setSingleplan({ ...singleplan, mediator: JSON.parse(e.target.value) }); setCheck(!check)
                }}
                className="form-check-input"
                value={singleplan.mediator}
                id="flexCheckChecked"
                checked={check ? ('checked') : ('')}
              />

              <label className="form-check-label d-flex" for="flexCheckChecked">
                <b>Mediator Service Available?</b>
              </label>
            </div>

            <button type="submit" className="btn createAdminBtn">Submit Now</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Createplan;