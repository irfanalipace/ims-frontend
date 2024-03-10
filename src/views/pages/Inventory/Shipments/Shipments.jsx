import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { TableContainer } from '../../../Components/Table/Table';
import { getShipmentsApiCall } from '../../../../core/api/shipments.js';
import {
	StatusColor,
	formatDate,
	formatDateToYYYYMMDD,
	generateBase64ImageSrc,
	generateEncryptedID,
	snakeCaseToPrettyText,
} from '../../../../core/utils/helpers';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover.jsx';
import deliveredIcon from '../../../../assets/icons/delivered.svg';
import outForDeliveryIcon from '../../../../assets/icons/out_for_delivery.svg';
import readyForDeliveryIcon from '../../../../assets/icons/ready_for_delivery.svg';
import DataTable from '../../../Components/DataTable/DataTable';
import FormField from '../../../Components/InputField/FormField.jsx';
import InputLabel from '../../../Components/InputLabel/InputLabel.jsx';
import notyf from '../../../Components/NotificationMessage/notyfInstance.js';
import DateRangeHeader from '../../../Components/DateRangeHeader/DateRangeHeader.jsx';
const searchFilter = [
	{ value: 'all', text: 'All' },
	{ value: 'ready_for_delivery', text: 'Ready for delivery' },
	{ value: 'out_for_delivery', text: 'Out for delivery' },
	{ value: 'delivered', text: 'Delivered' },
]
function Shipments() {
	const theme = useTheme();
	const navigate = useNavigate();
	const [refresh, setRefresh] = useState(0);

	// Search parameters for the API call
	const [searchPram, setSearchPram] = useState('');
	const [dateObj, setdateObj] = useState({
		start_date: '',
		end_date: '',
	});

	const [formValues, setFormValues] = useState({
		dateFrom: '',
		dateTo: '',
		selectedSearchFilter: 'all',
	});

	// Table columns configuration
	const Columns = [
		{
			//	accessorKey: 'shipment_date',
			accessorKey: 'created_at',
			header: 'Date',
			Cell: ({ cell }) => {
				const data = cell.getValue();
				const formatedDate = formatDate(data);
				return (
					<Box component='span' sx={{}}>
						{formatedDate}
					</Box>
				);
			},
		},
		// {
		// 	accessorKey: 'Work_order_number',
		// 	header: 'Work Order#',
		// 	Cell: ({ renderedCellValue }) => {
		// 		return <Typography variant='body2'>{renderedCellValue}</Typography>;
		// 	},
		// },
		// {
		// 	header: 'Invoice#',
		// 	accessorKey: 'invoice',
		// },

		{
			accessorKey: 'carrier_source',
			header: 'Carrier Source',
			Cell: ({ renderedCellValue }) => {
				return (
					<Typography variant='body2'>
						{snakeCaseToPrettyText(renderedCellValue)}
					</Typography>
				);
			},
		},

		{
			accessorKey: 'tracking_id',
			header: 'Tracking ID#',
		},
		{
			accessorKey: 'status',
			header: 'Status',
			Cell: ({ renderedCellValue }) => {
				return (
					<Box sx={{ color: StatusColor(renderedCellValue, theme) }}>
						{snakeCaseToPrettyText(renderedCellValue)}
					</Box>
				);
			},
		},
		{
			accessorKey: 'label',
			header: 'Label',
			Cell: ({ renderedCellValue }) => {
				return (
					<Box sx={{ color: StatusColor(renderedCellValue, theme) }}>
						{renderedCellValue === 'not_printed'
							? 'Not Printed'
							: snakeCaseToPrettyText(renderedCellValue)}
					</Box>
				);
			},
		},
		{
			header: 'Action ',
			Cell: ({ row }) => {
				const { status, id, label } = row.original;
				let icon = null;
				let hoverMessage = '';

				switch (status || label) {
					case 'not_printed' || 'ready_for_delivery':
						icon = (
							<img
								src={readyForDeliveryIcon}
								alt='Ready for Delivery'
								//		onClick={e => handleReadyForDeliveryClick(e, id)}
							/>
						);
						hoverMessage = 'Ship Now';
						break;
					case 'Out for delivery':
						icon = <img src={outForDeliveryIcon} alt='Out for Delivery' />;
						hoverMessage = 'Track Package';
						break;
					case 'Delivered':
						icon = <img src={deliveredIcon} alt='Delivered' />;
						hoverMessage = 'Package has been delivered';
						break;
					default:
						icon = null;
				}

				return (
					<Box sx={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
						{icon && (
							<HoverPopover
								text={hoverMessage}
								icon={icon}
								//	color='blue'
								fontSize='medium'
								//	backgroundColor='#8888'
							/>
						)}
					</Box>
				);
			},
		},
	];

	const handleReadyForDeliveryClick = (e, id) => {
		// e.preventDefault();
		// e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
		//	navigate(`/shipments/${generateEncryptedID(id)}`);
		if (e.original.label === 'not_printed') {
			navigate(`/shipments/${generateEncryptedID(e.original.id)}`);
		}
		else if(e.original.label === 'printed'){
			""
			// const link = document.createElement('a');
			// link.href = generateBase64ImageSrc(barCode); 
			// link.download = 'barCodeImage.png'; 
			// document.body.appendChild(link);
			// link.click();
			// document.body.removeChild(link);
		}
	};

	useEffect(() => {
		console.log('FormValues', formValues);

		try {
			// Set search parameters for the API call
			setSearchPram({
				search:
					formValues.selectedSearchFilter === 'all'
						? ''
						: formValues.selectedSearchFilter,
				filter: {
					start_date: dateObj?.start_date,
					end_date: dateObj?.end_date,
				},
			});
			setRefresh(prev => prev + 1);
		} catch (error) {
			if (error?.data?.errors && Object.keys(error?.data?.errors)?.length > 0)
				console.log(error?.data?.errors);
			else notyf.error(error.data);
		} finally {
			('empty');
		}
	}, [formValues, dateObj]);

	// Handle changes in form fields
	const handleFormFieldChange = (fieldName, value) => {
		setFormValues(prevValues => ({
			...prevValues,
			[fieldName]: value,
		}));
	};

	const callbackToGetDates = dates => {
		setdateObj({
			start_date: dates?.start_date,
			end_date: dates?.end_date,
		});
	};
	// console.log('dateObj', dateObj);
	return (
		<Grid container>
			<Grid item sm={12}>
				<HeaderPaper>
					<Grid
						container
						rowSpacing={1}
						columnSpacing={{ xs: 1, sm: 2, md: 3 }}
					>
						<Grid item xs={6}>
							<Typography variant='h6' className='TextCapitalize'>
								All Shipments
							</Typography>
						</Grid>
					</Grid>
				</HeaderPaper>

				<TableContainer>
					<Paper elevation={0}>
						<Grid container>
							<Grid item xs={9.5}>
								<DateRangeHeader setSearchPram={callbackToGetDates} />
							</Grid>
							<Grid
								item
								xs={2.5}
								sx={{
									display: 'flex',
									justifyContent: 'flex-end',
									marginTop: '50px',
								}}
							>
								<InputLabel sx={{ fontSize: '16px', margin: '10px' }}>
									Filter:
								</InputLabel>
								<FormField
									type='select'
									name='search_filter'
									size='small'
									sx={{ width: '200px' }}
									options={searchFilter}
									value={formValues.selectedSearchFilter}
									onChange={e =>
										handleFormFieldChange(
											'selectedSearchFilter',
											e.target.value
										)
									}
									label='Filter'
								/>
							</Grid>
						</Grid>

						{/* <Grid
							container
							spacing={2}
							style={{ padding: '1rem' }}
							justifyContent='space-between'
						>
							<Grid item xs={12} display='flex' alignItems='center'>
								<Typography variant='body1' fontWeight={500}>
									Date Range
								</Typography>
							</Grid>

							<Grid item xs={0.1} display='flex' alignItems='center'>
								<InputLabel>From</InputLabel>
							</Grid>
							<Grid item xs={2}>
								<FormField
									type='date'
									name='vendor_credit_date_from'
									size='small'
									value={formValues.dateFrom}
									onChange={e =>
										handleFormFieldChange('dateFrom', e.target.value)
									}
									inputProps={{
										min: formValues.dateTo,
									}}
									fullWidth
								/>
							</Grid>
							<Grid item xs={0.1} display='flex' alignItems='center'>
								<InputLabel>To</InputLabel>
							</Grid>
							<Grid item xs={2} mr={25}>
								<FormField
									type='date'
									name='vendor_credit_date_to'
									size='small'
									inputProps={{
										max: formValues.dateFrom,
									}}
									value={formValues.dateTo}
									onChange={e =>
										handleFormFieldChange('dateTo', e.target.value)
									}
									fullWidth
								/>
							</Grid>
							<Grid item xs={0.5} ml={25} display='flex' alignItems='center'>
								<InputLabel>Search</InputLabel>
							</Grid>
							<Grid item xs={2}>
								<FormField
									type='select'
									name='search_filter'
									size='small'
									options={searchFilter}
									value={formValues.selectedSearchFilter}
									fullWidth
									onChange={e =>
										handleFormFieldChange(
											'selectedSearchFilter',
											e.target.value
										)
									}
								/>
							</Grid>
						</Grid> */}

						<Grid item xs={12}>
							<DataTable
								api={getShipmentsApiCall}
								extraParams={searchPram}
								columns={Columns}
								setSelectedRows={() => {}}
								onRowClick={handleReadyForDeliveryClick}
								refresh={refresh}
							/>
						</Grid>
					</Paper>
				</TableContainer>
			</Grid>
		</Grid>
	);
}

export default Shipments;
