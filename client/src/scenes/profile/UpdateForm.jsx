import { React, useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
    Box, 
    useTheme, 
    useMediaQuery, 
    TextField, 
    Button,
    Typography
    } from '@mui/material';

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from '@mui/material/Alert';
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useDispatch } from "react-redux";
import { setLogin } from "state";

const updateSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    country: yup.string().required("required"),
    picturePath: yup.string().nullable(),
  });

  

  

const UpdateForm = () => {

    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(null);
    const [removeImg, setRemoveImg] = useState(null);

    const userId = useSelector((state) => state.persistedReducer.user);
    const token = useSelector((state) => state.persistedReducer.token);
    
    
    const theme = useTheme();
    const dispatch = useDispatch();

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const getUser = async () => {
        setStatus(null);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/profile/${userId._id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
      };
    
      useEffect(() => {
        getUser();
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
    
    if (!user) return null;

    const update = async (values, onSubmitProps) => {
        
        // this allows us to send form info with image
        const formData = new FormData();
        for (let value in values) {
          formData.append(value, values[value]);
        }
        
        if(values.picture.name)
        {
          formData.append("picturePath", values.picture.name);
        } else {
          formData.append("picturePath", values.picture);
        }
        
        
        const updatedUserResponse = await fetch(
            `${process.env.REACT_APP_BASE_URL}/users/update/${userId._id}`,
          {
            method: "PATCH",
            body: formData,
          }
        );
        const updateUser = await updatedUserResponse.json();

        
        if(updateUser.message) {

          console.log(updateUser.message);
          setStatus({type: "error", message: updateUser.message});
        } else {
          // setUser(updateUser);
          // token = updateUser.token;
          dispatch(
            setLogin({
                user: updateUser.user,
                token: updateUser.token
            })
          );
          setStatus({type: "success"});

        }
        
        // onSubmitProps.resetForm();
      };

      const initialValuesUpdate = {
        id: user._id,
        name:user.name,
        email: user.email,
        password: user.password,
        country: user.country,
        picture: user.picturePath,
        role: user.role,
      };

    const handleFormSubmit = async (values, onSubmitProps) => {
        await update(values, onSubmitProps);
      };
    

  return (
    <>
      
    <Formik
      onSubmit={handleFormSubmit}
      validationSchema={updateSchema}
      enableReinitialize={true}
      initialValues={initialValuesUpdate}
    >
        {({
          values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }
              }}
            >
              <TextField
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={Boolean(touched.name) && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }} />

              <TextField
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={Boolean(touched.email) && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }} />

              <TextField
                label="Country"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.country}
                name="country"
                error={Boolean(touched.country) && Boolean(errors.country)}
                helperText={touched.country && errors.country}
                sx={{ gridColumn: "span 4" }} />

              <Box
                gridColumn="span 4"
                border={`1px solid ${theme.palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
              >
                { values.picture.name
                ?
                  <Box width="80px" height="80px" mb="10px"
                    alt="User New Picture"
                    sx={{ objectFit: "cover" }}>
                    <img
                      style={{ objectFit: "cover" }}
                      alt="user"
                      width="80px" height="80px"
                      src={`${process.env.REACT_APP_BASE_URL}/assets/${values.picture.name}`} />
                  </Box>
                  
                :
                  <Box mb="10px"
                    alt="User Old Picture"
                    sx={{ objectFit: "cover" }}>
                    <img
                      style={{ objectFit: "cover" }}
                      alt="user"
                      width="80px" height="80px"
                      src={`${process.env.REACT_APP_BASE_URL}/assets/${values.picture}`} />
                      <Button sx={{color: theme.palette.secondary[300]}}
                        onClick={() => {
                            user.picturePath = "default.jpg";
                            setRemoveImg({type: true});
                          }}
                      >
                        { removeImg === null && "Remove Picture" }
                        { removeImg?.type === true && "Click Update to make changes" }
                      </Button>
                  </Box>
                }
                
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${theme.palette.primary.main}`}
                      p="1rem"
                      sx={{ "&:hover": { cursor: "pointer" } }}
                    >
                      <input {...getInputProps()} />
                      {!values.picture ? (
                        <p>Update Your Picture</p>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.picture.name} Update Your Picture</Typography>
                          <EditOutlinedIcon />
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>

              </Box>
              
              

                <Box gridColumn="span 4">
                  { status?.type === "success" &&
                        <Alert severity="success">Information is Updated!</Alert>
                      }
                  { status?.type === "error" &&
                    <Alert severity="error">{status?.message}</Alert>
                  }
                </Box>

              <Button
                  fullWidth
                  type="submit"
                  sx={{
                    m: "2rem 0",
                    p: "1rem",
                    backgroundColor: theme.palette.secondary[300],
                    color: theme.palette.background.alt,
                    "&:hover": {
                      color: theme.palette.secondary[300],
                      border: 1,
                      borderColor: theme.palette.secondary[300]
                    }
                  }}
                >
                Update
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default UpdateForm