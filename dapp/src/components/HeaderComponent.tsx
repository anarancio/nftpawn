// components/HeaderComponent.tsx
import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Spinner } from "@blueprintjs/core";
import { AppState } from '../store';
import { disconnectUser } from '../features/auth/authSlice';

import styles from '../styles/HeaderComponent.module.css'
import globalStyles from '../styles/GlobalComponents.module.css'
import { CContainer, CHeader, CHeaderNav, CNavItem } from '@coreui/react';
import { openDialog } from '../features/dialog/dialogSlice';
import { CREATE_BASKET_DIALOG } from '../constants/index';

const HeaderComponent: FC = () => {
    const account = useSelector((state: AppState) => state.auth.account)
    const dispatch = useDispatch()
    const working = useSelector((state: AppState) => state.progress.working);

    const shortenAddress = (address: string) => {
        return address.slice(0, 6) + '...' + address.slice(-4);
    }

    return (
        <CHeader position="sticky" className="mb-4">
            <CContainer fluid>
                <CHeaderNav className="d-none d-md-flex me-auto">
                    <CNavItem className={styles.navItem}>   
                        <button 
                            className={globalStyles.actionButton} 
                            onClick={async () => {
                                dispatch(openDialog(CREATE_BASKET_DIALOG));
                            }}>Create Basket</button> 
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav>
                    {working && 
                        <div className={styles.spinnerContainer}>
                            <Spinner size={20} />
                        </div>
                    }
                </CHeaderNav>
                <CHeaderNav className="ms-3">
                    <CNavItem className={`${styles.navItem} ${styles.navItemWide}`}>                        
                        <div className={styles.userAccount}>
                            <span className={styles.userAddress}>{shortenAddress(account)}</span>
                            <button 
                                className={styles.logoutButton} 
                                onClick={() => {
                                    dispatch(disconnectUser())
                                }}>Disconnect</button>
                        </div>
                    </CNavItem>
                </CHeaderNav>
            </CContainer>
        </CHeader>
    );
};

export default HeaderComponent;