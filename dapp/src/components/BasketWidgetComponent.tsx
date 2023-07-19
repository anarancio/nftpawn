import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import { changeContent } from '../features/content/contentSlice';
import { PAGE_VIEW_BASKET } from '../constants';

import styles from '../styles/BasketWidgetComponent.module.css'
import globalStyles from '../styles/GlobalComponents.module.css'
import { Basket } from '../model/BasketTypes';

interface BasketProps {
    basket: Basket,
}

const BasketWidgetComponent: FC<BasketProps> = ({ basket }) => {
    const dispatch = useDispatch()
    
    const pausedLabel = (basket.paused)? 'Yes' : 'No';

    return (
        <div className={styles.basketWidget}>
            <div className={styles.basketWidget__title}>Basket #{basket.id}</div>
            <div>
                <div className={styles.basketWidget__erc20}>Owner: {basket.owner}</div>
                <div className={styles.basketWidget__erc20}>ERC20: {basket.erc20}</div>
                <div className={styles.basketWidget__nft}>NFT: {basket.nft}</div>
                <div className={styles.basketWidget__nft}>Paused: {pausedLabel}</div>
                <div className={styles.basketWidget__availableLiquidity}>Available Liquidity: {basket.availableLiquidity}</div>
                <div className={styles.basketWidget__minimumLoanAmount}>Minimum Loan Amount: {basket.minimumLoanAmount}</div>
                <div className={styles.basketWidget__interestRates}>
                    <span className={styles.basketWidget__interestRates__title}>Interest Rates:</span>
                    <ul>
                        {basket.interestRates.map((interestRate, index) => (
                            <li key={index}>
                                <div>{interestRate.duration} days - {interestRate.interest}%</div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <button className={globalStyles.actionButton} onClick={() => dispatch(changeContent({name: PAGE_VIEW_BASKET, data: basket}))}>View Basket</button>
                </div>
            </div>
        </div>
    );
};

export default BasketWidgetComponent;