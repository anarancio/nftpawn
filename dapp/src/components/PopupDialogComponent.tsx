// components/HeaderComponent.tsx
import { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Dialog } from "@blueprintjs/core";
import { closeDialog } from '../features/dialog/dialogSlice'
import { AppState } from '../store'

import DepositDialogComponent from './dialogs/DepositDialogComponent';

import { 
    DEPOSIT_DIALOG,
    PAYMENT_DIALOG,
    TAKE_LOAN_DIALOG,
    CREATE_BASKET_DIALOG } from '../constants/index'
import PayDialogComponent from './dialogs/PayDialogComponent';
import TakeLoanDialogComponent from './dialogs/TakeLoanDialogComponent';
import CreateBasketDialogComponent from './dialogs/CreateBasketDialogComponent';

const PopupDialogComponent: FC = () => {
    const { isOpen, componentName, data } = useSelector((state: AppState) => state.dialog);
    console.log('------------PopupDialogComponent----------');
    console.log(data)
    const dispatch = useDispatch()

    let componentToRender;
    switch (componentName) {
        case DEPOSIT_DIALOG:
            componentToRender = <DepositDialogComponent basketId={data} />
            break;
        case PAYMENT_DIALOG:
            componentToRender = <PayDialogComponent loanId={data} />
            break;
        case TAKE_LOAN_DIALOG:
            componentToRender = <TakeLoanDialogComponent basketId={data} />
            break;
        case CREATE_BASKET_DIALOG:
            componentToRender = <CreateBasketDialogComponent />
            break;
    }

    return (
        <Dialog isOpen={isOpen} onClose={() => dispatch(closeDialog(''))}>
          {componentToRender}         
        </Dialog>
    );
};

export default PopupDialogComponent;