import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import { useEffect, useRef, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux' 
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js' 
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart, updateSuccess, updateFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutSuccess } from '../redux/user/userSlice.js'

export default function DashProfile() {
  const {currentUser, error} = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageUploadProgess, setImageUploadProgess] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const [updateUserSuccess, setUpdateUserSuccess]  = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [showModal, setShowModal] = useState(false)
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

  const handleDeleteUser = async() => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json();
      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }else{
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignout = async(req, res, next) => {
    try {
      const res = await fetch('/api/user/signout', {
        method: "POST",
      })
      const data = res.json();
      if(res.ok){
        dispatch(signoutSuccess());
      }else{
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
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
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
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
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-gray-500 text-lg dark:text-gray-400'>Are you sure you want to delete this account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  )
}
