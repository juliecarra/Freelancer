import React from "react";
import { Link } from "react-router-dom";

const ProfileActions = () => {
  return (
    <div className="btn-group mb-4" role="group">
      <Link to="/edit-profile" className="btn btn-black">
        <i className="fas fa-user-circle  icon mr-1" /> Edit Profile
      </Link>
      <Link to="/add-experience" className="btn btn-black">
        <i className="fab fa-black-tie icon mr-1" />
        Add Experience
      </Link>
      <Link to="/add-education" className="btn btn-black">
        <i className="fas fa-graduation-cap icon mr-1" />
        Add Education
      </Link>
    </div>
  );
};

export default ProfileActions;
