import React, { Fragment } from 'react';
import Select, { components } from 'react-select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Settings } from '@mui/icons-material';
import MUIButton from '../Button/MUIButton';

const CustomSelect = ({
	id,
	value,
	label,
	isDisabled,
	placeholder,
	options,
	onChange,
	touched,
	error,
	loading,
	configure,
	onConfigureClick,
	...otherProps
}) => {
	const isError = touched && error;

	const placeholderStyle = isError ? {} : {};
	return (
		<>
			<Select
				{...otherProps} // other props like multi searchable etc
				id={id}
				isLoading={loading}
				placeholder={placeholder}
				isSearchable={true}
				value={value}
				selectProps={{ onConfigureClick }}
				label={label}
				isDisabled={isDisabled}
				options={options}
				onChange={onChange}
				components={configure ? { Menu, Option } : ''}
				styles={{
					control: (baseStyles, state) => ({
						...baseStyles,
						height: '40px',
						fontFamily: 'Roboto',
						background: state.isDisabled ? '#e0e0e0' : 'transparent',
						borderColor: touched && error ? '#d32f2f' : 'rgba(0, 0, 0, 0.2)',
					}),
					menu: baseStyles => ({
						...baseStyles,
						zIndex: 9999,
						fontFamily: 'Roboto',
						fontSize: '16px',
					}),
					placeholder: baseStyles => ({
						...baseStyles,
						...placeholderStyle,
					}),
				}}
			/>
			{error && (
				<Box mt={'4px'}>
					<Typography color='error' variant='caption' className='Mui-error'>
						{error ? error : null}
					</Typography>
				</Box>
			)}
		</>
	);
};

export default CustomSelect;

const Menu = props => {
	return (
		<Fragment>
			<components.Menu {...props}>
				<div>
					{props.selectProps.fetchingData ? (
						<span className='fetching'>Fetching data...</span>
					) : (
						<div>{props.children}</div>
					)}

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<MUIButton
							variant={'outlined'}
							fullWidth
							// onClick={props.selectProps.changeOptionsData}
							onClick={props.selectProps.selectProps.onConfigureClick}
						>
							<Settings /> Configure Terms
						</MUIButton>
					</Box>
				</div>
			</components.Menu>
		</Fragment>
	);
};

const Option = props => {
	return (
		<Fragment>
			<components.Option {...props}>{props.children}</components.Option>
		</Fragment>
	);
};
