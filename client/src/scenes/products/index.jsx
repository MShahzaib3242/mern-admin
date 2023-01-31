import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, 
    Card, 
    CardActions, 
    CardContent, 
    Collapse, 
    Button, 
    Typography, 
    Rating, 
    useTheme, 
    useMediaQuery,
    CircularProgress,
    TextField,
    Select,
    MenuItem
    } from "@mui/material";

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { PersonAdd } from '@mui/icons-material';
import Header from "components/Header";
import FlexBetween from 'components/FlexBetween';
import { useGetProductsQuery } from 'state/api';
import * as yup from "yup";
import { Formik } from "formik";

const AddProductSchema = yup.object().shape({
    name: yup.string().required("required"),
    price: yup.number().required("required"),
    description: yup.string().required("required"),
    category: yup.string().required("required"),
    rating: yup.number().required("required"),
    supply: yup.number().nullable(),
  });

  const ProductSchema = yup.object().shape({
    name: yup.string().required("required"),
    price: yup.string().email("invalid email").required("required"),
    description: yup.string().nullable(),
    category: yup.string().required("required"),
    rating: yup.string().required("required"),
    supply: yup.string().nullable(),
  });

const Product = ({
    _id,
    name,
    description,
    price,
    rating,
    category,
    supply,
    stat
}) => {
    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);
    const [loader, setLoader] = useState(null);
    const [status, setStatus] = useState(null);

    const onDelete = async (e, _id) => {
        setLoader("loading");

        e.stopPropagation();
        console.log(e);
        const deleteUser = await fetch(`${process.env.REACT_APP_BASE_URL}/client/product/delete/${_id}`, {
            method: "GET"
        });

        const deletedUser = await deleteUser.json();
        if(deletedUser) {
            
            setStatus({type: "removed"});
            
        }
        setLoader(null);
    
    };

    return (
        <Card
            sx={{
                backgroundImage: "none",
                backgroundColor: theme.palette.background.alt,
                borderRadius: "0.55rem"
            }}
        >
            <CardContent>
                <Typography
                    sx={{ fontSize: 14}}
                    color={theme.palette.secondary[700]}
                    gutterBottom    
                >
                    {category}
                </Typography>
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <Typography sx={{mb: "1.5rem"}} color={theme.palette.secondary[400]}>
                    ${Number(price).toFixed(2)}
                </Typography>
                <Rating value={rating} readOnly />

                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    variant="primary"
                    size="small"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    See More
                </Button>
            </CardActions>
            <Collapse
                in={isExpanded}
                timeout="auto"
                unmountOnExit
                sx={{
                    color: theme.palette.neutral[300]
                }}
            >
                <CardContent>
                    <Typography>id: {_id}</Typography>
                    <Typography>Supply Left: {supply}</Typography>
                    <Typography>Yearly Sales This Year: {stat.yearlySalesTotal}</Typography>
                    <Typography>Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits }</Typography>
                </CardContent> 
                <Button
                    onClick={(e) => onDelete(e, _id)}
                    variant="contained" 
                >
                    Delete
                </Button>
                { loader ?
                <Stack sx={{color: theme.palette.secondary[300]}}>
                    <CircularProgress color="secondary"  />
                </Stack>
                : ""}
                <Box gridColumn="span 4" mt="2rem">
                    { status?.type === "removed" &&
                            <Alert severity="success">Record Removed Successfully!</Alert>
                        }
                </Box>
            </Collapse>
        </Card>
    )
}

const Products = () => {
    const [pageType, setPageType] = useState("read");
    const isRead = pageType === "read";
    const isAdd = pageType === "add";
    const isUpdate = pageType === "update";
    const { data, isLoading } = useGetProductsQuery();
    const isNonMobile = useMediaQuery("(min-width: 1000px)");
    const theme = useTheme();
    const [loader, setLoader] = useState(null);
    const [status, setStatus] = useState(null);
    const [user, setUser] = useState(null);
    
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

    const add = async (values, onSubmitProps) => {
        setLoader("loading");
       
        const addProductResponse = await fetch(
            `${process.env.REACT_APP_BASE_URL}/client/products/add`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        const addedProduct = await addProductResponse.json();

        if(addedProduct.error) {
            setStatus({
                type: "error",
                message: addedProduct.error,
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


    const initialValuesAdd = {
        name: "",
        price: "",
        description: "",
        category: "",
        rating: "",
        supply: ""
    };

    const initialValuesUpdate = {
        name: "",
        price: "",
        description: "",
        category: "",
        rating: "",
        supply: ""
      };

    const handleFormSubmit = async (values, onSubmitProps) => {
        if(isAdd) await add(values, onSubmitProps);
        if(isUpdate) await update(values, onSubmitProps);
    };

  return (
    <Box m="1.5rem 2.5rem">
        <FlexBetween>
            <Header title={isRead ? "PRODUCTS" : "Add New Product"} subtitle="See your list of products." />
            
            { loader ?
                <Stack sx={{color: theme.palette.secondary[300]}}>
                    <CircularProgress color="secondary"  />
                </Stack>
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
                        {isRead ? "Add Product" : "All Products"}
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

        { isRead
        ?   <>
            {data || !isLoading
                ? (
                    <Box
                        mt="20px"
                        display="grid"
                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                        justifyContent="space-between"
                        rowGap="20px"
                        columnGap="1.33%"
                        sx={{
                            "& > div" : { gridColumn : isNonMobile ? undefined : "span 4"}
                        }}
                    >
                        {data.map(
                            ({
                            _id,
                            name,
                            description,
                            price,
                            rating,
                            category,
                            supply,
                            stat
                        }) => (
                            <Product
                            key={_id}
                            _id= {  _id}
                            name= { name}
                            description= {  description}
                            price= {    price}
                            rating= {   rating}
                            category= { category}
                            supply= { supply}
                            stat= { stat}
                            />
                            )
                        )}
                    </Box>
                ) : (
                    <Stack sx={{color: theme.palette.secondary[300]}}>
                        <CircularProgress color="secondary"  />
                    </Stack>
                )}
            </>
            : ""}
        
        {!isRead && (
            <>
                <Box mt="4rem">
                    <Formik
                        onSubmit={handleFormSubmit}
                        validationSchema={isAdd ? AddProductSchema : ProductSchema}
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
                                    label="Name"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.name}
                                    name="name"
                                    error={Boolean(touched.name) && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ gridColumn: "span 4" }} />

                                <TextField
                                    label="Price"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.price}
                                    name="price"
                                    error={Boolean(touched.price) && Boolean(errors.price)}
                                    helperText={touched.price && errors.price}
                                    sx={{ gridColumn: "span 4" }} />

                                <TextField
                                    label="Description"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.description}
                                    name="description"
                                    error={Boolean(touched.description) && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                    sx={{ gridColumn: "span 4" }} />

                                <Select
                                    labelId="simple-rating-select"
                                    id="simple-rating-select"
                                    name="rating"
                                    onBlur={handleBlur}
                                    value={values.rating}
                                    label="Rating"
                                    onChange={handleChange}
                                    error={Boolean(touched.rating) && Boolean(errors.rating)}
                                >
                                    <MenuItem value="1">1 Star</MenuItem>
                                    <MenuItem value="2">2 Star</MenuItem>
                                    <MenuItem value="3">3 Star</MenuItem>
                                    <MenuItem value="4">4 Star</MenuItem>
                                    <MenuItem value="5">5 Star</MenuItem>
                                </Select>

                                <TextField
                                    label="Category"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.category}
                                    name="category"
                                    error={Boolean(touched.category) && Boolean(errors.category)}
                                    helperText={touched.category && errors.category}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <TextField
                                    label="Supply"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.supply}
                                    name="supply"
                                    error={Boolean(touched.supply) && Boolean(errors.supply)}
                                    helperText={touched.supply && errors.supply}
                                    sx={{ gridColumn: "span 4" }}
                                />

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

export default Products