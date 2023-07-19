// components/HeaderComponent.tsx
import { FC, ReactNode } from 'react';

import styles from '../../styles/dialogs/PopupDialogHeaderComponent.module.css'

interface PopupDialogHeaderComponentProps {
    children: ReactNode;
}

const PopupDialogHeaderComponent: FC<PopupDialogHeaderComponentProps> = ({children}) => {
    return (
        <div className={styles.popupHeader}>
          {children}
        </div>
    );
};

export default PopupDialogHeaderComponent;