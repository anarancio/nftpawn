import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { CNavItem, CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import SimpleBar from 'simplebar-react'

import { AppState } from '../store';
import { PAGE_BASKETS_EXPLORER } from '../constants';
import { changeContent } from '../features/content/contentSlice';
import { PAGE_VIEW_BASKET, PAGE_VIEW_LOAN } from '../constants';

import styles from '../styles/SidebarComponent.module.css'

const SidebarComponent: FC = () => {
    const dispatch = useDispatch()

    //my baskets
    const myAddress: string = useSelector((state: AppState) => state.auth.account) || '';
    const baskets = useSelector((state: AppState) => state.baskets)
    const myBaskets = baskets.baskets.filter((basket: any) => basket.owner.toLowerCase() === myAddress.toLowerCase());

    //my loans
    //const myLoansId: string[] = useSelector((state: AppState) => state.auth.loans) || [];
    //const loans = useSelector((state: AppState) => state.loans)
    //const myLoans = loans.loans.filter((loan: any) => myLoansId.includes(loan.id));
    const myLoans: any[] = [];

    return (
        <CSidebar
            position="fixed"
            unfoldable={false}
            visible={true}
            onVisibleChange={(visible) => {
                dispatch({ type: 'set', sidebarShow: visible })
            }}
            >
            <CSidebarBrand className="d-none d-md-flex" >
                LENDING
            </CSidebarBrand>
            <div style={{backgroundColor: '#374259', padding: '10px', borderTop: '1px solid #2E3A51'}}>                
            </div>
            <CSidebarNav>
                <div style={{padding: '10px'}}>
                    <div>
                        <CNavItem>
                            <div onClick={() => {
                                    dispatch(changeContent({name: PAGE_BASKETS_EXPLORER}));
                                }
                            } style={{padding: '5px'}}>
                                BASKETS EXPLORER
                            </div>
                        </CNavItem>
                    </div>
                    <div>
                        <CNavItem>
                            <div style={{padding: '5px'}}>
                                MY BASKETS
                            </div>
                        </CNavItem>
                    </div>
                    <SimpleBar>
                        {myBaskets.map((basket, index) => (
                            <div 
                                    className={styles.sidebarItem}
                                    onClick={() => dispatch(changeContent({name: PAGE_VIEW_BASKET, data: basket}))}>
                                Basket #{basket.id}
                            </div>
                        ))}
                    </SimpleBar>
                    {/* <div>
                        <CNavItem>
                            <div style={{padding: '5px'}}>
                                MY LOANS
                            </div>
                        </CNavItem>
                    </div>
                    <SimpleBar>
                        {myLoans.map((loan, index) => (
                            <div 
                                    className={styles.sidebarItem}
                                    onClick={() => dispatch(changeContent({name: PAGE_VIEW_LOAN, data: loan}))}>
                                Loan #{loan.id}
                            </div>
                        ))}
                    </SimpleBar> */}
                </div>
            </CSidebarNav>
        </CSidebar>
    );
};

export default SidebarComponent;