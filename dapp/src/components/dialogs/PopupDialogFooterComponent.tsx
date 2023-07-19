// components/HeaderComponent.tsx
import { FC, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import styles from '../../styles/dialogs/PopupDialogFooterComponent.module.css'

interface PopupDialogFooterComponent {
    children: ReactNode;
}

const PopupDialogFooterComponent: FC<PopupDialogFooterComponent> = ({children}) => {
    return (
        <div className={styles.popupFooter}>
          {children}
        </div>
    );
};

export default PopupDialogFooterComponent;