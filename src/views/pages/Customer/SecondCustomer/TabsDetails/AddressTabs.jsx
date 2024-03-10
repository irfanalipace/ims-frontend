import React from 'react';
import GridRow from '../../../../Components/GridRow/GridRow';
import { Button, Divider, Grid, Typography } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import FormField from '../../../../Components/InputField/FormField';

function AddressTabs() {
	


	return (
		<>
			<GridRow>
				<Grid item xs={4}>
					<Typography variant='body1' mb={3}>
						Billing Address
					</Typography>

					{/* attention  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Name</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								placeholder='Name'
								id='customer_billing_address.attention'
								label={'Name'}
							
							/>
						</Grid>
					</GridRow>
					{/* Country  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Country</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.country_id'
							
								label={'Country'}
								type={'select'}
							
							/>
						</Grid>
					</GridRow>
					{/* Address1  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Address</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.address'
					
								label={'Street 1'}
								type={'textarea'}
								fullWidth
								required
							/>
						</Grid>
					</GridRow>
					{/* Address2  */}
					<GridRow>
						<Grid item xs={4}></Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.address2'
							
								label={'Street 2 (Optional)'}
								fullWidth
								type={'textarea'}
							/>
						</Grid>
					</GridRow>
					{/* City  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>City</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.city'
					
								label={'City'}
								required
							/>
						</Grid>
					</GridRow>
					{/* State  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>State</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.state_id'
							
								label={'State'}
								fullWidth
								required
								type={'select'}
							
							/>
						</Grid>
					</GridRow>
					{/* Zipcode  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Zip Code</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.zipcode'
								
								label={'Zip Code'}
								required
							/>
						</Grid>
					</GridRow>
					{/* Phone  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Phone</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.phone'
				
								label={'Phone'}
								// required
							/>
						</Grid>
					</GridRow>
					{/* Fax  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Fax</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_billing_address.fax'
							
								label={'Fax (Optional)'}
							/>
						</Grid>
					</GridRow>
				</Grid>
				<Grid item xs={4} ml={10}>
					<GridRow>
						<Grid item xs={12}>
							<Typography variant='body1'>
								Shipping Address (
								<Button
									sx={{ textTransform: 'none' }}
							
								>
									<ContentCopy
										sx={{
											fontSize: '14px',
											marginRight: '5px',
											lineHeight: '1.5px',
										}}
									/>
									Copy Billing Fields
								</Button>
								)
							</Typography>
						</Grid>
					</GridRow>

					{/* attention  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Name</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.attention'
								label={'Name'}
							
								fullWidth
								required
							/>
						</Grid>
					</GridRow>
					{/* Country  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Country</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.country_id'
							
								label={'Country'}
								fullWidth
								required
								type={'select'}
							
							/>
						</Grid>
					</GridRow>
					{/* Address1  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Address</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.address'
							
								label={'Street 1'}
								fullWidth
								required
								type={'textarea'}
							/>
						</Grid>
					</GridRow>
					{/* Address2  */}
					<GridRow>
						<Grid item xs={4}></Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.address2'
						
								label={'Street 2 (Optional)'}
								fullWidth
								type={'textarea'}
							/>
						</Grid>
					</GridRow>
					{/* City  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>City</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.city'
							
								label={'City'}
								required
							/>
						</Grid>
					</GridRow>
					{/* State  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>State</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.state_id'
						
								label={'State'}
								fullWidth
								required
								type={'select'}
							
							/>
						</Grid>
					</GridRow>
					{/* Zipcode  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Zip Code</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.zipcode'
					
								label={'Zip Code'}
								required
							/>
						</Grid>
					</GridRow>
					{/* Phone  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Phone</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.phone'
							
								label={'Phone'}
								// required
							/>
						</Grid>
					</GridRow>
					{/* Fax  */}
					<GridRow>
						<Grid item xs={4}>
							<Typography variant='body2'>Fax</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormField
								id='customer_shipping_address.fax'
						
								label={'Fax (Optional)'}
							/>
						</Grid>
					</GridRow>
				</Grid>
			</GridRow>

			<GridRow>
				<Grid item xs={8.6}>
					<Divider />
				</Grid>
				<Grid item xs={2}></Grid>
			</GridRow>
			<Typography variant='body2'>Note:</Typography>
			<Typography variant='body2'>
				<Typography component={'span'} style={{ fontSize: '40px' }}>
					.
				</Typography>
				You can add and manage additional addresses from contact details
				section.
			</Typography>
			<Typography variant='body2'>
				<Typography component={'span'} style={{ fontSize: '40px' }}>
					.
				</Typography>
				View and edit the address format of your transactions under Settings
				&gt; Preferences &gt; Customers and Vendors.
			</Typography>
		</>
	);
}

// export default AddressTab
export default React.memo(AddressTabs);
