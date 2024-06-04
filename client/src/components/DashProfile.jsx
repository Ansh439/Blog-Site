import { Alert, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux' 
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js' 
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice.js'

export default function DashProfile() {
  const {currentUser} = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageUploadProgess, setImageUploadProgess] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess]  = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const filePickerRef = useRef()
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file){
      setImageFile(file)
      setImageFileUrl(URL.createObjectURL(file));
    }
  }

  useEffect(()=> {
    if(imageFile){
      uploadImage();
    }
  }, [imageFile])

  const uploadImage = async() => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if 
    //       request.resource.size < 2*1024*1024 && 
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
    setImageFileUploading(true)
    setImageUploadError(null)
    const storage = getStorage(app)
    const fileName = new Date().getTime() + imageFile.name 
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile)
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setImageUploadProgess(progress.toFixed(0))
      },
      (error) => {
        setImageUploadError("Please upload a file of less than 2MB size")
        setImageUploadProgess(null)
        setImageFile(null)
        setImageFileUrl(null)
        setImageFileUploading(false)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl)
          setFormData({...formData, profilePicture: downloadUrl})
          setImageFileUploading(false)
        })
        setImageUploadProgess(null)
      }
    )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if(Object.keys(formData).length === 0){
      setUpdateUserError("No changes made")
      return ;
    }
    if(imageFileUploading){
      setUpdateUserError("Please wait for the image to uplaod")
      return ;
    }
    try {
        dispatch(updateStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
        const data = await res.json();
        if(!res.ok){
          dispatch(updateFailure(data.message));
          setUpdateUserError(data.message);
        }else{
          dispatch(updateSuccess(data));
          setUpdateUserSuccess("User's Profile Updated Successfully")
        }
      } catch (error) {
        dispatch(updateFailure(error.message));
        setUpdateUserError(data.message);
    }
  }

  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => filePickerRef.current.click()}>
        {imageUploadProgess && (<CircularProgressbar 
        value={imageUploadProgess || 0} 
        text={`${imageUploadProgess}%`} 
        strokeWidth={5} 
        styles={{
          root: {
            width: '100%',
            height: '100%',
            position: 'absolute'
          },
          path: {
            stroke: `rgba(62, 152, 199, ${imageUploadProgess / 100})`
          }
        }}
        />)}
          <img 
          src={imageFileUrl || currentUser.profilePicture} 
          alt="user" 
          className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageUploadProgess && imageUploadProgess < 100 && 'opacity-60'}`}/>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        <TextInput placeholder='username' type='text' id='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput placeholder='email' type='email' id='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput placeholder='password' type='password' id='password' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-4'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}

    </div>
  )
}
