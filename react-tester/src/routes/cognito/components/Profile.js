// src/components/Profile.js

import React, { Fragment, useEffect, useState } from "react";
import { Auth } from "aws-amplify";

const Profile = () => {
  const [data, setData] = useState({ user: null });
  useEffect(async () => {
    const { user } = await Auth.currentSession();
    setData({ user });
  }, []);

  if (data.user) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      {/* <img src={user.picture} alt="Profile" /> */}

      {/* <h2>{user.name}</h2> */}
      {/* <p>{user.email}</p> */}
      <code>{JSON.stringify(data.user, null, 2)}</code>
    </Fragment>
  );
};

export default Profile;
