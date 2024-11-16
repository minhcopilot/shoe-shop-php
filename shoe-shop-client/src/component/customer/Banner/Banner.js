import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useStyles } from "./styles";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Banner = () => {
  const classes = useStyles();
  return (
    <Carousel
      className={classes.banner}
      responsive={responsive}
      autoPlay={true}
      autoPlaySpeed={2000}
      infinite={true}
    >
      <Box className={`${classes.slide} ${classes.slide1}`}>
        <Typography component="h1" className={classes.heading}>
          Áo khoác
        </Typography>
        <Typography component="h3" className={classes.subHeading}>
          Chất lượng quan trọng
        </Typography>

        <Button className={classes.action}>Shop now</Button>
      </Box>
      <Box className={`${classes.slide} ${classes.slide2}`}>
        <Typography component="h1" className={classes.heading}>
          Tìm kiếm bộ đồ đẹp
        </Typography>
        <Typography component="h3" className={classes.subHeading}>
          Với 30% giảm giá
        </Typography>
        <Button className={classes.action}>Mua ngay</Button>
      </Box>
      <Box className={`${classes.slide} ${classes.slide3}`}>
        <Typography component="h1" className={classes.heading}>
          Giày đẹp
        </Typography>
        <Typography component="h3" className={classes.subHeading}>
          Thoải mái cho ngày dài
        </Typography>
        <Button className={classes.action}>Mua ngay</Button>
      </Box>
      <Box className={`${classes.slide} ${classes.slide4}`}>
        <Typography component="h1" className={classes.heading}>
          Mùa đông đã tới
        </Typography>
        <Typography component="h3" className={classes.subHeading}>
          Thư thả với mùa đông
        </Typography>
        <Button className={classes.action}>Mua ngay</Button>
      </Box>
    </Carousel>
  );
};

export default Banner;
