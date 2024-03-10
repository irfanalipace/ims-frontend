import { Grid, IconButton, Box, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function StockHeader() {
	const navigate = useNavigate();
	return (
		<Grid item container height={30}>
			<Grid item sm={6} display='flex' alignItems='center'>
				<Stack direction='row' display='flex' alignItems='center' spacing={0}>
					<Typography variant='h6' component='span'>
						Stock Out
					</Typography>
				</Stack>
			</Grid>
			<Grid item sm={6} display='flex' justifyContent='end' alignItems='center'>
				<Box>
					<IconButton onClick={() => navigate('/stock-out')}>
						<Close fontSize='small' />
					</IconButton>
				</Box>
			</Grid>
		</Grid>
	);
}
