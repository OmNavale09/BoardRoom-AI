import React, { useState } from 'react';
import { 
  LuChevronDown, 
  LuPaperclip, 
  LuGithub, 
  LuHeading, 
  LuFileUp,
  LuPause,
  LuPlay 
} from 'react-icons/lu';
import { FaVoteYea } from "react-icons/fa";
import { FaPaperPlane } from 'react-icons/fa6';
import toast, { Toaster } from 'react-hot-toast';
import './input.css';

const BoardroomInput = ({ onSubmit, isStarted = false, isPaused = false, onToggleAction, handleVote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    githubRepo: '',
    file: null,
    mainInput: ''
  });

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFileClick = (e) => {
    e.preventDefault(); // Prevents the native file selection prompt from opening
    toast("Coming Soon!", {
      duration: 3000,
      position: 'top-right',
      icon: '🚀',
      style: {
        border: '1px solid #6366f1',
        padding: '12px 24px',
        color: '#e2e8f0',
        background: '#1e1e24',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.mainInput.trim() && !formData.title.trim() && !formData.file) {
      return; 
    }
    console.log(formData)
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({
      title: '',
      githubRepo: '',
      file: null,
      mainInput: ''
    });
    setIsExpanded(false);
  };

  return (
    <div className="br-wrapper">
      <Toaster />
      <div className={`br-capsule-container ${isExpanded ? 'is-open' : ''}`}>

        {/* Main Bar (Always Horizontal) small */}
        <div className="br-main-row-2">
          <input
            style={{marginTop: '6px'}}
            type="text"
            name="mainInput"
            value={formData.mainInput}
            onChange={handleInputChange}
            className="br-text-input"
            placeholder={isExpanded ? "Ask the board for a decision..." : "Upload your pitch or ask the board for a decision..."}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
          />
          <div style={{display: 'flex', justifyContent: "space-between", marginTop: '10px'}}>
            <button 
            className={`br-toggle-arrow ${isExpanded ? 'br-rotated' : ''}`} 
            onClick={toggleExpand}
            title={isExpanded ? "Collapse form" : "Expand extra fields"}
            type="button"
          >
            <LuChevronDown size={18} />
            </button>
            <div style={{display: 'flex'}}>
            {isStarted && (
            <>
            <button 
              type="button" 
              className={`br-action-toggle-btn ${isPaused ? 'is-resuming' : 'is-pausing'}`}
              onClick={onToggleAction}
              title={isPaused ? "Resume Meeting Workflow" : "Pause Meeting Workflow"}
            >
              {isPaused ? <LuPlay size={14} /> : <LuPause size={14} />}
            </button>
            <button className="br-submit-btn" type="button" style={{marginLeft: '4px', marginRight: '6px'}} onClick={handleVote}>
              <FaVoteYea size={13} />
            </button>
            </>
            )}
            <button className="br-submit-btn" type="button" onClick={handleSubmit}>
            <FaPaperPlane size={13} />
            </button>
          </div>
          </div>
        </div>
        
        {/* Main Bar (Always Horizontal) large */}
        <div className="br-main-row">
          <button 
            className={`br-toggle-arrow ${isExpanded ? 'br-rotated' : ''}`} 
            onClick={toggleExpand}
            title={isExpanded ? "Collapse form" : "Expand extra fields"}
            type="button"
          >
            <LuChevronDown size={18} />
          </button>

          

          <input
            type="text"
            name="mainInput"
            value={formData.mainInput}
            onChange={handleInputChange}
            className="br-text-input"
            placeholder={isExpanded ? "Ask the board for a decision..." : "Upload your pitch or ask the board for a decision..."}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSubmit(e);
              }
            }}
          />
          {isStarted && (
            <>
            <button className="br-submit-btn" type="button">
              <FaVoteYea size={13} />
            </button>
            <button 
              type="button" 
              className={`br-action-toggle-btn ${isPaused ? 'is-resuming' : 'is-pausing'}`}
              onClick={onToggleAction}
              title={isPaused ? "Resume Meeting Workflow" : "Pause Meeting Workflow"}
            >
              {isPaused ? <LuPlay size={14} /> : <LuPause size={14} />}
            </button>
            </>
          )}
          <button className="br-submit-btn" type="button" onClick={handleSubmit}>
            <FaPaperPlane size={13} />
          </button>
        </div>

        {/* Hidden / Expanded Drawer Form */}
        {isExpanded && (
          <div className="br-drawer">
            <div className="br-grid-2col">
              <div className="br-form-group">
                <label><LuHeading size={12} /> Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Project or Pitch Title"
                />
              </div>
              <div className="br-form-group">
                <label><LuGithub size={12} /> GitHub Repo</label>
                <input 
                  type="url" 
                  name="githubRepo" 
                  value={formData.githubRepo} 
                  onChange={handleInputChange} 
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="br-form-group">
              <label><LuFileUp size={12} /> PPT or PDF File</label>
              <div className="br-file-picker-box">
                <label htmlFor="br-file-drawer" className="br-file-picker-btn" onClick={handleFileClick}>
                  Choose File
                </label>
                <input 
                  type="file" 
                  id="br-file-drawer" 
                  onChange={handleFileChange}
                  accept=".pdf,.ppt,.pptx"
                  style={{ display: 'none' }}
                />
                <span className="br-file-name">
                  {formData.file ? formData.file.name : "No file selected (Supports PDF, PPT)"}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
      <p className="br-footer-text">
        BoardRoom AI can simulate complex multi-agent reasoning, verify critical trade-offs before execution.
      </p>
    </div>
  );
};

export default BoardroomInput;