import React from 'react'
import GridRow from '../../../../Components/GridRow/GridRow';
import { Grid, Typography,  Box} from '@mui/material';
import FormField from '../../../../Components/InputField/FormField';

const NoteDetails = () => {
  return (
    <div>
      	<Box label='Notes' py={4}>
									<GridRow>
										<Grid item xs={2}>
											<Typography variant='body2'>
												Notes (for internal Use)
											</Typography>
										</Grid>
										<Grid item xs={4}>
											<FormField
												id='remarks'
											
												label={'Notes'}
												fullWidth
												type={'textarea'}
												characterCount={'500'}
											/>
										</Grid>
									</GridRow>
								</Box>
    </div>
  )
}

export default NoteDetails
