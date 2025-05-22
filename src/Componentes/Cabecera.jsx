import React, { useState } from "react";
import "./Cabecera.css";
import { useNavigate } from "react-router-dom";
import { LogoArtRoomDefinitivo2 } from "../LogoArtRoomDefinitivo2/LogoArtRoomDefinitivo2.jsx";
import { SignUpButton } from "../SignUpButton/SignUpButton.jsx";
import { SignInButton } from "../SignInButton/SignInButton.jsx";

export const Cabecera = ({
  isLoggedIn,
  handleUploadClick,
  handleProfileClick,
  handleSignUpClick,
  handleSignInClick,
  handleLogoutClick,
}) => {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (searchText.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="header">
      <LogoArtRoomDefinitivo2 className="logo-art-room-definitivo-2-instance" />
      <div className="search-container">
      <img
          src="https://www.dropbox.com/scl/fi/ieaswykdv57270lwyk217/vector0.svg?rlkey=infc1esp7w5jleq4zlb80nr5p&st=f84l3uv2&raw=1"
          alt="Search Icon"
          className="search-icon"
          onClick={handleSearchClick}
          style={{ cursor: "pointer" }}
        />
        <input
          type="text"
          placeholder="Search resources..."
          className="search-text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <>
            <button className="logout-button" onClick={handleLogoutClick}>
              <img
                src="https://www.dropbox.com/scl/fi/u7k7daltajqg3myiaud0j/logout-icon.svg?rlkey=gb11yrggffu7kowqyq9muwyzw&st=4q66hybj&raw=1"
                alt="Logout button"
              />
            </button>
            <button className="upload-icon" onClick={handleUploadClick}>
              <img
                src="https://www.dropbox.com/scl/fi/o4cednhkybd1ty8xsp5x7/upload-icon.png?rlkey=0ymn2yz9rqdpuyf2hd50hoa7o&st=0t6y1zo8&dl&raw=1"
                alt="Upload icon"
              />
            </button>
            <button className="user-icon" onClick={handleProfileClick}>
              <img
                src="https://www.dropbox.com/scl/fi/hfz5wn581d6rot1ccxuyh/user-icon.png?rlkey=hm75yyttqaw7hb8n5tk3ja3xq&st=rknzoa1v&dl&raw=1"
                alt="User icon"
              />
            </button>
          </>
        ) : (
          <>
            <SignUpButton
              className="sign-up-button-instance"
              onClick={handleSignUpClick}
            />
            <SignInButton
              className="sign-in-button-instance"
              onClick={handleSignInClick}
            />
          </>
        )}
      </div>
    </div>
  );
};
