import React from 'react'
import {Sidebar, SidebarItem} from 'flowbite-react'
import { HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('')
    const dispatch = useDispatch();
    const {currentUser} = useSelector((state) => state.user);
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if(tabFromUrl){
          setTab(tabFromUrl);
        };
    }, [location.search])

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
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                <Link to='/dashboard?tab=profile'>
                    <SidebarItem active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor="dark" as="div">
                        Profile
                    </SidebarItem>
                </Link>
                {
                  currentUser.isAdmin && (
                    <>
                      <Link to='/dashboard?tab=posts'>
                        <SidebarItem active={tab === 'posts'} icon={HiDocumentText} as="div">
                            Posts
                        </SidebarItem>
                      </Link>  
                      <Link to='/dashboard?tab=users'>
                        <SidebarItem active={tab === 'users'} icon={HiOutlineUserGroup} as="div">
                            Users
                        </SidebarItem>
                      </Link>  
                    </>
                  )
                }
                <SidebarItem icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
                    Signout
                </SidebarItem>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
