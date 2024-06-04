import { Alert, Button, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux' 
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js' 
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const {currentUser} = useSelector(state => state.user)
  const [imageFile, setImageFile] = useState(null)
  const [imageFileUrl, setImageFileUrl] = useState(null)
  const [imageUploadProgess, setImageUploadProgess] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(null)
  const filePickerRef = useRef()

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl)
        })
        setImageUploadProgess(null)
      }
    )
  }

  return (
    <div className='max-w-lg mx-auto w-full p-3'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        <TextInput placeholder='username' type='text' id='username' defaultValue={currentUser.username} />
        <TextInput placeholder='email' type='email' id='email' defaultValue={currentUser.email} />
        <TextInput placeholder='password' type='password' id='password' />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline>
          Update
        </Button>
        <div className='text-red-500 flex justify-between mt-4'>
          <span className='cursor-pointer'>Delete Account</span>
          <span className='cursor-pointer'>Sign Out</span>
        </div>
      </form>
    </div>
  )
}
