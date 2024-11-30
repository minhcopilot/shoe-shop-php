import { css } from '@emotion/react'
import { Box, Button, Divider, Typography } from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import { unwrapResult } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { useParams } from 'react-router-dom'
import RingLoader from 'react-spinners/RingLoader'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { updateUser } from '../../../redux/slices/authSlice'
import { getProduct } from '../../../redux/slices/productSlice'
import CustomerLayout from '../CustomerLayout/CustomerLayout'
import { useStyles } from './styles'

const override = css`
	display: block;
	margin: 0 auto;
`

const ProductDetail = () => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const { id } = useParams()
	const user = useSelector((state) => state.auth.user)
	const product = useSelector((state) => state.product.products)
	const productLoading = useSelector((state) => state.product.productLoading)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	console.log('pr', product)
	
	useEffect(() => {
		const fetchProduct = async () => {
		  try {
			const action = getProduct(id);
			await dispatch(action).unwrap();
		  } catch (error) {
			console.error('Error fetching product:', error);
		  }
		};
		fetchProduct();
	  }, [id, dispatch]);
	  useEffect(() => {
		console.log('Fetched product:', product); // In ra dữ liệu product khi nhận được
	  }, [product]);
	const [quantity, setQuantity] = useState(1)
	const handleIncreaseQuantity = () => {
		if (!product?.data?.stock) return;
		if (quantity > product.data.quantity) return
		else setQuantity(quantity + 1)
	}

	const handleDecreaseQuantity = () => {
		if (!product.data.stock) return

		if (quantity <= 1) return
		else setQuantity(quantity - 1)
	}

	const [indexSize, setIndexSize] = useState()
	const [size, setSize] = useState()
	const handleChangeSize = (index, size) => {
		if (!product.data.stock) return
		setIndexSize(index)
		setSize({ id: size.id, name: size.name });
	}

	const handleAddToCart = () => {
		// Sold out
		if (!product.data.stock) return

		// Empty size
		if (indexSize === undefined) {
			toast('Please choose your size', {
				position: 'bottom-center',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				type: 'error',
			})
			return
		}

		// Unauthenticated
		if (!user || Object.keys(user).length === 0) {
			toast('Please login to continue', {
				position: 'bottom-center',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				type: 'error',
			})
			return
		}

		const existedProduct = user?.cart.find((productInCart) => {
			return (
				productInCart.product.id === product.data.id &&
				productInCart.chooseSize.id === size.data.id
			)
		})

		if (existedProduct) {
			const newProduct = {
				...existedProduct,
				quantity: existedProduct.quantity + quantity,
			}

			const newProducts = user.cart.filter((product) => {
				console.log(size?.id, product?.chooseSize?.id)
				return (
					product.product.id !== existedProduct.product.id ||
					(product?.product?.id === existedProduct?.product?.id &&
						product?.chooseSize?.id !== size?.id)
				)
			})

			const action = updateUser({
				id: user.id,
				cart: [...newProducts, newProduct],
			})
			dispatch(action)
				.then(unwrapResult)
				.then((res) => {
					toast('Add to cart successfully!', {
						position: 'bottom-center',
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						type: 'success',
					})
				})
				.catch((error) => console.log(error))
		} else {
			const productData = { product, quantity, chooseSize: size }
			const action = updateUser({
				id: user?.id,
				cart: [...user?.cart, productData],
			})
			dispatch(action)
				.then(unwrapResult)
				.then((res) => {
					toast('Add to cart successfully!', {
						position: 'bottom-center',
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						type: 'success',
					})
				})
				.catch((error) => console.log(error))
		}
	}
	return (
		<>
			<Helmet>
				<title>Reno - Product</title>
				<meta name="description" content="Helmet application" />
			</Helmet>
			
			<CustomerLayout>
				<Box className={classes.detail}>
					<>
					
						{!productLoading ? (
							
							<>
								<Box className={classes.imgContainer}>
									<Carousel
										showIndicators={false}
										showArrows={false}
										showStatus={false}
									>
										{product.data ? (
											product.data.map((images) => (
												<Box key={images.id} style={{ position: 'relative' }}>
												<img src={images.preview} alt="product" />
												{!product.data.stock && (
													<Typography component="p" className={classes.watermark}>
													Sold out
													</Typography>
												)}
												</Box>
											))
											) : (
											<Typography>No images available</Typography>
											)}
									</Carousel>
								</Box>
								<Box className={classes.content}>
									<Typography component="h3" className={classes.heading}>
										
										{product.data.name}
									</Typography>
									<Typography component="subtitle1" className={classes.price}>
										{new Intl.NumberFormat('vi-VN').format(product.data.price)} VND
									</Typography>
									<Rating
										readOnly
										size="small"
										name="size-medium"
										defaultValue={2}
									/>
									<Divider style={{ margin: '20px 0' }} />
									<Typography component="p" className={classes.desc}>
										{product.data.description}
									</Typography>
									<Box className={classes.sizeContainer}>
										<Typography component="p" style={{ marginRight: 20 }}>
											Size
										</Typography>
										{product?.data?.size?.map((size, index) => (
											<Box
												className={`${
													product.data.stock ? classes.size : classes.sizeDisabled
												}
												${indexSize === index && classes.activeSize}
												`}
												onClick={() => handleChangeSize(index, size)}
											>
												{size.name}
											</Box>
										))}
									</Box>
									<Box className={classes.actions}>
										<Typography component="p" style={{ marginRight: 20 }}>
											Quantity
										</Typography>
										<Box className={classes.quantity}>
											<BiMinus
												style={{ cursor: 'pointer' }}
												onClick={handleDecreaseQuantity}
											/>
											<Typography
												component="p"
												style={{
													userSelect: 'none',
												}}
											>
												{quantity}
											</Typography>
											<BiPlus
												style={{ cursor: 'pointer' }}
												onClick={handleIncreaseQuantity}
											/>
										</Box>
										<Button
										disableRipple={!product?.data?.stock}
										className={product?.data?.stock ? classes.add : classes.addDisabled}
										onClick={handleAddToCart}
										disabled={!product?.data?.stock}
										>
										Add to Cart
										</Button>
									</Box>
								</Box>
							</>
						) : (
							<Box className={classes.loadingContainer}>
								<RingLoader css={override} size={140} />
							</Box>
						)}
					</>
				</Box>
				<ToastContainer
					position="bottom-center"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="dark"
					type="default"
				/>
			</CustomerLayout>
		</>
	)
}

export default ProductDetail
