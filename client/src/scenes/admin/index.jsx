import { React, useEffect, useState } from 'react';
import Dropzone from "react-dropzone";
import {
    Box, 
    useTheme, 
    useMediaQuery, 
    TextField, 
    Button,
    Typography,
    Select,
    MenuItem,
    CircularProgress
    } from '@mui/material';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from '@mui/material/Alert';
import { PersonAdd } from '@mui/icons-material';
import { useGetAdminsQuery } from 'state/api';
import { DataGrid } from '@mui/x-data-grid';
import Header from 'components/Header';
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import FlexBetween from 'components/FlexBetween';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik } from "formik";
import * as yup from "yup";

const UserSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().nullable(),
    country: yup.string().required("required"),
    role: yup.string().required("required"),
    picturePath: yup.string().nullable(),
  });

const AddUserSchema = yup.object().shape({
    name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    country: yup.string().required("required"),
    role: yup.string().required("required"),
    picturePath: yup.string().nullable(),
  });

const Admin = () => {
    const [pageType, setPageType] = useState("read");
    const isRead = pageType === "read"
    const isAdd = pageType === "add";
    const isUpdate = pageType === "update";
    const [loader, setLoader] = useState(null);

    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState("");
    const [status, setStatus] = useState(null);
    const [removeImg, setRemoveImg] = useState(null);
    const theme = useTheme();
    const { data, isLoading } = useGetAdminsQuery();
    const navigate = useNavigate();
    
    const userData = useSelector((state) => state.persistedReducer.user);
    const token = useSelector((state) => state.persistedReducer.token);

    const getUser = async () => {
        setStatus(null);
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/verifyadmin/${userData._id}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
        
    };
    useEffect(() => {
        getUser();
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
      

    const onDelete = async (e, row) => {
        setLoader("loading");

        e.stopPropagation();
    
        const deleteUser = await fetch(`${process.env.REACT_APP_BASE_URL}/users/delete/${row._id}`, {
            method: "GET",
        });

        const deletedUser = await deleteUser.json();
        if(deletedUser) {
            
            setStatus({type: "removed"});
            
        }
        setLoader(null);
    
    };

    const onUpdate = async (e, row) => {
        setLoader("loading");
        e.stopPropagation();

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/users/profile/${row._id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
        const iD = await response.json();

        setPageType("update");
        setUserId(iD);
        setLoader(null);
    }

    const add = async (values, onSubmitProps) => {
        setLoader("loading");
        
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
        
        const addUserResponse = await fetch(
            `${process.env.REACT_APP_BASE_URL}/users/add`,
          {
            method: "POST",
            body: formData,
          }
        );
        const addedUser = await addUserResponse.json();

        if(addedUser.error) {
            setStatus({
                type: "error",
                message: addedUser.error,
            });
        } else {
            
            setPageType("read");
            setStatus({type: "added"});
            
        }
        onSubmitProps.resetForm();
        setLoader(null);
    };

    const update = async (values, onSubmitProps) => {
        setLoader("loading");
        
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
            `${process.env.REACT_APP_BASE_URL}/users/update/${userData._id}`,
          {
            method: "PATCH",
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
            
            setPageType("read");
            setStatus({type: "updated"});
            
        }
        
        // onSubmitProps.resetForm();
        setLoader(null);
    };
    
    
    const initialValuesUpdate = {
        id: userId._id,
        name:userId.name,
        email: userId.email,
        password: "",
        country: userId.country,
        picture: userId.picturePath,
        role: userId.role
      };

    const initialValuesAdd = {
        name: "",
        email: "",
        password: "",
        country: "",
        picture: "default.jpg",
        role: "user"
    };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if(isAdd) await add(values, onSubmitProps);
        if(isUpdate) await update(values, onSubmitProps);
    };
      
    

    const columns = [
        {
            field: "name",
            headerName: "Name",
            flex: 0.6,
        },
        {
            field: "email",
            headerName: "Email",
            flex: 0.8,
        },
        {
            field: "country",
            headerName: "Country",
            flex: 0.4,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 0.5,
        },
        {
            field: "deleteButton",
            headerName: "Actions",
            description: "Actions Column.",
            flex: 0.5,
            renderCell: (params) => {
                return (
                    <>
                    { user
                    ? 
                        <>
                            {user._id === params.row._id ?
                                <>
                                    <Button
                                        onClick={(e) => navigate("/profile")}
                                        variant="contained" 
                                    >
                                        Edit Your Profile
                                    </Button>
                                </>
                            : 
                            <>
                                <Button
                                    onClick={(e) => onDelete(e, params.row)}
                                    variant="contained" 
                                >
                                    Delete
                                </Button>
                                <Button
                                    onClick={(e) => onUpdate(e, params.row)}
                                    variant="contained" 
                                    >
                                    Edit
                                </Button>
                            </>
                            
                            }
                            
                        </>
                    :
                        <>
                            <Typography>Access Denied</Typography>
                        </>
                    }
                        
                    </>
                );
            }
        }
    ];

  return (
    <Box m="1.5rem 2.5rem">
        <FlexBetween>
            <Header title={isRead ? "USERS" : "" || isAdd ? "Add User" : "" || isUpdate ? "Update User" : "" } subtitle="Managing Users and list of Admins" />
            { loader ?
                <CircularProgress />
            : ""}
            { user ?
                    <Box>
                        <Button
                            sx={{
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.background.alt,
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                            "&:hover": 
                                {
                                    color: theme.palette.secondary.light,
                                    border:1,
                                    borderColor: theme.palette.secondary.light
                                }
                            }}
                            onClick={() => {
                                setPageType(isRead ? "add" : "read");
                            }}
                        >
                            <PersonAdd sx={{ mr: "10px" }} />
                            {isRead ? "Add User" : "All Users"}
                        </Button>
                    </Box>
                
                : <></>}
            
            
        </FlexBetween>
        <Box gridColumn="span 4" mt="2rem">
            { status?.type === "removed" &&
                    <Alert severity="success">Record Removed Successfully!</Alert>
                }
            { status?.type === "added" &&
                <Alert severity="success">Record Added Sucessfully!</Alert>
            }
            { status?.type === "updated" &&
                <Alert severity="success">Record Updated Sucessfully!</Alert>
            }
            { status?.type === "error" &&
                <Alert severity="error">{status?.message}</Alert>
            }
        </Box>
        { isRead && (
            <>
                <Box
                    mt="40px"
                    height="75vh"
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none"
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none !important"
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderBottom: "none"
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: theme.palette.primary.light,
                        },
                        "& .MuiDataGrid-footerContainer": {
                            backgroundColor: theme.palette.background.alt,
                            color: theme.palette.secondary[100],
                            borderTop: "none"
                        },
                        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                            color: `${theme.palette.secondary[200]} !important`,
                        }
                    }}
                >
                    <DataGrid
                        loading={isLoading || !data}
                        getRowId={(row) => row._id}
                        rows={data || []}
                        columns={columns}
                        components={{
                            ColumnMenu: CustomColumnMenu
                        }}
                    />
                </Box>
            </>

        )}
        {!isRead && (
            <>
                <Box mt="4rem">
                    <Formik
                        onSubmit={handleFormSubmit}
                        validationSchema={isAdd ? AddUserSchema : UserSchema}
                        enableReinitialize={true}
                        initialValues={isAdd ? initialValuesAdd : initialValuesUpdate}
                    >
                        {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
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
                                    {isUpdate && (
                                        <>
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
                                        </>
                                    )}
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
                                {isUpdate ?
                                <>
                                    <Box sx={{ gridColumn: "span 4" }}>
                                        <Typography>Leave Empty if you don't want to change.</Typography>
                                    </Box>
                                 
                                    <TextField
                                        label="New Password"
                                        type="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.newPassword}
                                        name="newPassword"
                                        error={Boolean(touched.newPassword) && Boolean(errors.newPassword)}
                                        helperText={touched.newPassword && errors.newPassword}
                                        sx={{ gridColumn: "span 4" }}
                                    />
                                </>
                                : ""}
                                {isAdd ?
                                    <TextField
                                        label="Enter Password"
                                        type="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
                                        name="password"
                                        error={Boolean(touched.password) && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                        sx={{ gridColumn: "span 4" }}
                                    />

                                : ""}

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
                                    {isAdd ? "Add" : "Update"}
                                </Button>
                            </Box>
                        </form>
                        )}
                    </Formik>
                </Box>
            </>
        )}
        
    </Box>
  )
}

export default Admin;