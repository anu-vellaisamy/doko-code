import React, { Fragment, useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FaceIcon from '@mui/icons-material/Face';
import "./UpdateProfile.css";
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from '../../action/userAction';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';





const UpdateProfile = () => {



    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);



    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [avatar, setAvatar] = useState("/Profile.png");
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png");



    const updateProfileSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();

        myForm.set( "name", name );
        myForm.set( "email", email );
        myForm.set( "avatar", avatar );
        dispatch(updateProfile(myForm));

    };


    const updateProfileDataChange = (e) => {
        
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);

                }
            };
            reader.readAsDataURL(e.target.files[0]);

        
    };


    useEffect(() => {


        if(user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }


        if(error){
            toast.error(error,{
                position:"bottom-center",
                theme:"colored"
            });
            dispatch(clearErrors());
        }



        if(isUpdated){
            toast.success("Profile Updated Successfully",{
                position: "bottom-center",
                theme: "dark"
            });

            dispatch(loadUser());
            navigate("/account");


            dispatch({
                type: UPDATE_PROFILE_RESET,
            });



        }

    }, [dispatch, error, user, isUpdated, navigate]);







    return (

        <Fragment>
            {loading ? <Loader /> : 

                        <Fragment>
                        <MetaData title="Update Profile" />
                            <div className="updateProfileContainer">
                                <div className="updateProfileBox"> 

                                    <h2 className='updateProfileheading'>Update Profile</h2>

                                    <form className="updateProfileForm"  encType="multipart/form-data" onSubmit={updateProfileSubmit}>
                                        <div className="updateProfileName">
                                            <FaceIcon />
                                            <input type="text" placeholder='Name' required name="name" value={name} onChange={(e)=> setName(e.target.value)} />
                                        </div>
                                        <div className="updateProfileEmail">
                                            <MailOutlineIcon />
                                            <input type="email" placeholder='Email' required name='email' value={email} onChange={(e)=> setEmail(e.target.value)} />
                                        </div>

                                        <div id="updateProfileImage">
                                            <img src={avatarPreview} alt="Avatar Preview" />
                                            <input type="file" name="avatar" accept="image/*" onChange={updateProfileDataChange} />
                                        </div>

                                        <input type="submit" value="Update" className='updateProfileBtn' />
                                        

                                    </form>
                                
                                </div>
                            </div>
                        </Fragment>
            }
        </Fragment>

    );
};

export default UpdateProfile;