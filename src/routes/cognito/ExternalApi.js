import React, { useState } from "react";
import { Auth } from "aws-amplify";
const ExternalApi = () => {
  const [showResult, setShowResult] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  const callApi = async () => {
    try {
      const { accessToken: token } = await Auth.currentSession();
      console.log(token);

      const response = await fetch(
        "https://touchbase-dev-bitfvu56tq-uc.a.run.app/api/v1/person/me",
        {
          headers: {
            Authorization: `Bearer ${token.jwtToken}`
          }
        }
      );

      const responseData = await response.json();

      setShowResult(true);
      setApiMessage(responseData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>External API</h1>
      <button onClick={callApi}>Ping API</button>
      {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
    </>
  );
};

export default ExternalApi;
