import {createHashRouter, NavLink, Outlet, RouterProvider, useLocation} from 'react-router-dom';
import './App.css';

import Main from './main/Main';
import Imt from './imt/Imt';
import Nback from './nback/Nback';
import Simon from './simon/Simon';
import Arcana from './arcana/Arcana';

function Layout() {
  const {pathname} = useLocation();
  const isMainPage = pathname === '/';

  return (<>
    <header>
      <h1>{isMainPage ? ('suraj') : (<NavLink to='/'>suraj</NavLink>)}</h1>
    </header>

    <Outlet/>

    <footer>
      <a href='https://t.me/Sxraj' target='_blank' rel='noopener noreferrer'>
        t.me/Sxraj
      </a>
    </footer>
  </>);
}

const router = createHashRouter([{
  path: '/', element: <Layout/>, children: [{
    index: true, element: <Main/>,
  }, {
    path: '/imt', element: <Imt/>,
  }, {
    path: '/nback', element: <Nback/>,
  }, {
    path: '/simon', element: <Simon/>,
  }, {
    path: '/arcana', element: <Arcana/>,
  }, {
    path: '*', element: <div style={{padding: '2rem', textAlign: 'center'}}>404: Страница не найдена</div>,
  }],
}]);

export default function App() {
  return (<RouterProvider router={router}/>);
}
