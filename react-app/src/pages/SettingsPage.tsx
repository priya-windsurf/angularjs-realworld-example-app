import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AppDispatch, RootState } from '../store';
import { updateUser, logout } from '../store/authSlice';

interface SettingsFormData {
  image: string;
  username: string;
  bio: string;
  email: string;
  password: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormData>();

  useEffect(() => {
    if (user) {
      setValue('image', user.image || '');
      setValue('username', user.username || '');
      setValue('bio', user.bio || '');
      setValue('email', user.email || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      const updateData = {
        image: data.image,
        username: data.username,
        bio: data.bio,
        email: data.email,
        ...(data.password && { password: data.password }),
      };
      
      await dispatch(updateUser(updateData)).unwrap();
      navigate(`/profile/${data.username}`);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

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
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    {...register('image')}
                  />
                </fieldset>
                
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    {...register('username', { required: 'Username is required' })}
                  />
                  {errors.username && (
                    <div className="error-message">{errors.username.message}</div>
                  )}
                </fieldset>
                
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    {...register('bio')}
                  ></textarea>
                </fieldset>
                
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
                    {...register('password')}
                  />
                </fieldset>
                
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Update Settings'}
                </button>
              </fieldset>
            </form>

            <hr />

            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
