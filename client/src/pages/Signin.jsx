import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function Signin() {
  const [formData, setFormData] = useState({});
  const {loading, error: errMessage} = useSelector(state => state.user);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value.trim()});
  }


  const handelSubmit = async(e) => {
    e.preventDefault();

    if(!formData.email || !formData.password){
      return dispatch(signInFailure("Please fill out all the fields"));
    }

    try{
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(formData),
      })
      const data = await res.json();
      // console.log(data);
      if(data.success === false){
        dispatch(signInFailure(data.message));
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        navigate('/');
      }
    }catch(err){
      dispatch(signInFailure(err.message));
    }
  }


  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to='/' className='font-bold dark:text-white text-4xl'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
                  Ansh
              </span>
              Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project based on mern stack. I would love to complete it to learn all the basics of Web Dev.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handelSubmit}>
            <div>
              <Label value='Enter Email' />
              <TextInput
              type='email'
              placeholder="email"
              id="email"
              onChange={handleChange}
              />
            </div>
            <div>
              <Label value='Enter Password' />
              <TextInput
              type='password'
              placeholder="password"
              id="password"
              onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>                    
                ) : 'Sign In'
              }
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Don't have an acoount?</span>
            <Link to='/sign-up' className='text-blue-500'>
              Sign Up
            </Link>
          </div>
          {
            errMessage && (
              <Alert className='mt-5' color='failure'>
                {errMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )

}
