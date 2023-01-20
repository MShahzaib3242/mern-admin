import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}
    alt="profile"
    borderRadius="50%"
    sx={{ objectFit: "cover"}}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${process.env.REACT_APP_BASE_URL}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
