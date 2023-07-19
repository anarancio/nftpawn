import { FC } from 'react';
import SidebarComponent from './SidebarComponent';
import HeaderComponent from './HeaderComponent';
import ContentComponent from './ContentComponent';

const DashboardComponent: FC = () => {

    return (
        <div>
            <SidebarComponent />
            <div className="wrapper d-flex flex-column min-vh-100 bg-light">
                <HeaderComponent />
                <ContentComponent />
            </div>
        </div>
    );
};

export default DashboardComponent;