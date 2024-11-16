import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useStyles } from "./styles";

const Footer = () => {
  const classes = useStyles();
  return (
    <footer className={classes.footer}>
      <Grid container>
        <Grid item lg={3} md={6} sm={12}>
          <List>
            <ListItem className={classes.list}>
              <Typography component="h3" className={classes.heading}>
                Danh mục
              </Typography>
              <ListItemText
                disableTypography
                primary="Nữ"
                className={classes.listLink}
              />
              <ListItemText
                disableTypography
                primary="Nam"
                className={classes.listLink}
              />
              <ListItemText
                disableTypography
                primary="Giày"
                className={classes.listLink}
              />
              <ListItemText
                disableTypography
                primary="Đồng hồ"
                className={classes.listLink}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item lg={3} md={6} sm={12}>
          <List>
            <ListItem className={classes.list}>
              <Typography component="h3" className={classes.heading}>
                Trợ giú giúp
              </Typography>
              <ListItemText
                disableTypography
                primary="Theo dõi đơn hàng"
                className={classes.listLink}
              />
              <ListItemText
                disableTypography
                primary="Trả hàng"
                className={classes.listLink}
              />
              <ListItemText
                disableTypography
                primary="Giao hàng"
                className={classes.listLink}
              />
              <ListItemText
                disableTypography
                primary="FAQs"
                className={classes.listLink}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item lg={4} md={6} sm={12}>
          <List>
            <ListItem className={classes.list}>
              <Typography component="h3" className={classes.heading}>
                Liên hệ
              </Typography>
              <ListItemText
                disableTypography
                primary="Bất kỳ câu hỏi nào? Hãy liên hệ với chúng tôi tại 48 Cao Thắng, Đà Nẵng hoặc gọi điện tại (+84) 905 123 456"
                className={classes.listLink}
                style={{ lineHeight: 1.5 }}
              />
              {/* <ListItemAvatar className={classes.listImg}>
								<Avatar
									className={classes.img}
									alt={`Avatar`}
									src={`${imgPayment4}`}
								/>
								<Avatar
									className={classes.img}
									alt={`Avatar`}
									src={`${imgPayment3}`}
								/>
								<Avatar
									className={classes.img}
									alt={`Avatar`}
									src={`${imgPayment1}`}
								/>
								<Avatar
									className={classes.img}
									alt={`Avatar`}
									src={`${imgPayment2}`}
								/>
							</ListItemAvatar> */}
            </ListItem>
          </List>
        </Grid>
        <Grid item lg={2} md={6} sm={12}>
          <List>
            <ListItem className={classes.list}>
              <Typography component="h3" className={classes.heading}>
                Đăng ký nhận tin
              </Typography>
              <TextField
                placeholder="email@gmail.com"
                className={classes.email}
                InputProps={{
                  classes: {
                    input: classes.email,
                  },
                }}
              />
              <Button className={classes.action}>Subcribe</Button>
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </footer>
  );
};

export default Footer;
