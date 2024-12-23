import {React, useEffect, useState} from "react";
import Navbar from "../components/Navbar";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <Navbar/>
      <main className="flex flex-1 justify-center mt-20">
        <div className="flex flex-col mr-64 ml-64 w-full bg-green-100">
          <h1 className="text-gray-200 text-3xl mt-8">
            My Profile
          </h1>
          <div className="bg-red-300 w-full">
            Hey
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage