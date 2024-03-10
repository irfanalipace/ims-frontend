import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ErrorMessage, FormikProvider, useFormik } from 'formik';
import {
	Box,
	Grid,
	Paper,
	Typography,
	TextareaAutosize,
	Divider,
	Link,
	FormHelperText,
} from '@mui/material';
import FormField from 'components/InputField/FormField';
import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomerContactsList from 'components/CustomerContacts/CustomerContactsList';
import HoverPopover from 'components/HoverPopover/ErrorOutlinePopover';
import { formatDateToYYYYMMDD, getCurrentDate } from 'core/utils/helpers';
import notyf from 'components/NotificationMessage/notyfInstance';
import AddItem from 'components/AddItemNew';
import CustomSelect from 'components/Select/Select';
import OverlayLoader from 'components/OverlayLoader/OverlayLoader';
import {
	PaymentTermValue,
	dayPaymentTerms,
	netPaymentTerms,
} from '../constant';
import {
	getItemsValues,
	getItemsErrors,
	getItemsTouched,
	serviceIsLoading,
	fetchSalesPersonList,
} from '../service';
import {
	createInvoiceApi,
	getInvoiceDetailsApi,
	getPeymentTermsApi,
	updateInvoiceApi,
} from 'core/api/Invoice';
import MUIButton from 'components/Button/MUIButton';
import withErrorBoundary from 'components/ErrorBoundry';
import Header from './Header';
import InputLabel from '../../../Components/InputLabel/InputLabel';
import CustomerSelection from '../../../Components/CustomerSelection';
import FormFooter from '../../../Components/FormFooter';
import { terms_and_conditions } from '../../../../core/utils/constants';
import { invoiceFormValidation } from './schema';
import FilesModule from '../../../Components/FileUpload/FilesModule';
import { deleteInvoiceFielsApi } from '../../../../core/api/Invoice';
import { addWorkingDaysToDate } from '../../../../core/utils/helpers';
import TermsModal from '../../../Components/TermsModal/TermsModal';

const InvoiceForm = ({ edit }) => {
	const { id } = useParams();
	const source_ref = useRef();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const invoiceNumberRef = useRef();
	const [salesPersonList, setSalesPersonList] = useState([]);
	const [selectedEmails, setSelectedEmails] = useState([]);
	const [customerList, setCustomerList] = useState('');
	const [invoiceFiles, setInvoiceFiles] = useState([]);

	const [btnType, setBtnType] = useState('');
	// const [customerLoading, setCsutomerLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [paymentTerms, setPaymentTerms] = useState([]);
	const [paymentSource, setPaymentSource] = useState(dayPaymentTerms);
	const [taxIdCustomer, setTaxIdCustomer] = useState('');

	const [customError, setCustomError] = useState({});
	const [singleInvoice, setSingleInvoice] = useState('');

	const handlePaymentTerms = label => {
		const term = label.toLowerCase();
		if (term.includes('day')) setPaymentSource(dayPaymentTerms);
		if (term.includes('net')) setPaymentSource(netPaymentTerms);
		if (!edit) {
			formik.setFieldValue('detail.mode_of_payment', '');
		}
	};

	const chequeImageRef = useRef();

	const initialValues_ = {
		customer_id: '',
		customer_name: '',
		email: '',
		billing_info: '',
		shipping_info: '',
		cheque_image: '',
		tax_type: 'exclusive',
		phone: '',
		due_date: '',
		cheque_number: '',
		term: '',
		invoice_number: '',
		reference_number: '',
		invoice_date: formatDateToYYYYMMDD(new Date()), // current Date
		expiry_date: formatDateToYYYYMMDD(new Date()) || '',
		subject: '',
		sales_person_id: '',
		detail: {
			customer_notes: '',
			order_number: '',
			mode_of_payment: '',
			sales_person: '',
			termObject: '',
		},
		terms_and_condition: terms_and_conditions,
		files: invoiceFiles || [],
		cc: selectedEmails || [],
		sub_total: 0,
		discount: 0,
		tax: 0,
		discount_type: 'percentage',
		shipping_charges: 0,
		adjustment: 0,
		items_rates_are: 'tax_exclusive',
		total: 0,
		items: !edit
			? [
					{
						item_name_object: '',
						item_id: '',
						name: '',
						quantity: 1,
						item_rate: 0,
						amount: 0,
						rate: 0,
						tax_amount: 0,
						tax_id: taxIdCustomer || 1,
						tax: '',
						total: 0,
					},
			  ]
			: [],
	};

	const handleButtonClick = type => {
		setBtnType(type);
	};

	const [initialValues, setInitialValues] = useState(initialValues_);

	const calculateDiscountAmount = (disoucnt, discountType, subTotal) => {
		if (discountType === 'amount') return disoucnt;
		return (disoucnt / 100) * subTotal;
	};

	const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
		const updatedValues = { ...values };

		const updateItems = updatedValues.items.map(item => {
			return {
				...item,
				detail: JSON.stringify({ tax: item?.tax }),
			};
		});
		updatedValues.items = updateItems;
		updatedValues.detail.discount = updatedValues.discount;
		const calculatedDiscount = calculateDiscountAmount(
			updatedValues.discount,
			updatedValues.discount_type,
			updatedValues.sub_total
		);
		updatedValues.discount = {
			key: updatedValues.discount_type,
			value: calculatedDiscount,
		};

		updatedValues.cc = updatedValues?.cc?.join(',');
		updatedValues.detail.adjustment = updatedValues.adjustment;
		updatedValues.detail = JSON.stringify(updatedValues.detail);

		try {
			if (edit) {
				const resp = await updateInvoiceApi({
					...updatedValues,
					status: btnType,
					term: formik.values.term.label,
					id,
					_method: 'PUT',
				});
				notyf.success(resp.message);
				navigate('/invoices');
			} else {
				const resp = await createInvoiceApi({
					...updatedValues,
					status: btnType,
					term: formik.values.term.label,
					origin: 'minnesota',
				});
				notyf.success(resp.message);
				setCustomError({});
				navigate('/invoices');
			}
		} catch (error) {
			const errorName = Object.keys(error?.data?.errors)[0];
			const errroMessage = Object.values(error?.data?.errors)[0][0];

			if (errorName) {
				setCustomError({
					[errorName]: errroMessage || 'something went wrong',
				});

				// if (errorName === 'invoice_number') {
				// 	invoiceNumberRef.current?.scrollIntoView({ behavior: 'smooth' });
				// 	return;
				// }
				return;
			}
			notyf.error(error.data.message);
			setFieldError(error?.data?.errors);
		} finally {
			setSubmitting(false);
		}
	};
	const validationSchema = invoiceFormValidation(edit, singleInvoice);
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: handleSubmit,
	});

	useEffect(() => {
		// formik.setFieldValue('due_date', selectedTerm?.due_date);
		if (formik.values.term?.label) handlePaymentTerms(formik.values.term.label);
	}, [formik.values.term?.id]);

	useEffect(() => {
		formik.setFieldValue(
			'due_date',
			addWorkingDaysToDate(
				formik.values.term?.number_of_days,
				formik.values.invoice_date
			)
		);
	}, [formik.values.term, formik.values.invoice_date]);

	// useEffect(() => {
	// 	if (edit) {
	// 		console.log(paymentTerms);
	// 		const preSelectedTerms = paymentTerms.find(
	// 			item => item.label === formik.values.term
	// 		);

	// 		formik.setFieldValue('term', preSelectedTerms);
	// 	}
	// }, [formik.values.detail?.customerId, paymentTerms]);

	const fetchTerms = async () => {
		try {
			const response = await getPeymentTermsApi();
			const termsData = response?.data;
			if (termsData) {
				// Process the response and set state variables
				const termsOptions = termsData.map(term => ({
					label: term?.term_name,
					value: term.id,
					number_of_days: term.number_of_days,
					id: term.id,
					due_date: term.due_date,
				}));

				setPaymentTerms([...termsOptions]);
			}
		} catch (error) {
			console.error('Error fetching payment terms:', error);
		}
	};

	useEffect(() => {
		fetchTerms();
	}, []);

	const itemValues = getItemsValues(formik);
	const itemErrors = getItemsErrors(formik);
	const itemTouched = getItemsTouched(formik);

	const hydrateForm = async () => {
		await Promise.all([
			fetchSalesPersonList().then(response => setSalesPersonList(response)),
		]);
	};

	useEffect(() => {
		hydrateForm();
	}, []);

	const params = new URLSearchParams(window.location.search);
	const customerId = params.get('customerId');

	useEffect(() => {
		if (customerId && edit) {
			formik.setFieldValue('customer_id', customerId);
		}
	}, [customerId]);

	const gettingCustomersList = async resp => {
		try {
			// setLoading(true);
			formik.setFieldValue('customer_id', resp.id);

			const { country, address, address2, city, state_name, zipcode } =
				resp.customer_billing_address[0];

			const shippingAddress = resp.customer_shipping_address[0];
			const customerBillingAddress = {
				address: `${address} ${address2}`,
				city,
				zip: zipcode,
				state: state_name,
				country: country.name,
			};
			const cusotmerShippingAddress = {
				address: `${shippingAddress.address} ${shippingAddress.address2}`,
				city: shippingAddress.city,
				zip: shippingAddress.zipcode,
				state: shippingAddress.state_name,
				country: shippingAddress.country.name,
			};

			formik.setFieldValue('tax', resp.tax?.rate || 0);
			formik.setFieldValue('phone', resp.phone);

			formik.setFieldValue('customer_name', resp.display_name);
			formik.setFieldValue('email', resp.email);
			formik.setFieldValue('billing_info', customerBillingAddress);
			formik.setFieldValue('shipping_info', cusotmerShippingAddress);
			const termObject = {
				label: resp.term.term_name,
				value: resp.term.id,
				number_of_days: resp.term.number_of_days,
				id: resp.term.id,
				due_date: resp.term.due_date,
			};

			if (!edit) {
				formik.setFieldValue('term', termObject);
				formik.setFieldValue('detail.termObject', termObject);
			}

			if (!edit) {
				formik.setFieldValue(
					'tax_type',
					resp.tax_preference === 'tax_exempt' ? 'inclusive' : 'exclusive'
				);
			}

			if (!edit) {
				setSelectedEmails(resp?.customer_contacts);
			} else {
				const ddsd = resp?.customer_contacts?.map(item => {
					return {
						...item,
						is_selected: formik.values?.cc?.split(',').includes(item.email)
							? 1
							: 0,
					};
				});

				setSelectedEmails(ddsd);
			}

			setCustomerList(resp);

			setTaxIdCustomer(resp.tax_id || 1);

			if (formik.values.items.length && !edit) {
				if (!formik.values.items?.[0]?.tax_id) {
					formik.setFieldValue(`items.${0}.tax_id`, resp.tax_id);
					formik.setFieldValue(`items.${0}.tax_amount`, resp?.tax?.rate);
				}
			}
			// if (!edit) {
			// 	formik.setFieldValue(
			// 		'items_rates_are',
			// 		resp.tax_preference === 'taxable' ? 'tax_exclusive' : 'tax_inclusive'
			// 	);
			// }
		} catch (error) {
			console.error(error);
		} finally {
			// setLoading(false);
		}
	};

	useEffect(() => {
		if (selectedEmails?.length) {
			formik.setFieldValue(
				'cc',
				selectedEmails
					?.filter(item => item.is_selected === 1)
					.map(item => item.email)
			);
		}
	}, [formik.values.customer_id, selectedEmails]);
	console.log(selectedEmails);

	// file work
	const handleChequeChange = event => {
		const files = event.target.files;
		formik.setFieldValue('cheque_image', files[0]);
	};

	useEffect(() => {
		formik.setFieldValue('files', invoiceFiles);
	}, [invoiceFiles]);

	useEffect(() => {
		if (id) {
			setLoading(true);
			fetchingSingleInvoice();
		}
	}, [id]);

	const updatingContacts = newContacts => {
		setSelectedEmails(prev => [...prev, ...newContacts]);
	};

	const fetchingSingleInvoice = async () => {
		try {
			const resp = await getInvoiceDetailsApi(id);
			const responseData = { ...resp.data };

			responseData.detail = JSON.parse(responseData.detail);
			console.log(responseData.detail);
			responseData.adjustment = responseData.detail?.adjustment;
			responseData.term = responseData.detail?.termObject;

			// if (!responseData.cheque_image)
			// 	responseData.cheque_image = resp.data.cheque_image || '';
			responseData.items = responseData.invoice_items || [];

			delete responseData.invoice_items;
			const dd = responseData?.items?.map(item => {
				return {
					...item,
					quantity: parseInt(item.quantity),
					item_name_object: {
						label: item.item_name,
						value: item.item_id,
						price: item?.rate || 0,
					},
				};
			});

			responseData.items = [...dd];

			// resp.data?.cheque_image === null ? '' : resp.data?.cheque_image;
			responseData['cheque_number'] =
				resp.data.cheque_number === null ? '' : resp.data?.cheque_number;

			if (responseData.discount_value === null) {
				responseData.discount_value = 0;
			}
			responseData.discount = responseData.detail.discount;

			responseData.discount_type = responseData.discount_key;

			formik.setValues(responseData);

			setSingleInvoice(responseData);
			setInitialValues(responseData);

			setInvoiceFiles(responseData.files);

			// const termObject = {
			// 	label: responseData.term.term_name,
			// 	value: responseData.term.id,
			// 	number_of_days: responseData.term.number_of_days,
			// 	id: responseData.term.id,
			// 	due_date: responseData.term.due_date,
			// };
			// formik.setFieldValue('term', termObject);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	console.log(formik);

	// setting invoices default options for sales person

	const handleSelectChange = (newOption, type) => {
		if (type === 'sales_person') {
			formik.setFieldValue('detail.sales_person', newOption);
			formik.setFieldValue('sales_person_id', newOption.value);
			return;
		}

		if (type === 'term') {
			formik.setFieldValue('term', newOption);

			formik.setFieldValue('detail.termObject', newOption);
			return;
		}
		if (type === 'mode_of_payment') {
			formik.setFieldValue('detail.mode_of_payment', {
				value: newOption.value,
				label: newOption.label,
			});
			return;
		}

		// formik.setFieldValue(type, newOption?.value);
	};

	const labelStyle = {
		display: 'flex',
		alignItems: 'center',
	};

	const selectControlStyles = baseStyles => ({
		...baseStyles,
		fontSize: '13px',
		fontWeight: 400,
		fontFamily: 'Roboto',
		color: 'black',
		background: 'transparent',
		borderColor:
			formik.touched.customer_id && formik.errors.customer_id
				? 'red'
				: 'rgba(0, 0, 0, 0.2)',
	});

	const isFormHasError = errorr => {
		if (
			(formik.dirty === true && Object.keys(errorr).length !== 0) ||
			Object.keys(errorr).length !== 0
		) {
			return true;
		} else {
			return false;
		}
	};

	useEffect(() => {
		if (isFormHasError(formik.errors)) {
			const el = document.querySelector('.Mui-error, [data-error]');
			(el?.parentElement ?? el)?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [formik.isSubmitting]);

	useEffect(() => {
		formik?.setErrors(customError);

		if (isFormHasError(customError)) {
			const dd = Object.keys(customError);
			if (dd.includes('invoice_number')) {
				invoiceNumberRef.current?.scrollIntoView({ behavior: 'smooth' });
				return;
			}
			if (dd.includes('mode_of_payment')) {
				source_ref.current?.scrollIntoView({ behavior: 'smooth' });
				return;
			}
		}
	}, [customError]);

	const selectMenuStyles = baseStyles => ({
		...baseStyles,
		zIndex: 9999,
		fontFamily: 'Roboto',
		fontSize: '13px',
		color: 'black',
	});

	const MyDivider = () => (
		<Grid item xs={12} mt={3}>
			<Divider />
		</Grid>
	);

	const laodingState = serviceIsLoading();

	return (
		<>
			<OverlayLoader open={loading} />
			<FormikProvider value={formik}>
				<form onSubmit={formik.handleSubmit}>
					<Grid container>
						<Grid item sm={12}>
							<Header edit={edit} />
						</Grid>
						{/* main layout   */}
						<Paper sx={{ width: '100%', p: '1.5rem 2rem 10rem 2rem' }}>
							<Grid item container>
								<Grid item xs={12}>
									<CustomerSelection
										id='customer_id'
										type='customer'
										formik={formik}
										error={formik.errors.customer_id}
										touch={formik.touched.customer_id}
										onSelect={resp => gettingCustomersList(resp)}
										preSelected={formik.values.customer_id}
										setIsLoadingOverlay={setLoading}
									/>
								</Grid>
							</Grid>
							<>
								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel required> Invoice #</InputLabel>
									</Grid>
									<Grid item sm={4} ref={invoiceNumberRef}>
										<FormField
											name='invoice_number'
											placeholder='Invoice Number'
											size='small'
											type='text'
											fullWidth
											value={formik.values.invoice_number || ''}
											handleChange={formik.handleChange}
											onBlur={formik.handleBlur}
											isTouched={!!formik.touched.invoice_number}
											error={formik.errors.invoice_number}
										/>
									</Grid>
								</Grid>

								<Grid item container mt={2}>
									<Grid item xs={2} display='flex' alignItems='center'>
										<InputLabel required>P.O Reference No.</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<FormField
											placeholder='P.O Reference No'
											name='detail.order_number'
											size='small'
											loading={loading}
											fullWidth
											type='text'
											value={formik.values.detail.order_number || ''}
											handleChange={formik.handleChange}
											isTouched={!!formik.touched.detail?.order_number}
											error={
												formik.errors.detail?.order_number
												// customError?.order_number
											}
										/>
									</Grid>
								</Grid>

								<Grid item container mt={2}>
									<Grid item xs={2}>
										<InputLabel>Invoice Date</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<FormField
											minDate={getCurrentDate()}
											loading={loading}
											name='invoice_date'
											value={formik.values.invoice_date || ''}
											onChange={formik.handleChange}
											size='small'
											fullWidth
											type='date'
											error={formik.errors.invoice_date}
											isTouched={!!formik.touched.invoice_date}
											inputProps={{ min: formatDateToYYYYMMDD(new Date()) }}
										/>
									</Grid>
									<Grid item xs={1}>
										<InputLabel required sx={{ textAlign: 'center' }}>
											Terms
										</InputLabel>
									</Grid>
									<Grid item xs={2}>
										<CustomSelect
											name='term'
											id='term'
											configure
											value={formik.values.term}
											options={paymentTerms}
											className='basic-multi-select'
											classNamePrefix='select'
											placeholder='Select Terms'
											onConfigureClick={() => setIsOpen(true)}
											onChange={selected =>
												handleSelectChange(selected, 'term')
											}
											loading={undefined}
											touched={!!formik.touched.term}
											error={
												formik.touched.term &&
												formik.errors.term &&
												formik.errors.term
											}
										/>

										<TermsModal
											terms={paymentTerms}
											isOpen={isOpen}
											onSave={fetchTerms}
											onClose={() => setIsOpen(false)}
										/>
									</Grid>
									<Grid item xs={1}>
										<InputLabel required sx={{ textAlign: 'center' }}>
											Due Date
										</InputLabel>
									</Grid>
									<Grid item xs={2}>
										<FormField
											loading={loading}
											minDate={getCurrentDate()}
											name='due_date'
											value={formik.values.due_date || ''}
											onChange={formik.handleChange}
											size='small'
											fullWidth
											type='date'
											error={formik.errors.due_date}
											isTouched={!!formik.touched.due_date}
											inputProps={{ min: formatDateToYYYYMMDD(new Date()) }}
										/>
									</Grid>
								</Grid>

								<MyDivider />

								{/* sales  */}
								<Grid item container sx={{ margin: '2rem 0' }}>
									<Grid item xs={2}>
										<InputLabel required>Sales Person</InputLabel>
									</Grid>
									<Grid item xs={4}>
										<CustomSelect
											value={formik.values.detail.sales_person}
											name='detail.sales_person'
											id='detail.sales_person'
											className='basic-multi-select'
											classNamePrefix='select'
											placeholder='Select or add sales persons'
											options={salesPersonList?.map(item => ({
												label: item.name,
												value: item.id,
											}))}
											onChange={selected =>
												handleSelectChange(selected, 'sales_person')
											}
											touched={!!formik.touched.detail?.sales_person}
											error={
												formik.touched.detail?.sales_person &&
												formik.errors.detail?.sales_person &&
												formik.errors.detail?.sales_person
											}
											loading={laodingState['fetchSalesPersonList'] === true}
										/>
									</Grid>
									<MyDivider />
								</Grid>
								{/* Subject  */}
								<Grid item container sx={{ margin: '1rem 0' }}>
									<Grid item xs={2} sx={{ ...labelStyle }}>
										<InputLabel>Subject</InputLabel>
										<HoverPopover text='You can add subject for invoice '></HoverPopover>
									</Grid>
									<Grid item xs={4}>
										<TextareaAutosize
											minRows={2}
											aria-label='textarea'
											style={{
												width: 'calc(100% - 0rem)',
												borderRadius: '4px',
												outlineColor: '#1565c0',
												borderColor: '#bdbdbd',
												padding: '8px',
												fontFamily: 'Roboto',
												fontSize: '16px',
												color: 'black',
											}} // only style working
											placeholder='let your customer know what this Invoice for'
											name='subject'
											value={formik.values.subject || ''}
											onChange={formik.handleChange}
										/>
										<ErrorMessage
											name='subject'
											render={msg => (
												<FormHelperText error>{msg}</FormHelperText>
											)}
										/>
									</Grid>
									{/* <MyDivider /> */}
								</Grid>
								{/* item rates  */}
							</>
							<Grid
								item
								container
								sx={{ marginTop: '2rem' }}
								display='flex'
								justifyContent='flex-end'
							>
								<Grid item container spacing={2} my={7}>
									<Grid item sm={12}>
										<Box>
											<AddItem
												type='invoice'
												// loading={loading}
												itemName='items'
												formiks={{
													values: itemValues,
													errors: itemErrors,
													touched: itemTouched,
													handleChange: formik.handleChange,
													setFieldValue: formik.setFieldValue,
												}}
												customerTax={customerList.tax}
												isEdit={edit}
												taxId={taxIdCustomer}
											/>
										</Box>
									</Grid>
									<Grid item xs={6}>
										<Grid item xs={12}>
											<InputLabel>Customer Notes</InputLabel>
											<FormField
												loading={loading}
												fullWidth
												multiline
												rows={3}
												id={'detail.customer_notes'}
												name={'detail.customer_notes'}
												value={formik.values.detail.customer_notes}
												error={formik.errors.detail?.customer_notes}
												isTouched={!!formik.touched.detail?.customer_notes}
												onChange={formik.handleChange}
											/>
										</Grid>
										<Grid item xs={12} mt={2}>
											<InputLabel>Terms and conditions</InputLabel>
											<FormField
												loading={loading}
												fullWidth
												multiline
												rows={3}
												id='terms_and_condition'
												onChange={formik.handleChange}
												value={formik.values.terms_and_condition}
												error={undefined} // variant="outlined"
											/>
										</Grid>
									</Grid>
									<Grid item xs={6} display='flex' justifyContent='center'>
										<FilesModule
											files={formik.values.invoice_files}
											// onDelete={deletingFile}
											deleteApi={deleteInvoiceFielsApi}
											setFiles={files => formik.setFieldValue('files', files)}
										/>
									</Grid>
									<Box mt={6} ml={2}>
										<Typography>Payment Information</Typography>
									</Box>
									<Grid item container mt={2}>
										<Grid item xs={2}>
											<InputLabel required>Source</InputLabel>
										</Grid>
										<Grid item xs={4} ref={source_ref}>
											<CustomSelect
												name='detail.mode_of_payment'
												value={formik.values.detail.mode_of_payment}
												options={paymentSource}
												className='basic-multi-select'
												classNamePrefix='select'
												placeholder='Select Payment Source'
												onChange={selected => {
													handleSelectChange(selected, 'mode_of_payment');
												}}
												styles={{
													control: selectControlStyles,
													menu: selectMenuStyles,
												}}
												id={''}
												touched={!!formik.touched.detail?.mode_of_payment}
												error={
													formik.touched.detail?.mode_of_payment &&
													formik.errors.detail?.mode_of_payment &&
													formik.errors.detail?.mode_of_payment
												}
												loading={false}
											/>
										</Grid>
									</Grid>
									{formik.values.detail.mode_of_payment?.value ===
										PaymentTermValue.Cheque && (
										<Grid item alignItems='center' container mt={2}>
											<Grid item xs={2}>
												<InputLabel required>Reference / Check #</InputLabel>
											</Grid>
											<Grid item xs={4}>
												<FormField
													placeholder='4565673764738382'
													loading={loading}
													name='cheque_number'
													isTouched={!!formik.touched.cheque_number}
													value={formik.values.cheque_number || ''}
													error={formik.errors.cheque_number}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													size='small'
													fullWidth
													type='text'
												/>
											</Grid>
											{formik.values.detail.mode_of_payment?.value ===
												PaymentTermValue.Cheque && (
												<Grid item xs={4} sx={{ ml: 4 }}>
													<Box sx={{ display: 'flex' }}>
														{formik.values.detail.mode_of_payment?.value ===
															PaymentTermValue.Cheque}
														<Box>
															<InputLabel>Cheque Image</InputLabel>
															<ErrorMessage
																name='cheque_image'
																render={msg => (
																	<FormHelperText error>{msg}</FormHelperText>
																)}
															/>
														</Box>
														<label htmlFor='file-input-cheque'>
															<MUIButton
																disabled={
																	formik.values.detail.mode_of_payment
																		?.value !== PaymentTermValue.Cheque
																}
																startIcon={<AttachFileIcon />}
																sx={{
																	border: 'none',
																	color: 'black',
																	textTransform: 'capitalize',
																}}
																variant='text'
																component='span'
																onClick={e => {
																	e.preventDefault();
																	document
																		.getElementById('file-input-cheque')
																		?.click();
																}}
																fullWidth
															></MUIButton>

															<input
																id='file-input-cheque'
																type='file'
																accept='image/*'
																ref={chequeImageRef}
																name='cheque_image'
																disabled={
																	formik.values.detail.mode_of_payment
																		?.value !== PaymentTermValue.Cheque
																}
																style={{ display: 'none' }}
																onChange={handleChequeChange}
															/>
														</label>
													</Box>
													<Box
														sx={{
															display: 'flex',
															alignItems: 'center',
															gap: 2,
														}}
													>
														{!edit && (
															<Typography>
																{formik.values.cheque_image?.name}
															</Typography>
														)}
														{edit &&
															(formik.values.cheque_image?.name ? (
																<Typography>
																	{formik.values.cheque_image?.name}
																</Typography>
															) : (
																<Link
																	target='_blank'
																	rel='noreferrer'
																	href={singleInvoice.cheque_image}
																>
																	<Typography>{'View cheque image'}</Typography>
																</Link>
															))}
														{formik.values.cheque_image && (
															<MUIButton
																startIcon={<DeleteIcon />}
																sx={{
																	border: 'none',
																	color: 'black',
																	textTransform: 'capitalize',
																}}
																variant='text'
																component='span'
																onClick={() => {
																	formik.setFieldValue('cheque_image', '');
																	if (chequeImageRef.current) {
																		chequeImageRef.current.value = '';
																	}
																}}
															></MUIButton>
														)}
													</Box>
												</Grid>
											)}
										</Grid>
									)}
								</Grid>
							</Grid>

							{formik.values?.customer_id && (
								<CustomerContactsList
									setSelectedEmails={setSelectedEmails}
									gettingCustomerList={gettingCustomersList}
									selectedEmails={selectedEmails}
									customerDetails={customerList}
									onSave={updatingContacts}
								/>
							)}
						</Paper>

						<FormFooter
							btnType={btnType}
							isSubmitting={formik.isSubmitting}
							onSubmit={e => handleButtonClick(e)}
						/>
					</Grid>
				</form>
			</FormikProvider>
		</>
	);
};

export default withErrorBoundary(InvoiceForm);
