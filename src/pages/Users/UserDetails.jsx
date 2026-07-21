import React, { useEffect } from 'react'
import Header from '../../components/Header'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { useUserData } from '../../Store/Selectors/Users/Users_Selector';
import moment from 'moment';
import { assets } from '../../assets/images/assets'
import { usersGetOne } from '../../Store/Action/Users/User_Action';

const Info = ({ label, value }) => (
  <div>
    <span className="block text-12 md:text-14 text-g7 mb-1">{label}</span>
    <span className="text-14 md:text-16 font-semibold text-g1">
      {value || "-"}
    </span>
  </div>
)
const UserDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const userData = useUserData()
  const GetUserData = async () => {
    try {
      const payload = { userId: id, }
      await dispatch(usersGetOne(payload))
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => { id && GetUserData() }, [id])


  return (
    <>
      <Header name="Users" />
      <div className="p-5 lg:p-7 mx-auto">
        {/* Top Bar */}
        <div className="flex items-center space-x-3 mb-6">
          <Link to="../users" className="icon-arrow-right rotate-180 text-20" />
          <h2 className="text24 font-bold text-g1">User Details</h2>
        </div>

        {/* PROFILE CARD */}
        <div className="bg-l4 rounded-xl p-5 mb-8 flex items-center space-x-5">
          <img
            src={userData?.profileimage ? `${import.meta.env.VITE_BUCKET_URL}${userData?.profileimage}` : assets.userDefaultImg}
            className="w-16 h-16 rounded-full object-cover"
            alt="profile"
          />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-g1">
              {userData?.fullname || "-"}
              {userData?.nickname && (
                <span className="text-sm text-g6 ml-2">
                  ({userData.nickname})
                </span>
              )}
            </h3>

            <div className="flex flex-wrap items-center space-x-3 mt-2 text-sm">
              <span
                className={`px-3 py-1 rounded-md ${userData?.account_status
                  ? "bg-green/15 text-green"
                  : "bg-red/15 text-red"
                  }`}
              >
                {userData?.account_status ? "Active" : "Inactive"}
              </span>

              <span className="text-g6">
                Joined:{" "}
                {userData?.createdAt
                  ? moment(userData.createdAt).format("DD MMM YYYY")
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="bg-l4 rounded-xl p-5 mb-8 flex flex-wrap -mx-2">
          <div className='w-full md:w-1/2 xl:w-1/4 p-2'>
            <span className="block text-12 md:text-14 text-g7 mb-1">Mobile No.</span>
            <span className="text-14 md:text-16 font-semibold text-g1">
              {userData?.mobile ? `${userData.country_code} ${userData.mobile}` : "-"}
            </span>
          </div>
          <div className='w-full md:w-1/2 xl:w-1/4 p-2'>
            <span className="block text-12 md:text-14 text-g7 mb-1">Email</span>
            <span className="text-14 md:text-16 font-semibold text-g1">
              {userData?.email || "-"}
            </span>
          </div>
          <div className='w-full md:w-1/2 xl:w-1/4 p-2'>
            <span className="block text-12 md:text-14 text-g7 mb-1">Gender</span>
            <span className="text-14 md:text-16 font-semibold text-g1">
              {userData?.gender || "-"}
            </span>
          </div >
          <div className='w-full md:w-1/2 xl:w-1/4 p-2'>
            <span className="block text-12 md:text-14 text-g7 mb-1">Date of Birth</span>
            <span className="text-14 md:text-16 font-semibold text-g1">
              {userData?.dob || "-"}
            </span>
          </div >
        </div >

        {/* ABOUT & PREFERENCES */}
        <div className="bg-l4 rounded-xl p-5 mb-8 flex flex-wrap -mx-2" >
          <div className='w-full md:w-1/2 p-2'>
            <span className="block text-12 md:text-14 text-g7 mb-1">About Me</span>
            <span className="text-14 md:text-16 font-semibold text-g1">
              {userData?.aboutme || "-"}
            </span>
          </div >
          <div className='w-full md:w-1/2 p-2'>
            <span className="block text-12 md:text-14 text-g7 mb-1">Interested In</span>
            <span className="text-14 md:text-16 font-semibold text-g1">
              {userData?.interestedin ? `${userData?.interestedin || "-"} (${userData?.interestedagerangemin || "-"} - ${userData?.interestedagerangemax || "-"})` : "-"}
            </span>
          </div>
        </div>

        {/* BUSINESS PROFILE */}
        {
          userData?.business && (
            <div className="bg-l4 rounded-xl p-5 mb-8">
              <h3 className="text-lg font-semibold text-g1 mb-4">
                Business Profile
              </h3>

              <div className="flex items-center space-x-4">
                <img
                  src={userData.business.profileimage ? `${import.meta.env.VITE_BUCKET_URL}${userData.business.profileimage}` : assets.userDefaultImg}
                  className="w-14 h-14 rounded-full object-cover"
                  alt="business"
                />

                <div>
                  <p className="font-semibold text-g1">
                    {userData.business.name}
                  </p>
                  <p className="text-sm text-g6">
                    Categories: {userData?.business?.categories
                      ?.map((cat) => {
                        const parentName = cat?.parent_category?.name;
                        const childNames = cat?.child_categories?.map((c) => c.name).join(", ");
                        return childNames ? `${parentName} (${childNames})` : parentName;
                      })
                      .join(", ")}
                  </p>
                </div>

              </div>

              <div className="bg-white rounded-xl p-5 mb-8 flex flex-wrap -mx-2">
                <div className='p-2 w-full md:w-1/2 xl:w-1/4'>
                  <span className="block text-12 md:text-14 text-g7 mb-1">Mobile No.</span>
                  <span className="text-14 md:text-16 font-semibold text-g1">
                    {userData?.business?.mobile ? `${userData?.business?.mobile_country_code} ${userData?.business?.mobile}` : "-"}
                  </span>
                </div>
                <div className='p-2 w-full md:w-1/2 xl:w-1/4'>
                  <span className="block text-12 md:text-14 text-g7 mb-1">Whatsapp Mobile No.</span>
                  <span className="text-14 md:text-16 font-semibold text-g1">
                    {userData?.business?.wamobile ? `${userData?.business?.wamobile_country_code} ${userData?.business?.wamobile}` : "-"}
                  </span>
                </div>
                <div className='p-2 w-full md:w-1/2 xl:w-1/4'>
                  <span className="block text-12 md:text-14 text-g7 mb-1">Email</span>
                  <span className="text-14 md:text-16 font-semibold text-g1">
                    {userData?.business?.email || "-"}
                  </span>
                </div>
                <div className='p-2 w-full md:w-1/2 xl:w-1/4'>
                  <span className="block text-12 md:text-14 text-g7 mb-1">Website</span>
                  <span className="text-14 md:text-16 font-semibold text-g1">
                    {userData?.business?.website ? <Link to={userData?.business?.website} target="_blank" rel="noopener noreferrer">{userData?.business?.website}</Link> : "-"}
                  </span>
                </div>
              </div>
            </div>
          )
        }
      </div >
    </>
  )
}

export default UserDetails