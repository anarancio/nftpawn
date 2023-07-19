declare global {
  interface Window {
    ethereum: any;
  }
}
import { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { IconNames } from "@blueprintjs/icons";
import { Button, Icon } from "@blueprintjs/core";
import PopupDialogHeaderComponent from './PopupDialogHeaderComponent';
import PopupDialogFooterComponent from './PopupDialogFooterComponent';
import PopupDialogContentComponent from './PopupDialogContentComponent';
import { closeDialog } from '../../features/dialog/dialogSlice';
import { AppState } from '../../store';
import globalStyles from '../../styles/GlobalComponents.module.css'
import { ethers } from 'ethers';
import { ERC721_ABI, BASKET_CONTRACT_ABI } from '../../abis/ABIs';

interface TakeLoanDialogProps {
  basketId: string,
}

const TakeLoanDialogComponent: FC<TakeLoanDialogProps> = ({basketId}) => {
    const dispatch = useDispatch() 

    const baskets = useSelector((state: AppState) => state.baskets)
    const selectedBasket = baskets.baskets.filter((basket: any) => basket.id==basketId)[0];
    
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState('form');
    const [nftAllowance, setNftAllowance] = useState(false);
    const [collateralNft, setCollateralNft] = useState('');
    const [loanDuration, setLoanDuration] = useState('');
    
    const tmpDurations = selectedBasket.interestRates.map((interestRate: any) => interestRate.duration);

    const approveNFT = async () => { 
      console.log('---------approveNFT----------');
      if (selectedBasket) { 
        const provider = new ethers.BrowserProvider(window.ethereum);    
        let signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(selectedBasket.nft, ERC721_ABI, signer);                                
        const tx = await contract.approve(selectedBasket.address, parseInt(collateralNft, 10));
        const txReceipt = await tx.wait();
        console.log(txReceipt);
        setNftAllowance(true); 
      } else {
        console.log('Basket not found');
      }
    }

    const takeLoan = async () => {
      console.log('---------takeLoan----------');
      console.log(`amount: ${amount}, collateralNft: ${collateralNft}, loanDuration: ${loanDuration}`);
      if (selectedBasket) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        let signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(selectedBasket.address, BASKET_CONTRACT_ABI, signer);
        const tx = await contract.createLoan(parseInt(loanDuration, 10), parseInt(amount, 10), parseInt(collateralNft, 10));
        const txReceipt = await tx.wait();
        console.log(txReceipt);
        dispatch(closeDialog(''));
      } else {
        console.log('Basket not found');
      }
    }

    const nextAction = async () => {
      console.log('---------nextAction----------');
      if (selectedBasket) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(selectedBasket.nft, ERC721_ABI, provider);
        const approvedTo = await contract.getApproved(parseInt(collateralNft, 10));
        if (approvedTo === selectedBasket.address) {
          setNftAllowance(true);
        }
      }
      setStep('allowance');
    }

    return (
        <div>
          <PopupDialogHeaderComponent>
            Take loan for basket #{basketId}
          </PopupDialogHeaderComponent>
          <PopupDialogContentComponent>
            <div style={{textAlign: 'left'}}>
              {step === 'form' ? (
                <div id="form">
                  <div>
                    <span>ERC20: </span> {selectedBasket.erc20}
                  </div>
                  <div>
                    <span>NFT: </span> {selectedBasket.nft}
                  </div>
                  <div>
                    <span>Current Liquidity: </span> {selectedBasket.availableLiquidity}
                  </div>
                  <div>
                    <span>Minumum loan amount: </span> {selectedBasket.minimumLoanAmount}
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="NFT if (collateral)" value={collateralNft} onChange={e => setCollateralNft(e.target.value)} />
                  </div>
                  <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="Loan duration" value={loanDuration} onChange={e => setLoanDuration(e.target.value)} />
                  </div>
                </div>
              ):(
                <div id="allowance">
                  <div>
                    You need to make an allowance of the NFT with id: #{collateralNft} first. 
                  </div>
                  <div>
                    <span>NFT: {selectedBasket.nft}</span>  
                    <span>
                        {nftAllowance ? (
                        <Icon icon={IconNames.TICK} intent="success" />
                        ) : (
                        <button className={globalStyles.actionButton} onClick={() => approveNFT()}>Make NFT allowance</button>
                        )}
                    </span>
                  </div>                  
                </div>
              )}
            </div>
          </PopupDialogContentComponent>
          <PopupDialogFooterComponent>
            <Button 
                  intent="primary" 
                  text="Cancel" 
                  icon={IconNames.CROSS} 
                  style={{marginRight: '10px'}} 
                  onClick={() => dispatch(closeDialog(''))} />
            {step === 'form' ? (
              <Button 
                intent="success" 
                text="Next" 
                icon={IconNames.TICK} 
                onClick={async () => {
                  await nextAction();
                }} />
            ):(
              <Button 
                  intent="success" 
                  text="Take Loan" 
                  disabled={!(nftAllowance)}
                  icon={IconNames.TICK} 
                  onClick={async () => {
                      await takeLoan();
                    }} />
            )}
          </PopupDialogFooterComponent>
        </div>
    );
};

export default TakeLoanDialogComponent;