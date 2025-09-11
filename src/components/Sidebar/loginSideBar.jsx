import React from "react";
import loginImage from "../../assets/images/7287aa262d3a37ec898dc0c0f923e5e5b0b3d98e.png";
import messageIcon from "../../assets/images/path.png";
import whatsappIcon from "../../assets/images/fc639e8464412cb2d3ca92525705624a1b7a028b.png";
import emailIcon from "../../assets/images/5e977ac8834955a36fb3ea1c9688a7e818304764.png";


const LoginSideBar = () => {
    return (
      <div className="hidden lg:flex w-1/2 bg-[#D1C5FD] items-center justify-center p-10 z-0">
        <div className="border-8 border-purple-500 rounded-t-[50%] bg-gradient-to-b from-[#F6F0FF] to-[#E9E0FF]">
          <div className="bg-white rounded-t-[50%] w-[420px] h-[520px] overflow-hidden shadow-md">
            <img
              src={loginImage}
              alt="People using phones"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
        <img
          src={messageIcon}
          alt=""
          className="absolute bottom-2 left-[36%] z-10"
        />
        <div className="p-4 absolute rounded-full bg-[#D1C5FD] border-4 border-solid border-white left-[5%] bottom-[20%]">
          <img src={whatsappIcon} alt="" className="w-20 h-20" />
        </div>
        <div className="p-4 absolute rounded-full bg-[#D1C5FD] border-4 border-solid border-white left-[36%] top-[30%]">
          <img src={emailIcon} alt="" className="w-20 h-20" />
        </div>
      </div>
    );
}

export default LoginSideBar;