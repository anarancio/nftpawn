import { FC } from 'react';
import { useSelector } from 'react-redux'
import { AppState } from '../store';
import BasketWidgetComponent from './BasketWidgetComponent';

const BasketExplorerComponent: FC = () => {
    const baskets = useSelector((state: AppState) => state.baskets)

    return (
        <div style={{padding: '10px'}}>
            <h1>Baskets Explorer</h1>
            {baskets.baskets.map(basket =>
                <BasketWidgetComponent key={basket.id} basket={basket} />
            )}
        </div>
    );
};

export default BasketExplorerComponent;