import React from 'react'
import {
	Button,
	FormControlLabel,
	Grid,
	IconButton,
	Paper,
	Radio,
	Typography,
	CircularProgress,
} from '@mui/material';
import FormField from '../../../../Components/InputField/FormField';
import { Box } from '@mui/system';
import HeaderPaper from '../../../../Components/Containers/HeaderPaper';
import ContainerPaper from '../../../../Components/Containers/ContainerPaper';
import HoverPopover from '../../../../Components/HoverPopover/ErrorOutlinePopover';
import GridRow from '../../../../Components/GridRow/GridRow';
import { AccountCircle } from '@mui/icons-material';
const OtherDetails = () => {
  return (
    <div>
						<Box mb={5} sx={{ minHeight: '80vh' }}>
							<Box aria-label='customer-details' className='toTop'>
								{/* customer Type  */}
								<GridRow style={{ alignItems: 'center' }}>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Tax Perfernce
											<HoverPopover text='The contact which are associated to any account in CRM is of type Business and the other contacts will be of type individuals' />
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<div>
											<FormControlLabel
												id='customerTypeBusiness'
												control={<Radio />}
												label={'Taxable'}
											
											
											/>
											<FormControlLabel
												id='customerTypeIndividual'
												control={<Radio />}
												label={'Tax Exempt'}
											
											/>
										</div>
									</Grid>
								</GridRow>
								{/* Names  */}
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Tax Rate{' '}
											<span style={{ color: 'red' }}>
												*
												<HoverPopover text='tax customer.' />
											</span>
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='display_name'
											
											label={'Tax Select'}
											fullWidth
											type={'select'}
										
										/>
									</Grid>
								</GridRow>
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Currency{' '}
											<span style={{ color: 'red' }}>
												*
												<HoverPopover text='currency.' />
											</span>
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='display_name'
											
											label={'Currency'}
											fullWidth
											type={'select'}
										
										/>
									</Grid>
								</GridRow>
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>Opening Balance</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='opening-balance'
											
											label={'Opening Balance'}
										
										/>
									</Grid>
								</GridRow>
							
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Mode of Payment{' '}
											<span style={{ color: 'red' }}>
												*
												<HoverPopover text='mode of payment.' />
											</span>
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='display_name'
											
											label={'Mode of Payment'}
											fullWidth
											type={'select'}
										
										/>
									</Grid>
								</GridRow>
								<GridRow>
									<Grid item xs={2}>
										<Typography variant='body2'>
											Payment Term{' '}
											<span style={{ color: 'red' }}>
												*
												<HoverPopover text='payment term.' />
											</span>
										</Typography>
									</Grid>
									<Grid item xs={4}>
										<FormField
											id='display_name'
											
											label={'Payment Term'}
											fullWidth
											type={'select'}
										
										/>
									</Grid>
								</GridRow>

								<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Website</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='website'
					
						label={'https://www.example.com'}
					/>
				</Grid>
			</GridRow>
			{/* Department  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Department</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='department'
					
						label={'Departments'}
						type={'select'}
						fullWidth
					
					/>
				</Grid>
			</GridRow>
			{/* Designation  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Designation</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='designation'
						
						label={'Designation'}
					/>
				</Grid>
			</GridRow>

			{/* Facebook  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Facebook</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='facebook_link'
					
						label={'facebook.com'}
						icon={<AccountCircle />}
					/>
					<Typography variant='caption'>https://facebook.com/</Typography>
				</Grid>
			</GridRow>
			{/* Skype  */}
			<GridRow>
				<Grid item xs={2}>
					<Typography variant='body2'>Skype</Typography>
				</Grid>
				<Grid item xs={4}>
					<FormField
						id='skype_name'
					
						label={'skype.com'}
						icon={<AccountCircle />}
					/>
				</Grid>
			</GridRow>
							</Box>
							
						</Box>
				
    </div>
  )
}

export default OtherDetails
