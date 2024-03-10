import { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
// import { getInvoiceDetailsApi, updateInvoiceApi } from '@/apis/invoice';
// import MinnesotaPDF from '@/Components/ViewInvoice/PDF';
// import MinnesotaHeader from '@/Components/ViewInvoice/Header';
// import PaymentReceived from '@/Components/ViewInvoice/PaymentReceived';
// import notyf from '@/Components/NotificationMessage/notyfInstance';
// import { OriginValue } from '@/config/enum';
// import MinnesotaSubHeader from '@/Components/ViewInvoice/SubHeader';
import OverlayLoader from '../../../Components/OverlayLoader/OverlayLoader';
import ViewTemplate from '../../../Components/ViewTemplate/ViewTemplates';
import {
	getInvoiceDetailsApi,
	updateInvoiceApi,
} from '../../../../core/api/Invoice';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { formatDate, toFixed } from '../../../../core/utils/helpers';
import PaymentReceived from '../../../Components/PaymentReceived';
import SubHeader from './SubHeader';
import Header from './Header';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';

const columns = [
	{ id: '', label: 'No.', key: 'index' },
	{ id: '', label: 'Items Description', key: 'item_name' },
	{ id: '', label: 'Qty', key: 'quantity' },
	{ id: '', label: 'Rate(USD)', key: 'rate' },
	{ id: '', label: 'Amount(USD)', key: 'total' },
];

const ViewInvoice = ({ id }) => {
	const navigate = useNavigate();

	const [invoiceFiles, setInvoiceFiles] = useState([]);
	const [invoiceData, setInvoiceData] = useState();
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(false);

	// single estimate / show estimate / view
	useEffect(() => {
		fetchingSingleInvoice();
	}, [id]);

	const fetchingSingleInvoice = async () => {
		setLoading(true);
		try {
			const resp = await getInvoiceDetailsApi(id);
			console.log('singel invoice details', resp);
			// This is static email should replace it with real email that we will be reciveing from rti json
			// resp.data.customer_email = 'umar.zahir@99technologies.co';

			if (resp.data?.detail !== null) {
				resp.data.detail = JSON.parse(resp.data.detail);
			}

			setInvoiceData(resp?.data);

			setInvoiceFiles(resp?.data?.invoice_files);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleNewInvoice = () => {
		navigate(`/invoices/edit/${id}`);
	};

	const [draftLoading, setDraftLoading] = useState(false);
	const [sendLoading, setSendLoading] = useState(false);

	const [headers, setHeaders] = useState([]);
	const [calculationInfo, setCalculationInfo] = useState([]);

	const invoiceCalculationsInfo = [
		{
			label: 'Paid Amount',
			value: invoiceData?.paid_amount,
		},
		{
			label: 'Due Amount',
			value: invoiceData?.due_amount,
		},
	];

	useEffect(() => {
		const head = [
			{ label: 'Invoice Number:', value: invoiceData?.invoice_number },
			{
				label: 'Invoice Date:',
				value: formatDate(invoiceData?.invoice_date),
			},

			{ label: 'Terms:', value: invoiceData?.term },
			{
				label: 'Payment Mode:',
				value:
					invoiceData?.detail?.mode_of_payment?.label ||
					invoiceData?.mode_of_payment,
			},
			{ label: 'Delivery Terms:', value: 'Fedex' },
		];

		if (invoiceData?.detail?.order_number || invoiceData?.order_number) {
			head.splice(2, 0, {
				label: 'PO.Reference:',
				value: invoiceData?.detail?.order_number || invoiceData?.order_number,
			});
		}

		const calc = [
			{ label: 'Subtotal:', value: `$${invoiceData?.sub_total || '0.00'}` },
			{
				key: 'discount',
				label: 'Discount:',
				value: `$${invoiceData?.discount_value?.toFixed(2)}`,
				labelValue: invoiceData?.detail?.discount,
				type: invoiceData?.discount_key,
			},

			{
				label: 'Tax:',
				value: `$${toFixed(invoiceData?.tax_amount)}`,
				hidden: !parseFloat(invoiceData?.tax_amount),
			},
			{
				label: 'Adjustment:',
				value: `$${invoiceData?.detail?.adjustment || invoiceData?.adjustment}`,
				hidden:
					!parseFloat(invoiceData?.detail?.adjustment) &&
					!parseFloat(invoiceData?.adjustment),
			},
			{
				label: 'Shipping Charges:',
				value: `$${invoiceData?.shipping_charges}`,
			},
			{
				label: 'Total:',
				value: `$${invoiceData?.total || '0.00'}`,
				primary: true,
			},
			{ label: 'Paid Amount:', value: `$${invoiceData?.paid_amount}` },
			{ label: 'Due Amount:', value: `$${invoiceData?.due_amount}` },
		];

		setCalculationInfo(calc);
		setHeaders(head);
	}, [invoiceData?.id]);

	return (
		<Box
			sx={{
				position: 'relative',
				padding: '0 0.5rem',
				width: '100%',
			}}
		>
			<OverlayLoader open={loading} />
			<HeaderPaper>
				<Header invoiceFiles={invoiceFiles} setInvoiceFiles={setInvoiceFiles} />
			</HeaderPaper>
			<SubHeader id={id} status={invoiceData?.status} />
			<ContainerPaper>
				<Box mb={3}>
					<PaymentReceived
						title='Payments Paid'
						payment_receiveds={invoiceData?.payment_receiveds}
					/>
				</Box>
				<ViewTemplate
					title='INVOICE'
					data={invoiceData?.invoice_items}
					headings={{ first: 'Bill To', second: 'Ship To' }}
					apiData={invoiceData}
					itemsColumns={columns}
					bankDetails
					termsAndConditions={invoiceData?.terms_and_condition}
					addressData={{
						default_billing_address:
							invoiceData?.customer.default_billing_address,
						default_shipping_address:
							invoiceData?.customer.default_shipping_address,
					}}
					headerInfo={headers}
					calculationInfo={calculationInfo}
					extraCalculationsInfo={invoiceCalculationsInfo}
					// titleStyles={titleStyles}
				/>
			</ContainerPaper>
		</Box>
	);
};

export default ViewInvoice;
