import React from 'react';
import './index.css';
import { HiOutlineLogout } from "react-icons/hi";
import { IoChatbubbles } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

export default function Sidebar({ currentChatId, onSelectChat, meetings, name}) {
  const navigate = useNavigate()
  const handleNewMeeting = () => {
    if (onSelectChat) onSelectChat(null);
  };

  const logout = () => {
    Cookies.remove('token')
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <div className='logo-container'>
        <h3 className='logo-text'>BoardRoom AI</h3>
      </div>

      <button className="new-meeting-btn" onClick={handleNewMeeting}>
        <span className="plus-icon">+</span> New Boardroom
      </button>

      <div className="recent-container">
        <p className="section-title">Recent Meetings</p>

        <div className="meetings-list">
          {meetings.map((meeting) => (
            <div
              key={meeting.meetingId}
              className={`meeting-item ${
                currentChatId === meeting.meetingId ? "active" : ""
              }`}
              onClick={() => onSelectChat(meeting.meetingId)}
            >
              <IoChatbubbles />

              <div className='meeting-title-con'>
                <span className="meeting-title">
                  {meeting.meetingTitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">CEO</div>
          <div className="user-info">
            <span className="username">{name}</span>
            <span className="tier">Pro Tier</span>
          </div>
          <div className='logout-container'>
            <HiOutlineLogout size="22" onClick={logout}/>
          </div>
        </div>
      </div>
    </div>
  );
}