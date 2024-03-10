import { Box, Stack, Typography } from '@mui/material';
import FormField from '../InputField/FormField';
import { useEffect, useState } from 'react';
import { formatDateToYYYYMMDD } from '../../../core/utils/helpers';
function DateRangeHeader({ setSearchPram }) {
  const [formValues, setFormValues] = useState({
    dateFrom: '',
    dateTo: ''
  });
  useEffect(() => {
    if (formValues.dateFrom && formValues.dateTo) {
      setSearchPram({
        start_date: formValues.dateFrom,
        end_date: formValues.dateTo
      });
    }
  }, [formValues]);

  // Handle changes in form fields
  const handleFormFieldChange = (fieldName, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [fieldName]: value
    }));
  };

  return (
    <>
      <Typography variant='body1' fontWeight={500} ml={3} mb={3} pt={2}>
        Date Range
      </Typography>
      <Stack direction={'row'} ml={3}>
        <Box sx={{ width: '15%' }}>
          <FormField
            type='date'
            name='date_from'
            size='small'
            value={formValues.dateFrom}
            onChange={e => handleFormFieldChange('dateFrom', e.target.value)}
            inputProps={{
              // max: formValues.dateTo,
              max: formatDateToYYYYMMDD(new Date())
            }}
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            label='From'
          />
        </Box>
        <Box sx={{ width: '15%' }} ml={3}>
          <FormField
            type='date'
            name='date_to'
            size='small'
            inputProps={{
              min: formValues.dateFrom,
              max: formatDateToYYYYMMDD(new Date())
            }}
            InputLabelProps={{
              shrink: true
            }}
            value={formValues.dateTo}
            onChange={e => handleFormFieldChange('dateTo', e.target.value)}
            fullWidth
            label='To'
          />
        </Box>
      </Stack>
    </>
  );
}

export default DateRangeHeader;
