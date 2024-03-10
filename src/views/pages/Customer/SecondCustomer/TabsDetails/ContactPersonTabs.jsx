/* eslint-disable no-unsafe-optional-chaining */
import GridRow from '../../../../Components/GridRow/GridRow';
import { Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import FormField from '../../../../Components/InputField/FormField';
import { Add, Delete } from '@mui/icons-material';
import { Box } from '@mui/system';

function ContactPersonTabs() {

	return (
		<Box>
			<GridRow style={{ marginTop: '20px' }}>
				<Grid item xs={1.4}>
					<Typography variant='subtitle2'>Salutation</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>First Name</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Last Name</Typography>
				</Grid>
				<Grid item xs={1.5}>
					<Typography variant='subtitle2'>Email Address</Typography>
				</Grid>
				<Grid item xs={1.1}>
					<Typography variant='subtitle2'>Primary Contact</Typography>
				</Grid>
				<Grid item xs={1.1}>
					<Typography variant='subtitle2'>Secondary Contact</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Skype</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Designation</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Department</Typography>
				</Grid>
				<Grid item xs={1}>
					<Typography variant='subtitle2'>Action</Typography>
				</Grid>
			</GridRow>
			<Divider style={{ width: '80%', marginBottom: '20px' }} />
		
				<GridRow >
					<Grid item xs={1.4}>
						<FormField
							id={""}
						
							size={'small'}
							type={'select'}
							label={'salutation'}
						
							fullWidth
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
						
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={""}
						
							isTouched={true}
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1.5}>
						<FormField
				
						
							size={'small'}
						
						/>
					</Grid>
					<Grid item xs={1.1}>
						<FormField
							id={""}
						
						/>
					</Grid>
					<Grid item xs={1.1}>
						<FormField
							id={""}
						
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
						
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={""}
						
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<FormField
							id={""}
					
							size={'small'}
						/>
					</Grid>
					<Grid item xs={1}>
						<IconButton
							color='primary'
							
							// sx={{ mt: 2 }}
						>
							<Delete />
						</IconButton>
					</Grid>
				</GridRow>
	
			<Button sx={{ mt: 1, mb: 10 }} startIcon={<Add />} >
				Add More Rows
			</Button>
		</Box>
	);
}

export default ContactPersonTabs;
