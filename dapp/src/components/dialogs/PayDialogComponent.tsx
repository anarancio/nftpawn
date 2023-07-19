import { FC, useState } from 'react';
import { useDispatch } from 'react-redux'
import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import PopupDialogHeaderComponent from './PopupDialogHeaderComponent';
import PopupDialogFooterComponent from './PopupDialogFooterComponent';
import PopupDialogContentComponent from './PopupDialogContentComponent';
import { closeDialog } from '../../features/dialog/dialogSlice';
import globalStyles from '../../styles/GlobalComponents.module.css'
import { addJob, removeJob } from '../../features/progress/progressSlice';
import { DEPOSITING_LIQUIDITY_JOB } from '../../constants/index';

interface PayDialogProps {
  loanId: string,
}

const PayDialogComponent: FC<PayDialogProps> = ({loanId}) => {
    const dispatch = useDispatch()    
    
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState('form');
    const [allowance, setAllowance] = useState(false);

    return (
        <div>
          <PopupDialogHeaderComponent>
            Make a payment on Loan #{loanId}
          </PopupDialogHeaderComponent>
          <PopupDialogContentComponent>
            <div style={{textAlign: 'left'}}>
              {step === 'form' ? (
                <div id="form">
                  <div>Specify the amount you want to pay (XXX tokens remaining):</div>
                  <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>
                </div>
              ):(
                <div id="allowance">
                  You need to make an allowance of {amount} Tokens first. 
                  {allowance ? (
                    <Icon icon={IconNames.TICK} intent="success" />
                  ) : (
                    <span><button className={globalStyles.actionButton} onClick={() => setAllowance(true)}>Make the allowance</button></span>
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
                onClick={() => {
                  setStep('allowance');
                  // we can dispatch extra actions here
                }} />
            ):(
              <Button 
                  intent="success" 
                  text="Make the payment" 
                  disabled={!allowance}
                  icon={IconNames.TICK} 
                  onClick={() => {
                      // deposit function call here
                      dispatch(closeDialog(''))
                    }} />
            )}
          </PopupDialogFooterComponent>
        </div>
    );
};

export default PayDialogComponent;