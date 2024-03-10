import { Paper, Typography, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import TabsBar from './TabsBar/TabsBar';
import { useSelector } from 'react-redux';
export default function Home() {
	const userData = useSelector(state => state.auth.user);

	return (
		<Box>
			<Paper sx={{ padding: '1.2rem', marginTop: '0px', marginBottom: '12px' }}>
				<Stack spacing={2} direction='row'>
					<AccountBoxIcon sx={{ height: '40px', width: '2em' }} />
					<Typography>
						Hello, {userData?.name}
						<Typography sx={{ fontSize: '12px' }}>
							Minnesota Computer
						</Typography>
					</Typography>
				</Stack>
			</Paper>

			<Box>
				<Stack>
					<TabsBar />
				</Stack>
			</Box>
		</Box>
	);
}
