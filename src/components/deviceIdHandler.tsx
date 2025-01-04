'use client';

import { updateDeviceID } from '@/store/user/userSlice';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';

const HandleDeviceID = () => {
	const dispatch = useDispatch();

  useEffect(() => {
    let deviceID = localStorage.getItem('deviceID');

    if (!deviceID) {
        deviceID = crypto.randomUUID();
        localStorage.setItem('deviceID', deviceID);
    }

		dispatch(updateDeviceID(deviceID));
		console.log(`deviceID: ${deviceID}`);
  })
  
    return (
    <></>
  )
}

export default HandleDeviceID;