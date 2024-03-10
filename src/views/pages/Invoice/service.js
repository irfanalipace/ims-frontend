import {
	generateNumberApi,
	getCustomersApi,
	getSalesPersonApi,
} from '../../../core/api/estimate';

let loading = {};

export const getItemsValues = formik => {
	return {
		total: formik.values.total,
		sub_total: formik.values.sub_total,
		items: formik.values.items,
		adjustment: formik.values.adjustment,
		discount: formik.values.discount,
		shipping_charges: formik.values.shipping_charges,
		discount_type: formik.values.discount_type,
		tax_type: formik.values.tax_type,
		// discount_value_input: formik.values?.detail?.discount,
	};
};

export const getItemsErrors = formik => {
	// const errors = {};
	// if (formik?.errors?.total) errors.total = formik?.errors?.total;
	// if (formik?.errors?.sub_total) errors.sub_total = formik?.errors?.sub_total;
	// if (formik?.errors?.items) errors.items = formik?.errors?.items;
	// if (formik?.errors?.adjustment)
	// 	errors.adjustment = formik?.errors?.adjustment;
	// if (formik?.errors?.discount) errors.discount = formik?.errors?.discount;
	// if (formik?.errors?.shipping_charges)
	// 	errors.shipping_charges = formik?.errors?.total;
	// if (formik?.errors?.discount_type)
	// 	errors.discount_type = formik?.errors?.discount_type;
	// if (formik?.errors?.tax_type) errors.tax_type = formik?.errors?.tax_type;
	return {
		total: formik?.errors?.total,
		sub_total: formik?.errors?.sub_total,
		items: formik?.errors?.items,
		adjustment: formik?.errors?.adjustment,
		discount: formik?.errors?.discount,
		shipping_charges: formik?.errors?.shipping_charges,
		discount_type: formik?.errors?.discount_type,
		tax_type: formik?.errors?.tax_type,
		// ...errors,
	};
};

export const getItemsTouched = formik => {
	return {
		items: formik.touched?.items,
		adjustment: formik.touched?.adjustment,
		discount: formik.touched?.discount,
		shipping_charges: formik.touched?.shipping_charges,
		discount_type: formik.touched?.discount_type,
	};
};
export const generateNumber = async () => {
	try {
		loading['generateNumber'] = true;
		const resp = await generateNumberApi({ type: 'invoice' });
		const generatedNumber = resp?.data[0];
		return generatedNumber;
	} catch (error) {
		console.error('Error generating number:', error);
	} finally {
		loading['generateNumber'] = false;
	}
};

export const fetchSalesPersonList = async () => {
	const params = {};
	try {
		loading['fetchSalesPersonList'] = true;
		const resp = await getSalesPersonApi(params);
		const salesPersonsData = resp?.data?.SalesPersons;

		if (salesPersonsData) return salesPersonsData;
		else return [];
	} catch (error) {
		console.error('Error fetching sales persons:', error);
		return [];
	} finally {
		loading['fetchSalesPersonList'] = false;
	}
};
export const fetchCustomerOptions = async () => {
	const params = {};
	try {
		loading['fetchCustomerOptions'] = true;
		const resp = await getCustomersApi(params);
		const customersData = resp?.data?.Customers;
		if (customersData) return customersData;
		else return [];
	} catch (error) {
		console.error('Error fetching customers:', error);
		return [];
	} finally {
		loading['fetchCustomerOptions'] = false;
	}
};

export function serviceIsLoading() {
	return loading;
}
