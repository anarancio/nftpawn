declare global {
    interface Window {
      ethereum: any;
    }
}

import { FC, useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers, EventLog } from 'ethers';
import { LENDING_CONTRACT_ABI, BASKET_CONTRACT_ABI } from '../abis/ABIs';
import { LENDING_CONTRACT_ADDRESS } from '../constants/index';

import { connectUser } from '../features/auth/authSlice';
import { loadBaskets } from '../features/baskets/basketsSlice';

import styles from '../styles/NotConnectedComponent.module.css'
import { Basket, InterestRate, Loan } from '../model/BasketTypes';


const NotConnectedComponent: FC = () => {
    const dispatch = useDispatch()
    const [hasProvider, setHasProvider] = useState<boolean | null>(null)

    useEffect(() => {
        const getProvider = async () => {
          const provider = await detectEthereumProvider({ silent: true })
          console.log(provider)
          setHasProvider(Boolean(provider)) // transform provider to true or false
        }
    
        getProvider()
      }, [])

    const getEvents = async (contractAddress: string, contractABI: any, eventName: string) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        const filter = contract.filters[eventName]();
        const events = await contract.queryFilter(filter);
        return events;
    }

    const getLoans = async (basketAddress: string) => {
        console.log(`getLoans for basket ${basketAddress}`);
        const events = await getEvents(basketAddress, BASKET_CONTRACT_ABI, 'LoanCreated');
        const loans: Loan[] = [];
        for (let i=0; i<events.length; i++) {
            const event: EventLog = (events[i] as EventLog);
            const id = event.args.getValue('_loanId').toString();

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(basketAddress, BASKET_CONTRACT_ABI, provider);
            const loanData = await contract.loans(id);
            
            const loan: Loan = {
                id: id,
                amount: loanData[2].toString(),
                duration: loanData[4].toString(),
                status: loanData[9].toString(),
                expires: '',
                interest: loanData[5].toString(), 
                borrower: '',
                nftId: loanData[1].toString(),
            };
            loans.push(loan);
        }
        return loans;
    }

    const handleConnect = async () => {                
        let accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const eventName = 'BasketCreated';
        const contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_CONTRACT_ABI, provider);
        const filter = contract.filters[eventName]();
        const events = await contract.queryFilter(filter);
        console.log(events);

        const baskets:any[] = [];
        for (let i = 0; i < events.length; i++) {
            const event: EventLog = (events[i] as EventLog);
            const id = event.args.getValue('_id').toString();

            const basketAddress = await contract.baskets(id);
            const basketContract = new ethers.Contract(basketAddress, BASKET_CONTRACT_ABI, provider);
            const basketOwner = await basketContract.owner();
            const liquidity = await basketContract.liquidity();
            const paused = await basketContract.paused();

            //get loans
            const loans = await getLoans(basketAddress);

            const rates: InterestRate[] = [];
            const interestRanges = event.args.getValue('_interestRanges');
            for (let j = 0; j < interestRanges.length; j++) {
                const interestRange = interestRanges[j];
                const interestValue = await basketContract.interestRates(interestRange);
                const interestRate: InterestRate = {
                    duration: interestRange.toString(),
                    interest: interestValue[0].toString(),
                }
                rates.push(interestRate);
            }

            const basket: Basket = {
                id: id,
                address: basketAddress,
                owner: basketOwner,
                erc20: event.args.getValue('_erc20').toString(),
                nft: event.args.getValue('_nft').toString(),
                availableLiquidity: liquidity.toString(),
                minimumLoanAmount: 0,
                interestRates: rates,
                paused: false,
                loans: loans,
            };
            console.log(basket);
            baskets.push(basket);
        }
        dispatch(loadBaskets(baskets));

        dispatch(connectUser(accounts[0]))
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>NFTPawn</div>
            <div className={styles.subTitle}>Lending Platform with NFT as collateral</div>
            <div>
                <a 
                    onClick={handleConnect} 
                    className={styles.metamaskButton} href="#">
                        <span></span>Connect Wallet
                </a>
            </div>

            <div className={styles.abstract}>
                Welcome to NFTPawn, your gateway to decentralized finance using the power of Non-Fungible Tokens (NFTs). <br />
                We are redefining the lending landscape by introducing an innovative protocol that allows you to unlock the potential of your digital assets. <br />
                With NFTPawn, you can leverage your NFTs as collateral for loans, creating liquidity in a way that's never been possible until now. <br />
                Say goodbye to traditional barriers and dive into a world where art, collectibles, and digital assets can be transformed into immediate value. <br />
                Our platform ensures secure, transparent, and prompt transactions, underpinned by the robustness of blockchain technology. <br />
                Unleash the power of your NFTs with NFTPawn - your partner in NFT-powered financial innovation. <br />
                <div className={styles.highlight}>Step into the future of lending today!</div>
            </div>
        </div>
    );
};

export default NotConnectedComponent;