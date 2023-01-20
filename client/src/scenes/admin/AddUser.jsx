import { React, useState } from 'react';
import { useSelector } from "react-redux";
import Header from 'components/Header';
import {
    Box, 
    useTheme, 
    useMediaQuery, 
    TextField, 
    Button,
    Typography,
    Select,
    MenuItem
    } from '@mui/material';

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from '@mui/material/Alert';
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";

const AddSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    country: yup.string().required("required"),
    role: yup.string().required("required"),
    picturePath: yup.string().nullable(),
  });



const AddUser = () => {
    const [status, setStatus] = useState(null);
    const userId = useSelector((state) => state.persistedReducer.user);

    const theme = useTheme();
    const navigate = useNavigate();

    const isNonMobile = useMediaQuery("(min-width:600px)");


    const add = async (values, onSubmitProps) => {
        
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
            `${process.env.REACT_APP_BASE_URL}/users/add`,
          {
            method: "POST",
            body: formData,
          }
        );
        const updateUser = await updatedUserResponse.json();

        if(updateUser.error) {
            setStatus({
                type: "error",
                message: updateUser.error,
            });
        } else {
            setStatus({type: "sucess"});
            navigate("/users");
            
        }
        // onSubmitProps.resetForm();
        
      };

      const initialValuesAdd = {
        id: userId._id,
        name: "",
        email: "",
        password: "",
        country: "",
        picture: "default.jpg",
        role: "user"
      };

    const handleFormSubmit = async (values, onSubmitProps) => {
        await add(values, onSubmitProps);
      };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Add User" subtitle="Add New User" />
      <Box m="2rem auto">
        <Formik
            onSubmit={handleFormSubmit}
            validationSchema={AddSchema}
            enableReinitialize={true}
            initialValues={initialValuesAdd}
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

                    <Select
                        labelId="select-role-label"
                        id="simple-role-select"
                        name="role"
                        onBlur={handleBlur}
                        value={values.role}
                        label="Role"
                        onChange={handleChange}
                    >
                        <MenuItem value="user">user</MenuItem>
                        <MenuItem value="admin">admin</MenuItem>
                        <MenuItem value="superadmin">superadmin</MenuItem>
                    </Select>

                    <TextField
                        label="Password"
                        type="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        error={Boolean(touched.password) && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                        sx={{ gridColumn: "span 4" }}
                    />

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
                        Add
                    </Button>
                </Box>
            </form>
            )}
        </Formik>
      </Box>
    </Box>
  )
}

export default AddUser