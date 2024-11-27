import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Skeleton } from "@material-ui/lab";
const useStyles = makeStyles((theme) => ({
  chatItem: {
    padding: theme.spacing(1, 2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  content: {
    flex: 1,
  },
}));

const ChatListSkeleton = () => {
  const classes = useStyles();

  return (
    <Box className={classes.chatItem}>
      <Skeleton variant="circular" width={40} height={40} />
      <Box className={classes.content}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="40%" height={20} />
      </Box>
      <Skeleton variant="text" width={40} height={20} />
    </Box>
  );
};

export default ChatListSkeleton;
