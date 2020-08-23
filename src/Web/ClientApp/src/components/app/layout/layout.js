import React, {
	useState,
	useRef,
	useEffect,
} from './node_modules/react';
import { Container, Row, Col } from './node_modules/react-bootstrap';
import styles from './Layout.module.css';
import NavBar from '../../components/Navigation/NavBar/NavBar';
import SideBar from '../../components/Navigation/NavSideBar/NavSideBar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
	const [showSideDrawer, setShowSideDrawer] = useState(false);

	const prevShowSideDrawerRef = useRef();

	useEffect(() => {
		prevShowSideDrawerRef.current = showSideDrawer;
	});

	const sideDrawerToggleHandler = () =>
		setShowSideDrawer(!prevShowSideDrawerRef.current);

	return (
		// <span className={styles.Layout}>
		<>
			<NavBar sideDrawerToggleHandler={sideDrawerToggleHandler} />
			{/* <SideDrawer
				open={showSideDrawer}
				sideDrawerToggleHandler={sideDrawerToggleHandler}
			/>
			<div className={styles.Container}>
				<div className={styles.SideBar}>
					<SideBar
						sideDrawerToggleHandler={sideDrawerToggleHandler}
					/>
				</div>
				<div className={styles.Main}>{props.children}</div>
			</div> */}
		</>
		// </span>
	);
};

export default Layout;
