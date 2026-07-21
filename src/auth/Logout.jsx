import React from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../Store/Action/Auth/Auth_Action';

const Logout = ({ onClose }) => {
    const dispatch = useDispatch();

    const handleLogOut = () => {
        try {
            dispatch(logoutUser());
            toast.success("Admin Logout Successfully...!");
            location.reload();
        } catch (error) {
            console.log(error);
        } 
    };
    return (
        <>
            <div className="fixed h-screen inset-0 bg-g1/30 backdrop-blur-sm py-24 px-8 z-50 flex items-center justify-center overflow-y-auto">
                <div className="bg-white w-full max-w-[420px] rounded-xl lg:rounded-2xl 2xl:rounded-[30px] px-5 lg:px-7 xl:px-9 py-3.5 lg:py-5 xl:py-7 mb-auto">
                    <div className="flex items-center justify-end mb-3.5 lg:mb-5">
                        <span className="icon-close text-[24px] text-[#B01212] cursor-pointer" onClick={onClose}></span>
                    </div>
                    <div className='mb-4'>
                        {/* <img src={assets.logout} alt="logout" className='mx-auto' /> */}
                    </div>
                    <div className='relative'>
                        <p className="text-b8 font-semibold text-16 lg:text-18 2xl:text-20 text-center">Are you sure want to Logout?</p>
                    </div>
                    <div className="w-full max-w-[200px] mx-auto mt-4 lg:mt-6">
                        <button type='submit' className="btn_primary hover:bg-white hover:text-primary hover:border-primary" onClick={handleLogOut}>Yes, Logout</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Logout