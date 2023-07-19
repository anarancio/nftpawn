declare global {
  interface Window {
    ethereum: any;
  }
}
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import PopupDialogHeaderComponent from './PopupDialogHeaderComponent';
import PopupDialogFooterComponent from './PopupDialogFooterComponent';
import PopupDialogContentComponent from './PopupDialogContentComponent';
import { closeDialog } from '../../features/dialog/dialogSlice';
import globalStyles from '../../styles/GlobalComponents.module.css'
import { ERC20_ABI, BASKET_CONTRACT_ABI } from '../../abis/ABIs';
import { AppState } from '../../store';
import { ethers } from 'ethers';
import { updateBasketLiquidity } from '../../features/baskets/basketsSlice';

interface DepositDialogProps {
  basketId: string,
}

const DepositDialogComponent: FC<DepositDialogProps> = ({basketId}) => {
    const dispatch = useDispatch()    
    
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState('form');
    const [allowance, setAllowance] = useState(false);

    const baskets = useSelector((state: AppState) => state.baskets)
    const basket = baskets.baskets.find((b:any) => b.id === basketId);
    const provider = new ethers.BrowserProvider(window.ethereum);

    const approveTokens = async () => { 
      console.log('---------approveTokens----------');
      if (basket) {        
        let signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(basket.erc20, ERC20_ABI, signer);                                
        const tx = await contract.approve(basket.address, amount);
        const txReceipt = await tx.wait();
        console.log(txReceipt);
        setAllowance(true); 
      } else {
        console.log('Basket not found');
      }
    }  

    const makeDeposit = async () => {
      console.log('---------makeDeposit----------');
      if (basket) {
        let signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(basket.address, BASKET_CONTRACT_ABI, signer);
        const tx = await contract.depositLiquidity(parseInt(amount, 10));
        const txReceipt = await tx.wait();
        console.log(txReceipt);

        // retrieve the updated basket liquidity
        const basketContract = new ethers.Contract(basket.address, BASKET_CONTRACT_ABI, provider);
        const liquidity = await basketContract.liquidity();
        console.log(liquidity);

        // update the basket liquidity in the store
        dispatch(updateBasketLiquidity({id: basketId, liquidity: liquidity.toString()}));

        dispatch(closeDialog(''));
      } else {
        console.log('Basket not found');
      }
    }

    return (
        <div>
          <PopupDialogHeaderComponent>
            Make a deposit on Basket #{basketId}
          </PopupDialogHeaderComponent>
          <PopupDialogContentComponent>
            <div style={{textAlign: 'left'}}>
              {step === 'form' ? (
                <div id="form">
                  <div>Specify the amount you want to deposit:</div>
                  <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>
                </div>
              ):(
                <div id="allowance">
                  You need to make an allowance of {amount} Tokens first. 
                  {(allowance) ? (
                    <Icon icon={IconNames.TICK} intent="success" />
                  ) : (
                    <button className={globalStyles.actionButton} onClick={() => approveTokens()}>Make the allowance</button>
                  )}
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
                  console.log('---------Next----------');
                  if (basket) {
                    const contract = new ethers.Contract(basket.erc20, ERC20_ABI, provider);
                    const allowance = await contract.allowance(window.ethereum.selectedAddress, basket.address);
                    const allowanceInt = parseInt(allowance.toString(), 10);
                    const amountInt = parseInt(amount, 10);
                    if (allowanceInt >= amountInt) {
                      setAllowance(true); 
                    }                    
                  }
                  setStep('allowance');
                }} />
            ):(
              <Button 
                  intent="success" 
                  text="Make the deposit" 
                  disabled={!(allowance)}
                  icon={IconNames.TICK} 
                  onClick={async () => {
                      // deposit function call here
                      await makeDeposit();
                    }} />
            )}
          </PopupDialogFooterComponent>
        </div>
    );
};

export default DepositDialogComponent;