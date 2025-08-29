import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '../store';
import { loginUser, registerUser } from '../store/authSlice';

interface AuthPageProps {
  type: 'login' | 'register';
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

type FormData = LoginFormData | RegisterFormData;

const AuthPage: React.FC<AuthPageProps> = ({ type }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      if (type === 'login') {
        await dispatch(loginUser(data as LoginFormData)).unwrap();
      } else {
        await dispatch(registerUser(data as RegisterFormData)).unwrap();
      }
      navigate('/');
    } catch (error) {
      console.error('Authentication failed:', error);
    }
  };

  const isLogin = type === 'login';

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">{isLogin ? 'Sign in' : 'Sign up'}</h1>
            <p className="text-xs-center">
              {isLogin ? (
                <Link to="/register">Need an account?</Link>
              ) : (
                <Link to="/login">Have an account?</Link>
              )}
            </p>

            {error && (
              <ul className="error-messages">
                {typeof error === 'string' ? (
                  <li>{error}</li>
                ) : (
                  Object.entries(error).map(([key, messages]) => (
                    <li key={key}>
                      {key} {Array.isArray(messages) ? messages.join(', ') : String(messages)}
                    </li>
                  ))
                )}
              </ul>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              {!isLogin && (
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    {...register('username', { required: 'Username is required' })}
                  />
                  {'username' in errors && errors.username && (
                    <div className="error-message">{errors.username.message}</div>
                  )}
                </fieldset>
              )}
              
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <div className="error-message">{errors.email.message}</div>
                )}
              </fieldset>
              
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <div className="error-message">{errors.password.message}</div>
                )}
              </fieldset>
              
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : (isLogin ? 'Sign in' : 'Sign up')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
