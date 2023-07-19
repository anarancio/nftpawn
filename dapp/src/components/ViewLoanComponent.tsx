import { FC } from 'react';
import { useDispatch } from 'react-redux'

import LoanWidgetComponent from './LoanWidgetComponent';

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

interface ViewLoanProps {
    loan: Loan,
}

const ViewLoanComponent: FC<ViewLoanProps> = ({ loan }) => {
    const dispatch = useDispatch()

    return (
        <div>
            <LoanWidgetComponent loan={loan} />
        </div>
    );
};

export default ViewLoanComponent;