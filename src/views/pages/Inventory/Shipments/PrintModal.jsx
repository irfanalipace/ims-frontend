import { useState } from 'react';
import { Grid, CircularProgress, Stack } from '@mui/material';
import Modal from '../../../Components/Modal/Dialog';
import MUIButton from '../../../Components/Button/MUIButton';
import Close from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { generateBase64ImageSrc } from '../../../../core/utils/helpers';

// Utility function to generate base64 image source


const PrintModal = ({ open, onClose, onSubmit, barCode }) => {
	const [loading, setLoading] = useState(false);

	const handleCancel = () => {
		onClose();
	};

	const handleDownload = () => {
		const link = document.createElement('a');
		link.href = generateBase64ImageSrc(barCode); 
		link.download = 'barCodeImage.png'; 
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handlePrint = async () => {
		try {
			setLoading(true);
			await onSubmit();

		} catch (error) {
			console.error('Error during form submission:', error);
		}
	};

	return (
		<Modal size={'sm'} open={open} onClose={handleCancel}>
			<img
				src={generateBase64ImageSrc(barCode)}
				alt='barCode'
				style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
			/>
			<Grid
				container
				justifyContent='flex-end'
				sx={{
					position: 'sticky',
					bottom: 0,
					zIndex: 1,
					backgroundColor: 'rgba(255, 255, 255, 0.8)',
					padding: '1.2rem',
				}}
			>
				<Stack direction='row' spacing={2}>
					<MUIButton
						startIcon={<DownloadIcon />}
						disabled={loading}
						onClick={handleDownload}
					>
						{loading ? <CircularProgress size={20} /> : 'Download'}
					</MUIButton>
					<MUIButton
						startIcon={<PrintIcon />}
						disabled={loading}
						onClick={handlePrint}
					>
						{loading ? <CircularProgress size={20} /> : 'Print'}
					</MUIButton>
					<MUIButton
						startIcon={<Close />}
						variant='outlined'
						onClick={handleCancel}
					>
						Cancel
					</MUIButton>
				</Stack>
			</Grid>
		</Modal>
	);
};

export default PrintModal;
