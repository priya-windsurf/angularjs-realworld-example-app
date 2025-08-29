import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { ShowAuthed } from './ShowAuthed';
import { APP_NAME } from '../utils/constants';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string): string => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          {APP_NAME.toLowerCase()}
        </Link>

        <ShowAuthed when={false}>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/login')}`} to="/login">
                Sign in
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/register')}`} to="/register">
                Sign up
              </Link>
            </li>
          </ul>
        </ShowAuthed>

        <ShowAuthed when={true}>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/editor')}`} to="/editor">
                <i className="ion-compose"></i>&nbsp;New Article
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/settings')}`} to="/settings">
                <i className="ion-gear-a"></i>&nbsp;Settings
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive(`/@${user?.username}`)}`}
                to={`/@${user?.username}`}
              >
                <img src={user?.image} className="user-pic" alt="" />
                {user?.username}
              </Link>
            </li>
          </ul>
        </ShowAuthed>
      </div>
    </nav>
  );
};
