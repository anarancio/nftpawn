// components/HeaderComponent.tsx
import { FC, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import styles from '../../styles/dialogs/PopupDialogContentComponent.module.css'

interface PopupDialogContentComponentProps {
    children: ReactNode;
}

const PopupDialogContentComponent: FC<PopupDialogContentComponentProps> = ({children}) => {
    return (
        <div className={styles.popupContent}>
          {children}
        </div>
    );
};

export default PopupDialogContentComponent;