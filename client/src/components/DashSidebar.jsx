import React from 'react'
import {Sidebar, SidebarItem, SidebarItemGroup} from 'flowbite-react'
import { HiArrowSmRight, HiUser} from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashSidebar() {
    const location = useLocation();
    const [tab, setTab] = useState('')
    const dispatch = useDispatch();
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
            <SidebarItemGroup>
                <Link to='/dashboard?tab=profile'>
                    <SidebarItem active={tab === 'profile'} icon={HiUser} label="user" labelColor="dark" as="div">
                        Profile
                    </SidebarItem>
                </Link>
                <SidebarItem icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignout}>
                    Signout
                </SidebarItem>
            </SidebarItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
