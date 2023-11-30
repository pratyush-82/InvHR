import { useLocation, matchPath } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function useActiveLink(path, deep = true) {
  const { pathname } = useLocation();


  const isExcludedPath = path === '/dashboard/employee' && pathname === '/dashboard/employee/profile';

  const normalActive = !isExcludedPath && path ? !!matchPath({ path, end: true }, pathname) : false;

  const deepActive = !isExcludedPath && path ? !!matchPath({ path, end: false }, pathname) : false;

  return {
    active: deep ? deepActive : normalActive,
    isExternalLink: path.includes('http'),
  };
}
