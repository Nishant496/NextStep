import React from "react";
import { useUser, SignOutButton } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();
  const displayName = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "User";

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome, {displayName}</h1>
        <SignOutButton signOutOptions={{ redirectUrl: '/' }}>
          <button>Logout</button>
        </SignOutButton>
      </div>
      <p>You are now signed in.</p>
    </div>
  );
};

export default Dashboard;

