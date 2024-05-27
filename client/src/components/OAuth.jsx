import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import {GoogleAuthProvider, signInWithPopup, getAuth} from 'firebase/auth'
import {app} from '../firebase.js'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { signInSuccess } from '../redux/user/userSlice.js'


export default function OAuth() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoogleClick = async() => {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({prompt: 'select_account'})

      const auth = getAuth(app);

      try{
        const resultsFromGoogle = await signInWithPopup(auth, provider);
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            name: resultsFromGoogle.user.displayName,
            email: resultsFromGoogle.user.email,
            googlePhotoURL: resultsFromGoogle.user.photoURL,
          }),
        })

        const data = await res.json();

        if(res.ok){
          dispatch(signInSuccess(data));
          navigate('/');
        }
      }catch(error){
        console.log(error);
      }
    }

  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
