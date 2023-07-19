export interface Loan {
    id: string,
    amount: string,
    duration: string,
    status: string,
    expires: string,
    interest: string, 
    borrower: string,
    nftId: string,
}

export interface InterestRate {
    duration: string,
    interest: string,
}

export interface Basket {
    id: string,
    address: string,
    owner: string,
    erc20: string,
    nft: string,
    availableLiquidity: string,
    minimumLoanAmount: number,
    interestRates: InterestRate[],
    paused: boolean,
    loans?: Loan[],
}