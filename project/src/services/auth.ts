import { Auth } from 'aws-amplify';
import { userAPI } from './api';
import { User } from '../types';

// Sign in with email and password
export const signIn = async (email: string, password: string) => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await Auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current authenticated user
export const getCurrentUser = async () => {
  try {
    const amplifyUser = await Auth.currentAuthenticatedUser();
    
    // Get user details from API
    const response = await userAPI.getUser(amplifyUser.username);
    const user = response.getUser;
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    await Auth.currentAuthenticatedUser();
    return true;
  } catch (error) {
    return false;
  }
};

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: string,
  institutionId?: string
) => {
  try {
    // Sign up with Cognito
    const { user } = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        given_name: firstName,
        family_name: lastName,
        'custom:role': role,
        'custom:institution_id': institutionId || ''
      }
    });
    
    // Create user in AppSync/DynamoDB
    const input = {
      id: user.username,
      email,
      firstName,
      lastName,
      role,
      institutionId: institutionId || null
    };
    
    await userAPI.createUser(input);
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Confirm user registration
export const confirmRegistration = async (email: string, code: string) => {
  try {
    await Auth.confirmSignUp(email, code);
    return true;
  } catch (error) {
    console.error('Error confirming registration:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    await Auth.forgotPassword(email);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Confirm new password
export const confirmNewPassword = async (email: string, code: string, newPassword: string) => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
    return true;
  } catch (error) {
    console.error('Error confirming new password:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.changePassword(user, oldPassword, newPassword);
    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Update user attributes
export const updateUserAttributes = async (attributes: Record<string, string>) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    await Auth.updateUserAttributes(user, attributes);
    return true;
  } catch (error) {
    console.error('Error updating user attributes:', error);
    throw error;
  }
};