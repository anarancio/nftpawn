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
import { InterestRate } from '../../model/BasketTypes';
import { ethers } from 'ethers';
import { LENDING_CONTRACT_ABI } from '../../abis/ABIs';
import { LENDING_CONTRACT_ADDRESS, CREATING_BASKET_JOB } from '../../constants/index';
import { AppState } from '../../store';

const CreateBasketDialogComponent: FC = () => {
    const dispatch = useDispatch()   
    
    const [erc20Token, setErc20Token] = useState('');
    const [erc721Token, setErc721Token] = useState('');
    const [percentage, setPercentage] = useState('');
    const [duration, setDuration] = useState('');
    const [interest, setInterest] = useState('');
    const [durations, setDurations] = useState<InterestRate[]>([]);

    const addDuration = () => {
        setDurations((current) => [...current, {duration, interest}]);
        setDuration('');
        setInterest('');
    }

    const createBasket = async () => {
        const durationsArray = durations.map((duration) => duration.duration);
        const interestsArray = durations.map((duration) => duration.interest);
        const provider = new ethers.BrowserProvider(window.ethereum);
        console.log(provider);
        let signer = await provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(LENDING_CONTRACT_ADDRESS, LENDING_CONTRACT_ABI, signer);                                
        const tx = await contract.createBasket(erc20Token, erc721Token, percentage, durationsArray, interestsArray, true, false);
        const txReceipt = await tx.wait();
        console.log(txReceipt);
        dispatch(closeDialog(''));
    }

    return (
        <div>
          <PopupDialogHeaderComponent>
            Create a new basket
          </PopupDialogHeaderComponent>
          <PopupDialogContentComponent>
            <div style={{textAlign: 'left'}}>
                <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="ERC20 Token Address" value={erc20Token} onChange={e => setErc20Token(e.target.value)} />
                </div>
                <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="ERC721 Token Address" value={erc721Token} onChange={e => setErc721Token(e.target.value)} />
                </div>
                <div style={{marginTop: '10px'}}>
                    <input type="text" placeholder="Percentage of floor price" value={percentage} onChange={e => setPercentage(e.target.value)} />
                </div>
                <div style={{marginTop: '10px'}}>
                    <div>
                        <input type="text" placeholder="Duration" value={duration} onChange={e => setDuration(e.target.value)} /> 
                        <input type="text" placeholder="Interest" value={interest} onChange={e => setInterest(e.target.value)} style={{marginLeft: '10px'}} /> 
                        <button style={{marginLeft: '10px'}} onClick={() => addDuration()}>Add</button>
                    </div>
                    <div>
                        {durations.map((duration, index) => {
                            return (
                                <div key={index} style={{marginTop: '10px'}}>
                                    <span>{duration.duration} days - </span>
                                    <span style={{marginLeft: '10px'}}>{duration.interest}%</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
          </PopupDialogContentComponent>
          <PopupDialogFooterComponent>
            <Button 
                  intent="primary" 
                  text="Cancel" 
                  icon={IconNames.CROSS} 
                  style={{marginRight: '10px'}} 
                  onClick={() => dispatch(closeDialog(''))} />
            <Button 
                  intent="success" 
                  text="Create Basket" 
                  icon={IconNames.TICK} 
                  onClick={async () => {
                      await createBasket();
                    }} />
          </PopupDialogFooterComponent>
        </div>
    );
};

export default CreateBasketDialogComponent;