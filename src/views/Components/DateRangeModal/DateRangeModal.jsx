import { Button, Grid, Typography } from '@mui/material';
import Modal from '../Modal/Dialog';
import FormField from '../InputField/FormField';
import GridRow from '../GridRow/GridRow';
import { Remove } from '@mui/icons-material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { formatDateToYYYYMMDD } from '../../../core/utils/helpers';
function DateRangeModal({ openModal, setModal, onSave, onClose, inputType }) {
	const formik = useFormik({
		initialValues: {
			startDate: '',
			endDate: '',
		},
		validationSchema: Yup.object({
			startDate: Yup.date().required('Start date is required'),
			endDate: Yup.date()
				.required('End date is required')
				.when('startDate', (startDate, schema) => {
					return startDate
						? schema.min(startDate, 'End date must be after start date')
						: schema;
				}),
		}),
		onSubmit: values => {
			onSave(values.startDate, values.endDate);
			onClose();
		},
	});

	return (
		<>
			<Modal
				title='Date Range Modal'
				open={openModal}
				onClose={e => {
					e.stopPropagation();
					onClose();
					setModal(false);
				}}
			>
				<form onSubmit={formik.handleSubmit} style={{ padding: '10px' }}>
					<FormField
						id='startDate'
						type={inputType ? inputType : 'date'}
						sx={{ width: '47%' }}
						value={formik.startDate}
						handleChange={formik.handleChange}
						required
						error={formik.errors.startDate}
						inputProps={{
							// max: formValues.dateTo,
							max: formatDateToYYYYMMDD(new Date()),
						}}
					/>
					<Remove sx={{ marginTop: '10px' }} />
					<FormField
						id='endDate'
						type={inputType ? inputType : 'date'}
						sx={{ width: '47%' }}
						value={formik.endDate}
						handleChange={formik.handleChange}
						required
						onBlur={formik.handleBlur}
						isTouched={formik.touched.endDate}
						error={formik.errors.endDate}
						inputProps={{
							min: formik.values.startDate,
							max: formatDateToYYYYMMDD(new Date()),
						}}
					/>
					<Typography
						component={'p'}
						variant='caption'
						sx={{ margin: '20px 0' }}
					></Typography>

					<GridRow>
						<Grid item xs={6}>
							<Button
								variant='contained'
								size='small'
								type='submit'
								// onClick={handleSaveClick}
							>
								Save
							</Button>
							<Button
								variant='outlined'
								sx={{ marginLeft: '5px' }}
								size='small'
								onClick={e => {
									e.stopPropagation();
									onClose();
									setModal(false);
								}}
							>
								Cancel
							</Button>
						</Grid>
						{/* <Grid item xs={6} sx={{ textAlign: 'right' }}>
							<Button
								sx={{
									fontSize: '11px',
									textTransform: 'capitalize',
									color: window.themeColors.primary,
								}}
								onClick={() => {
									formik.resetForm();
									formik.setFieldValue('startDate', '');
									formik.setFieldValue('endDate', '');
								}}
							>
								Clear Selection
							</Button>
						</Grid> */}
					</GridRow>
				</form>
			</Modal>
		</>
	);
}

export default DateRangeModal;
