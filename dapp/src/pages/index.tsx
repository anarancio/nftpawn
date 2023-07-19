import type { NextPage } from 'next'
import { useSelector, useDispatch } from 'react-redux'
import { ToastContainer } from 'react-toastify';

import { AppState } from '../store'
import PopupDialogComponent from '../components/PopupDialogComponent';

import 'react-toastify/dist/ReactToastify.css';
import NotConnectedComponent from '../components/NotConnectedComponent';
import DashboardComponent from '../components/DashboardComponent';

const AppComponent: NextPage = () => {
  const isLoggedIn = useSelector((state: AppState) => state.auth.isLoggedIn)
  
  const dispatch = useDispatch()

  /* useEffect(() => {
    dispatch(listProjects())
  }, [dispatch]); */

  let component = <NotConnectedComponent />
  if (isLoggedIn) {
    component = <DashboardComponent />
  }

  return (
    <div>
        {component}
        <PopupDialogComponent />
        <ToastContainer />
    </div>
  )
}

export default AppComponent
