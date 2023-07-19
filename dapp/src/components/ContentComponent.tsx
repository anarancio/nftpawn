// components/ContentComponent.tsx
import { FC } from 'react';
import { useSelector } from 'react-redux'
import { AppState } from '../store';
import { 
    PAGE_MAIN, 
    PAGE_BASKETS_EXPLORER, 
    PAGE_VIEW_BASKET, 
    PAGE_VIEW_LOAN } from '../constants';

import styles from '../styles/ContentComponent.module.css'
import DefaultContentComponent from './DefaultContentComponent';
import BasketExplorerComponent from './BasketExplorerComponent';
import BasketDetailComponent from './BasketDetailComponent';
import ViewLoanComponent from './ViewLoanComponent';

const ContentComponent: FC = () => {
    const contentConfig = useSelector((state: AppState) => state.content)

    let component = <div></div>
    switch (contentConfig.name) {
        case PAGE_MAIN:
            component = <DefaultContentComponent />
            break;
        case PAGE_BASKETS_EXPLORER:
            component = <BasketExplorerComponent />
            break;
        case PAGE_VIEW_BASKET:
            component = <BasketDetailComponent basket={contentConfig.data} />
            break;
        case PAGE_VIEW_LOAN:
            component = <ViewLoanComponent loan={contentConfig.data} />
            break;
        default:
            break;
    }

    return (
        <div className={styles.content}>
            {component}
        </div>
    );
};

export default ContentComponent;