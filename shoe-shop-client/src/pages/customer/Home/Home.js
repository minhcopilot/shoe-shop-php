import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../redux/slices/authSlice';
import Banner from '../../../component/customer/Banner/Banner';
import Category from '../../../component/customer/Category/Category';
import CustomerLayout from '../../../component/customer/CustomerLayout/CustomerLayout';
import LastestProducts from '../../../component/customer/LatestProducts/LatestProducts';

const Home = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);

    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const user = params.get('user'); // Lấy user từ URL

    if (token) {
      // Lưu token vào localStorage
      localStorage.setItem('token', token);

      if (user) {
        // Giải mã user từ URL nếu có
        const parsedUser = JSON.parse(decodeURIComponent(user));

        // Dispatch action để lưu user vào store
        dispatch(setUser(parsedUser));

        // Lưu user vào localStorage
        // localStorage.setItem('user', JSON.stringify(parsedUser));
      }

      // Xóa token khỏi URL để giữ giao diện sạch sẽ
      history.replace('/');
    }
  }, [location, history, dispatch]);

  return (
    <>
      <Helmet>
        <title>Reno - Home</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <CustomerLayout>
        <Banner />
        <Category />
        <LastestProducts />
      </CustomerLayout>
    </>
  );
};

export default Home;
