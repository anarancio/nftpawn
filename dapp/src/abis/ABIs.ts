export const LENDING_CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "AcceptedERC20PriceTimeLowZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AcceptedFloorPriceTimeLowZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AgreementAddressNotLendingContract",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "AgreementAddressZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BasketDeployerAddressNotLendingContract",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "BasketDeployerAddressZero",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "erc20",
          "type": "address"
        }
      ],
      "name": "ERC20NotEnabled",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "interestRangesLength",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "interestValuesLength",
          "type": "uint256"
        }
      ],
      "name": "InterestRangesAndValuesLengthNotMatch",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InterestRangesListEmpty",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InterestRangesLowZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InterestValuesLowZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "InterestValuesTooHighOneHundred",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NFTAgreementAddressNotSet",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "nft",
          "type": "address"
        }
      ],
      "name": "NFTNotEnabled",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotEnoughFundsToWithdraw",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PercentageOfFloorPriceTooHighOneHundred",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PercentageOfFloorPriceTooLow",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PlatformFeeTooHighOneHundred",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "PlatformFeeTooLowZero",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ToAddressZero",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_acceptedERC20PriceTime",
          "type": "uint256"
        }
      ],
      "name": "AcceptedERC20PriceTimeUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_acceptedFloorPriceTime",
          "type": "uint256"
        }
      ],
      "name": "AcceptedFloorPriceTimeUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_agreementAddress",
          "type": "address"
        }
      ],
      "name": "AgreementAddressUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_erc20",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_nft",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint64[]",
          "name": "_interestRanges",
          "type": "uint64[]"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_automaticApproval",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_acceptRefinance",
          "type": "bool"
        }
      ],
      "name": "BasketCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_basketDeployerAddress",
          "type": "address"
        }
      ],
      "name": "BasketDeployerAddressUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "_platformFees",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_erc20",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_priceOracle",
          "type": "address"
        }
      ],
      "name": "ERC20WhitelistedChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "_erc20",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "LendingWithdraw",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_nft",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "_aggregator",
          "type": "address"
        }
      ],
      "name": "NFTWhitelistedChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Paused",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "Unpaused",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "acceptedERC20PriceTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "acceptedFloorPriceTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "agreementAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "basketDeployerAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "baskets",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "_platformFee",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "_erc20",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_priceOracle",
          "type": "address"
        }
      ],
      "name": "changeERC20Whitelist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_enabled",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "_nft",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_aggregator",
          "type": "address"
        }
      ],
      "name": "changeNFTWhitelist",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc20",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_nft",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "_percentageOfFloorPrice",
          "type": "uint8"
        },
        {
          "internalType": "uint64[]",
          "name": "_interestRanges",
          "type": "uint64[]"
        },
        {
          "internalType": "uint8[]",
          "name": "_interestValues",
          "type": "uint8[]"
        },
        {
          "internalType": "bool",
          "name": "_automaticApproval",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "_acceptRefinance",
          "type": "bool"
        }
      ],
      "name": "createBasket",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "basketId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "basketAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc20",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_nftCollection",
          "type": "address"
        }
      ],
      "name": "getProtocolParams",
      "outputs": [
        {
          "internalType": "bool",
          "name": "_paused",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "_platformFee",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "_erc20Active",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "_acceptedFloorPriceTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_acceptedERC20PriceTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "_nftActive",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "_erc20OracleAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_floorPriceOracleAddress",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isProtocolPaused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pauseProtocol",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "reEnableProtocol",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_acceptedERC20PriceTime",
          "type": "uint256"
        }
      ],
      "name": "setAcceptedERC20PriceTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_acceptedFloorPriceTime",
          "type": "uint256"
        }
      ],
      "name": "setAcceptedFloorPriceTime",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_agreementAddress",
          "type": "address"
        }
      ],
      "name": "setAgreementAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_basketDeployerAddress",
          "type": "address"
        }
      ],
      "name": "setBasketDeployerAddress",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "whitelistedERC20s",
      "outputs": [
        {
          "internalType": "address",
          "name": "erc20Address",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "platformFees",
          "type": "uint8"
        },
        {
          "internalType": "address",
          "name": "priceOracle",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "whitelistedNFTs",
      "outputs": [
        {
          "internalType": "address",
          "name": "nftAddress",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "enabled",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "aggregator",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_erc20",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        }
      ],
      "name": "withdrawFees",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

export const BASKET_CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AddressZero",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "floorPrice",
        "type": "uint256"
      }
    ],
    "name": "AmountLessFloorPrice",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AmountLessZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DaysLessZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ERC20NotActive",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timeStampERC20USD",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "acceptedERC20PriceTime",
        "type": "uint256"
      }
    ],
    "name": "ERC20PriceOutdated",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "timeStampFloorETH",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "acceptedFloorPriceTime",
        "type": "uint256"
      }
    ],
    "name": "FloorPriceOutdated",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InterestLessZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InterestMoreOneHundred",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "interestDuration",
        "type": "uint64"
      }
    ],
    "name": "InterestRateNotEnabled",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "LendingProtocolPaused",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NFTNotActive",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "nftId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "approved",
        "type": "address"
      }
    ],
    "name": "NFTNotApproved",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoLiquidity",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotBasketOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotEnoughAllowance",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotEnoughBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "liquidity",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "NotEnoughLiquidity",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "nftId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "NotOwnerOfNFT",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_newLiquidity",
        "type": "uint256"
      }
    ],
    "name": "BasketDeposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "_days",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "_interestValue",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "_enabled",
        "type": "bool"
      }
    ],
    "name": "BasketInterestRatesUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_basketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "_status",
        "type": "uint8"
      }
    ],
    "name": "BasketStatusChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_basketId",
        "type": "uint256"
      }
    ],
    "name": "BasketWithdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_basketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_basketAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_loanId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_erc20",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_nftCollection",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_nftId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_borrower",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_lender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "_duration",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "_interest",
        "type": "uint8"
      }
    ],
    "name": "LoanCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_basketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_basketAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_loanId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_claimedBy",
        "type": "address"
      }
    ],
    "name": "LoanNFTClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_basketId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_basketAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_loanId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "_paymentBy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_amountPaid",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_remainingToPay",
        "type": "uint256"
      }
    ],
    "name": "LoanPayment",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "acceptRefinance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "activateBasket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "agreementAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "automaticApproval",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "claimNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_interestDuration",
        "type": "uint64"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_nftId",
        "type": "uint256"
      }
    ],
    "name": "createLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "depositLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "erc20",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "id",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_lending",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_erc20",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_nft",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_agreementAddress",
        "type": "address"
      },
      {
        "internalType": "uint8",
        "name": "_percentageOfFloorPrice",
        "type": "uint8"
      },
      {
        "internalType": "uint64[]",
        "name": "_interestRanges",
        "type": "uint64[]"
      },
      {
        "internalType": "uint8[]",
        "name": "_interestValues",
        "type": "uint8[]"
      },
      {
        "internalType": "bool",
        "name": "_automaticApproval",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "_acceptRefinance",
        "type": "bool"
      }
    ],
    "name": "init",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "name": "interestRates",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "interestValue",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "enabled",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lendingProtocolInspector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "liquidity",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "loans",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nftId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amountPaid",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "interestDuration",
        "type": "uint64"
      },
      {
        "internalType": "uint8",
        "name": "interestValue",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "interestAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "borrowerNFTId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lenderNFTId",
        "type": "uint256"
      },
      {
        "internalType": "enum IBasket.LoanStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "creationDate",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nftCollection",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pauseBasket",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "paused",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_agreementId",
        "type": "uint256"
      }
    ],
    "name": "pay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "percentageOfFloorPrice",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "status",
    "outputs": [
      {
        "internalType": "enum IBasket.BasketStatus",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint64",
        "name": "_days",
        "type": "uint64"
      },
      {
        "internalType": "uint8",
        "name": "_interestValue",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "_enabled",
        "type": "bool"
      }
    ],
    "name": "updateInterestRates",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "withdrawLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "total",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DECIMALS",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "NAME",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "SYMBOL",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "delegate",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "delegate",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenOwner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "buyer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "numTokens",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const ERC721_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name_",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol_",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSymbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];