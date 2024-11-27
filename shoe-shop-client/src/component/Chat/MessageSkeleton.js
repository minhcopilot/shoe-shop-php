import React from "react";
import { Box, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  messageWrapper: {
    display: "flex",
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  messageSkeleton: {
    maxWidth: "60%",
    borderRadius: 20,
  },
}));

const MessageSkeleton = ({ align = "left" }) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.messageWrapper}
      style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
    >
      <Skeleton
        variant="rectangular"
        className={classes.messageSkeleton}
        width={Math.random() * (60 - 30) + 30 + "%"}
        height={36}
        style={{ borderRadius: 20 }}
      />
    </Box>
  );
};

export default MessageSkeleton;
