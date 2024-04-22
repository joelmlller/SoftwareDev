import React, { useState } from 'react';
import { CognitoIdentityProviderClient, ChangePasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { fetchAuthSession } from 'aws-amplify/auth';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    errorMessage: ''
  });

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword } = formData;
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  
    if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
      setFormData(prevState => ({ ...prevState, errorMessage: "Passwords must meet complexity requirements." }));
      return;
    }

    try {
      const accessToken = (await fetchAuthSession()).tokens?.accessToken;
      const client = new CognitoIdentityProviderClient({ region: "us-east-1" });
      const command = new ChangePasswordCommand({
     PreviousPassword: currentPassword,
    ProposedPassword: newPassword,
    AccessToken: `${(await fetchAuthSession()).tokens?.accessToken}`,
      });
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        setFormData({ currentPassword: '', newPassword: '', errorMessage: 'Password changed successfully!' });
      }
    } catch (error) {
      setFormData(prevState => ({ ...prevState, errorMessage: error.message }));
    }
  };

  return (
    <div className="container">
      <h3>Change Password</h3>
      {formData.errorMessage && (
        <div className="alert alert-danger" role="alert">
          {formData.errorMessage}
        </div>
      )}
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <input
          type="password"
          className="form-control"
          id="currentPassword"
          placeholder="Enter your current password"
          onChange={handleInputChange}
          value={formData.currentPassword}
        />
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          placeholder="Enter your new password"
          onChange={handleInputChange}
          value={formData.newPassword}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleChangePassword}
      >
        Change Password
      </button>
    </div>
  );
};
export default ChangePassword;

