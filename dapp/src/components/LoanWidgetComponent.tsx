import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { openDialogWithData } from '../features/dialog/dialogSlice';
import { PAYMENT_DIALOG } from '../constants';

import styles from '../styles/LoanWidgetComponent.module.css'
import globalStyles from '../styles/GlobalComponents.module.css'

interface Loan {
    id: string,
    amount: number,
    duration: number,
    status: string,
    expires: string,
    interest: number, 
    borrower: string,
    nftId: string,
}

interface LoanProps {
    loan: Loan,
}

const LoanWidgetComponent: FC<LoanProps> = ({ loan }) => {
    const dispatch = useDispatch()
    return (
        <div className={styles.loanWidget}>
            <div className={styles.loanWidget__title}>Loan #{loan.id}</div>
            <div className={styles.loanWidget__content}>
                <div className={styles.loanWidget__content__left}>
                    <div className={styles.loanWidget__content__left__item}>
                        <span className={styles.loanWidget__content__left__item__title}>Amount</span>
                        <span className={styles.loanWidget__content__left__item__value}>{loan.amount}</span>
                    </div>
                    <div className={styles.loanWidget__content__left__item}>
                        <span className={styles.loanWidget__content__left__item__title}>Duration - Interest</span>   
                        <span className={styles.loanWidget__content__left__item__value}>{loan.duration} days - {loan.interest}%</span>
                    </div>
                    <div className={styles.loanWidget__content__left__item}>
                        <span className={styles.loanWidget__content__left__item__title}>Status</span>
                        <span className={styles.loanWidget__content__left__item__value}>{loan.status}</span>
                    </div>
                    <div className={styles.loanWidget__content__left__item}>
                        <span className={styles.loanWidget__content__left__item__title}>NFT id in collateral</span>
                        <span className={styles.loanWidget__content__left__item__value}>{loan.nftId}</span>
                    </div>
                </div>
                <div className={styles.loanWidget__content__right}>
                    <button 
                            className={globalStyles.actionButton}
                            onClick={() => alert('Go to the contracts: not implemented on the dApp')}>
                        Pay
                    </button>
                    <button 
                            className={globalStyles.actionButton}
                            onClick={() => alert('Go to the contracts: not implemented on the dApp')}>
                        Claim NFT
                    </button>
                 </div>
                </div>
        </div>
    );
};

export default LoanWidgetComponent;