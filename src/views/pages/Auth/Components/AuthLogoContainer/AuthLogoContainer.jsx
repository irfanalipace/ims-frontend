import React from 'react';
import Logo from '../../../../../assets/images/logos/computer.png';
import { AuthImg } from '../Styles';
const AuthLogoContainer = () => {
	return (
		<AuthImg item xs={12}>
			<img src={Logo} alt='logo' />
		</AuthImg>
	);
};

export default AuthLogoContainer;
