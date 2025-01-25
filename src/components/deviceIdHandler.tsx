'use client';

import { updateDeviceID } from '@/store/auth/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
/**
 * Retrieves deviceID from localStorage and update the Redux store, if available,
 * generating and storing one if it is missing.
 * @returns
 */
const HandleDeviceID = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let deviceID = localStorage.getItem('deviceID');

    if (!deviceID) {
      deviceID = uuidv4();
      localStorage.setItem('deviceID', deviceID);
    }

    dispatch(updateDeviceID(deviceID));
    console.log(`deviceID: ${deviceID}`);
  });

  return <></>;
};

export default HandleDeviceID;
