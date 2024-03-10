import * as Yup from 'yup';

import { PaymentTermValue } from '../constant';
const discountCalculate = (type, value, parentValue) => {
	return type === 'percentage'
		? isNaN((parentValue * value) / 100)
			? '0.00'
			: `-${((parentValue * value) / 100).toFixed(2)}`
		: isNaN(value) || value === ''
		? '0.00'
		: `-${value.toFixed(2)}`;
};

export const invoiceFormValidation = (edit, singleInvoice) => {
	return Yup.object().shape({
		customer_id: Yup.string().required('Customer is required'),
		due_date: Yup.string()
			.required('Due Date is required')
			.test(
				'lessThanOrEqual',
				'Due date must be greater or equal to Invoice Date',
				function (value) {
					const invoice_date = new Date(this.parent?.invoice_date);
					const dueDate = new Date(value);
					return dueDate >= invoice_date;
				}
			),

		invoice_number: Yup.string().required('Invoice number is required'),
		invoice_date: Yup.string().required('Invoice date is required'),
		term: Yup.object().required('Term is required'),
		subject: Yup.string().required('Subject is required'),

		// discount: Yup.number().min(0, 'Discount must be greater then 0 '),
		discount: Yup.number()
			.min(0, 'Discount must be greater then 0 ')
			.test(
				'lessThanOrEqual',
				'Discount must be less than Sub Total',
				function (value) {
					const subTotalValue = this.parent?.sub_total;
					const discountType = this.parent?.discount_type;

					if (subTotalValue === 0) return true;

					return (
						Math.abs(
							Number(discountCalculate(discountType, value, subTotalValue))
						) < Number(subTotalValue)
					);
				}
			),
		adjustment: Yup.string().min(0, 'Adjustment must be greater then 0 '),
		shipping_charges: Yup.string().min(
			0,
			'Shipping charges must be greater then 0 '
		),
		items: Yup.array(
			Yup.object({
				item_name: Yup.string().required('Item name is required'),
				quantity: Yup.number()
					.required('Quantity is required')
					.min(1, 'Quantity must be greater than 0'),
				rate: Yup.number()
					.required('Rate is a required field')
					.min(1, 'Rate must be greater than 0'),
				tax: Yup.object().required('Tax is required'),
			})
		),

		detail: Yup.object({
			order_number: Yup.string(),
			customer_notes: Yup.string(),
			mode_of_payment: Yup.object().required('Payment mode is required'),
			sales_person: Yup.object().required('Sales person is required'),
		}),

		cheque_number: Yup.string().when('detail.mode_of_payment', {
			is: mode_of_payment => mode_of_payment?.value === PaymentTermValue.Cheque,
			then: () => Yup.string().required('Cheque number is required'),
		}),

		cheque_image: Yup.string().when('detail.mode_of_payment', {
			is: mode_of_payment => mode_of_payment?.value === PaymentTermValue.Cheque,
			then: () =>
				Yup.string().when('mode_of_payment', {
					is: () => !edit && !singleInvoice?.cheque_image_path,
					then: () => Yup.string().required('Cheque image is required'),
				}),
		}),

		// invoice_items[0].taxt: Yup.string().required("Sales person is required")
	});
};
