import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup'; // Import Yup for validation
import {
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import FormField from '../../../Components/InputField/FormField';
import { Close } from '@mui/icons-material';
import {
  createCustomer,
  getCurrenciesApi,
  getPeymentTermsApi,
  getTaxesApi,
  customersSingleApi,
  UpdateCustomerApi,
} from '../../../../core/api/customer';
import notyf from '../../../Components/NotificationMessage/notyfInstance';
import { TaxTypeEnum, salutations } from '../../../../core/utils/constants';
import HeaderPaper from '../../../Components/Containers/HeaderPaper';
import ContainerPaper from '../../../Components/Containers/ContainerPaper';
import { useNavigate, useParams } from 'react-router-dom';
import HoverPopover from '../../../Components/HoverPopover/ErrorOutlinePopover';
import GridRow from '../../../Components/GridRow/GridRow';
import { LoadingButton } from '@mui/lab';
import { decryptId, goBack } from '../../../../core/utils/helpers';
import NewTabs from './NewTabs';

function SecondNewCustomer({ edit }) {
  let { id } = useParams();
  id = decryptId(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      customerType: '',
      company_name: '',
      display_name: '',
      email: '',
      phone: '',
      work_phone: '',
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
      customerType: Yup.string().required('Customer Type is required'),
      company_name: Yup.string().required('Company Name is required'),
     // display_name: Yup.string().required('Display Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      phone: Yup.string().required('Primary Contact is required'),
      work_phone: Yup.string().required('Secondary Contact is required'),
    }),
    onSubmit: (values) => {
      // Handle form submission here
      alert(JSON.stringify(values, null, 2));
    },
  });

  if (loading) {
    return (
      <Box
        style={{
          width: '100%',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else
    return (
      <>
        <HeaderPaper>
          <GridRow style={{ marginBottom: '0px', alignItems: 'center' }}>
            <Grid item xs={6}>
              <Typography variant='h6'>{edit ? 'Edit Customer' : 'Second Customer'} </Typography>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'end' }}>
              <IconButton onClick={() => goBack(() => navigate('/customer'))}>
                <Close />
              </IconButton>
            </Grid>
          </GridRow>
        </HeaderPaper>
        <form onSubmit={formik.handleSubmit}>
          <ContainerPaper>
            <Box mb={5} sx={{ minHeight: '80vh' }}>
              <Box aria-label='customer-details' className='toTop'>
                {/* customer Type  */}
                <GridRow style={{ alignItems: 'center' }}>
                  <Grid item xs={2}>
                    <Typography variant='body2'>
                      Customer Type
                      <HoverPopover text='The contact which is associated with any account in CRM is of type Business, and other contacts will be of type individuals' />
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <div>
                      <FormControlLabel
                        id='customerTypeBusiness'
                        control={<Radio />}
                        label={'Business'}
                        value='business'
                        checked={formik.values.customerType === 'business'}
                        onChange={() => formik.setFieldValue('customerType', 'business')}
                      />
                      <FormControlLabel
                        id='customerTypeIndividual'
                        control={<Radio />}
                        label={'Individual'}
                        value='individual'
                        checked={formik.values.customerType === 'individual'}
                        onChange={() => formik.setFieldValue('customerType', 'individual')}
                      />
                    </div>
                    {formik.touched.customerType && formik.errors.customerType && (
                      <Typography variant='caption' color='error'>
                        {formik.errors.customerType}
                      </Typography>
                    )}
                  </Grid>
                </GridRow>
                {/* Names  */}
                <GridRow style={{ marginBottom: '0' }}>
                  <Grid item xs={2}>
                    <Typography variant='body2'>
                      Primary Contact
                      <HoverPopover text='The name you enter here will be for your primary contact. You can continue to add multiple contact persons from the details page' />
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <GridRow>
                      <Grid item xs={4}>
                        <FormField
                          id='salutation'
                          fullWidth
                          label={'Salutation'}
                          type={'select'}
                          {...formik.getFieldProps('salutation')}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormField
                          id='first_name'
                          label={'First Name'}
                          {...formik.getFieldProps('first_name')}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <FormField
                          id='last_name'
                          label={'Last Name'}
                          {...formik.getFieldProps('last_name')}
                        />
                      </Grid>
                    </GridRow>
                  </Grid>
                </GridRow>
                {/* Company Name  */}
                <GridRow>
                  <Grid item xs={2}>
                    <Typography variant='body2'>Company Name</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <FormField
                      id='company_name'
                      label={'Company Name'}
                      {...formik.getFieldProps('company_name')}
                    />
                    {formik.touched.company_name && formik.errors.company_name && (
                      <Typography variant='caption' color='error'>
                        {formik.errors.company_name}
                      </Typography>
                    )}
                  </Grid>
                </GridRow>
                <GridRow>
                  <Grid item xs={2}>
                    <Typography variant='body2'>
                      Customer Display Name{' '}
                      <span style={{ color: 'red' }}>
                        *
                        <HoverPopover text='This name will be displayed on the transactions you created for this customer.' />
                      </span>
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <FormField
                      id='display_name'
                      label={'Display Name'}
                      fullWidth
                      type={'select'}
                      {...formik.getFieldProps('display_name')}
                    />
                    {formik.touched.display_name && formik.errors.display_name && (
                      <Typography variant='caption' color='error'>
                        {formik.errors.display_name}
                      </Typography>
                    )}
                  </Grid>
                </GridRow>
                {/* Customer Email  */}
                <GridRow>
                  <Grid item xs={2}>
                    <Typography variant='body2'>
                      Customer Email{' '}
                      <HoverPopover text='Privacy Info: This data will be stored without encryption and will be visible only to your organization that has the required permission.' />
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <FormField
                      id='email'
                      label={'Email Address'}
                      {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <Typography variant='caption' color='error'>
                        {formik.errors.email}
                      </Typography>
                    )}
                  </Grid>
                </GridRow>
                {/* Customer Phone  */}
                <GridRow>
                  <Grid item xs={2}>
                    <Typography variant='body2'>
                      Customer Phone{' '}
                      <HoverPopover text='Privacy Info: This data will be stored without encryption and will be visible only to your organization that has the required permission.' />
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <FormField
                      id='phone'
                      label={'Primary Contact'}
                      style={{ width: '48%' }}
                      {...formik.getFieldProps('phone')}
                    />
                    <FormField
                      id='work_phone'
                      label={'Secondary Contact'}
                      style={{ width: '48%' }}
                      {...formik.getFieldProps('work_phone')}
                    />
                  </Grid>
                  {formik.touched.phone && formik.errors.phone && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.phone}
                    </Typography>
                  )}
                  {formik.touched.work_phone && formik.errors.work_phone && (
                    <Typography variant='caption' color='error'>
                      {formik.errors.work_phone}
                    </Typography>
                  )}
                </GridRow>
              </Box>
              <NewTabs />
            </Box>
          </ContainerPaper>
          <Paper
            sx={{
              padding: '15px 20px',
              position: 'fixed',
              bottom: '0',
              width: '83.6%',
              zIndex: '2',
              borderTop: '15px solid #F3F3F3',
            }}
          >
            <LoadingButton
              variant='contained'
              type='submit'
              sx={{ paddingX: '30px' }}
              onClick={() => scrollOnError()}
            >
              Save
            </LoadingButton>
            <Button
              variant='outlined'
              sx={{ marginLeft: '5px' }}
              onClick={() => navigate('/customer')}
            >
              Cancel
            </Button>
          </Paper>
        </form>
      </>
    );
}

export default SecondNewCustomer;
