import React from 'react';
import Header from 'components/Header';
import UpdateForm from './UpdateForm';
import { Box } from '@mui/material';



const Profile = () => {

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="PROFILE" subtitle="Edit Your Profile Information Here." />
      <Box m="2rem auto">
        <UpdateForm />
      </Box>
    </Box>
  )
}

export default Profile