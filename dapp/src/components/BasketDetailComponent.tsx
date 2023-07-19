declare global {
    interface Window {
      ethereum: any;
    }
  }
import { FC } from 'react';
import { useDispatch } from 'react-redux'

import { PAGE_BASKETS_EXPLORER } from '../constants';
import { changeContent } from '../features/content/contentSlice';
import { openDialogWithData } from '../features/dialog/dialogSlice';
import { DEPOSIT_DIALOG, TAKE_LOAN_DIALOG } from '../constants';
import { BASKET_CONTRACT_ABI } from '../abis/ABIs';
import { ethers } from 'ethers';

import styles from '../styles/BasketDetailComponent.module.css'
import globalStyles from '../styles/GlobalComponents.module.css'
import LoanWidgetComponent from './LoanWidgetComponent';
import { Basket } from '../model/BasketTypes';
import { changeBasketStatus } from '../features/baskets/basketsSlice';


interface BasketProps {
    basket: Basket,
}

const BasketDetailComponent: FC<BasketProps> = ({ basket }) => {
    const dispatch = useDispatch()

    const pausedLabel = (basket.paused)? 'Yes' : 'No';    

    const pauseBasket = async () => { 
        console.log('---------pauseBasket----------');
        if (basket) {        
            const provider = new ethers.BrowserProvider(window.ethereum);
            let signer = await provider.getSigner();            
            const contract = new ethers.Contract(basket.address, BASKET_CONTRACT_ABI, signer);                                
            const tx = await contract.pauseBasket();
            const txReceipt = await tx.wait();
            console.log(txReceipt);
            dispatch(changeBasketStatus({id: basket.id, paused: true}));
        } else {
          console.log('Basket not found');
        }
    }  

    const activateBasket = async () => {
        console.log('---------activateBasket----------');
        if (basket) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            let signer = await provider.getSigner();
            const contract = new ethers.Contract(basket.address, BASKET_CONTRACT_ABI, signer);
            const tx = await contract.activateBasket();
            const txReceipt = await tx.wait();
            console.log(txReceipt);
            dispatch(changeBasketStatus({id: basket.id, paused: false}));
        } else {
            console.log('Basket not found');
        }
    }    

    return (
        <div>
            <button className={globalStyles.actionButton} onClick={() => dispatch(changeContent({name: PAGE_BASKETS_EXPLORER}))}>Back To Baskets Explorer</button>
            <div className={styles.basketWidget}>
                <div className={styles.basketWidget__title}>Basket #{basket.id}</div>
                <div className={styles.basketWidget__content}>
                    <div className={styles.basketWidget__content__left}>
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
                    </div>
                    <div className={styles.basketWidget__content__right}>
                        <button 
                                className={globalStyles.actionButton}
                                onClick={() => dispatch(openDialogWithData({componentName: TAKE_LOAN_DIALOG, data: basket.id}))}>Take Loan</button>
                        <button 
                                className={globalStyles.actionButton}
                                onClick={() => dispatch(openDialogWithData({componentName: DEPOSIT_DIALOG, data: basket.id}))}>
                            Deposit
                        </button>
                        {basket.paused?(
                            <button 
                                    className={globalStyles.actionButton}
                                    onClick={() => activateBasket()}>
                                Activate
                            </button>
                        ):(
                            <button 
                                    className={globalStyles.actionButton}
                                    onClick={() => pauseBasket()}>
                                Pause
                            </button>
                        )}                        
                    </div>
                </div>
            </div>
            <div className={styles.basketWidget__loans__container}>
                <div className={styles.basketWidget__loans__title}>Loans</div>
                <div style={{padding: '10px'}}>
                    {basket.loans && basket.loans.map(loan =>
                        <LoanWidgetComponent key={basket.id} loan={loan} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BasketDetailComponent;