import React, { useContext } from 'react';
import AppContext from '../contexts/app-context';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';

export default ({ title }) => {
	const { userEmail, logout } = useContext(AppContext);
	return (
		<Navbar bg="light" expand="lg">
			<Navbar.Brand href="/">{title}</Navbar.Brand>
			<Navbar.Toggle />
			<Navbar.Collapse>
				<Nav className="ml-auto">
					<NavDropdown title={userEmail} id="useremail">
						<NavDropdown.Item onClick={logout}>
							Logout
						</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};
