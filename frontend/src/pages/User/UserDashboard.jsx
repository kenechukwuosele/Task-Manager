import React, { useContext } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { UserContext } from '../../context/userContext';

const UserDashboard = () => {
  const userFromAuth = useUserAuth(); // gets user from hook (handles redirect)
  const { user: userFromContext } = useContext(UserContext); // optional, if you need full context

  // Use one of them consistently
  const user = userFromAuth || userFromContext;

  if (!user) return null; // render nothing while redirecting

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      {user.profileImageUrl && (
        <img src={user.profileImageUrl} alt="Profile" className="w-20 h-20 rounded-full mt-4" />
      )}
    </div>
  );
};

export default UserDashboard;
