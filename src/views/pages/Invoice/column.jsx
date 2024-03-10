import {
	AmountCell,
	CustomerCard,
	DateCell,
	InvoiceNumberCell,
} from '../../Components/common';
import {
	StatusColor,
	snakeCaseToPrettyText,
} from '../../../core/utils/helpers';
import { Box } from '@mui/system';

import { theme } from '../../../core/theme/theme';
import { Typography } from '@mui/material';

export const minnesotaCollapsedColumns = [
	{
		accessorKey: 'ss',
		header: 'Company Name',
		Cell: ({ row }) => <CustomerCard data={row.original} />,
	},
];

export const minnesotaColumns = [
	{
		accessorKey: 'invoice_date',
		header: 'Date',
		Cell: ({ renderedCellValue }) => <DateCell>{renderedCellValue}</DateCell>,
	},
	{
		accessorKey: 'invoice_number',
		header: 'Invoices',
		Cell: ({ renderedCellValue }) => (
			<InvoiceNumberCell>{renderedCellValue}</InvoiceNumberCell>
		),
	},
	//column definitions...
	{
		accessorKey: 'order_number',
		header: 'Order Number',
		Cell: ({ row, renderedCellValue }) => {
			let jsonObject;

			try {
				console.log(renderedCellValue);
				jsonObject = JSON.parse(row?.original?.detail);
			} catch (error) {
				console.log(error);
			}
			return (
				<Typography variant='body2'>
					{jsonObject?.order_number || renderedCellValue}
				</Typography>
			);
		},
	},
	{
		accessorKey: 'customer.first_name',
		header: 'Customer Name',
	},
	{
		accessorKey: 'status',
		header: 'Invoice Status',
		Cell: ({ cell }) => {
			const status = cell.getValue();
			const estStatusColor = StatusColor(status, theme);

			return (
				<Box
					component='span'
					sx={{
						color: estStatusColor,
						borderRadius: '0.25rem',
						textTransform: 'capitalize',
					}}
				>
					{snakeCaseToPrettyText(status)}
				</Box>
			);
		},
	},
	{
		accessorKey: 'due_date',
		header: 'Due Date',
		Cell: ({ renderedCellValue }) => <DateCell>{renderedCellValue}</DateCell>,
	},
	{
		accessorKey: 'total',
		header: 'Invoices Amount',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},

	{
		accessorKey: 'adjustment',
		header: 'Adjustment',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},

	{
		accessorKey: 'email',
		header: 'Email',
	},

	{
		accessorKey: 'phone',
		header: 'Phone',
	},

	{
		accessorKey: 'sales_person',
		header: 'Sales Person',
		Cell: ({ row, renderedCellValue }) => {
			let jsonObject;

			try {
				// console.log();
				jsonObject = JSON.parse(row?.original?.detail);
			} catch (error) {
				console.log(error);
			}
			return (
				<Typography variant='body2'>
					{jsonObject?.sales_person?.label || renderedCellValue.name}
				</Typography>
			);
		},
	},
	{
		accessorKey: 'shipping_charges',
		header: 'Shiping Charges',
		Cell: ({ renderedCellValue }) => (
			<AmountCell>{renderedCellValue}</AmountCell>
		),
	},
	{
		accessorKey: 'sub_total',
		header: 'Sub Total',
		Cell: ({ row }) => <AmountCell>{row?.original?.sub_total}</AmountCell>,
	},
];
