import { auth, db } from './config';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Generate or retrieve a persistent device ID using localStorage
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('viewCashDeviceId');
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('viewCashDeviceId', deviceId);
  }
  return deviceId;
};

// Validates 1 Account per Device Rule
export const validateDeviceLock = async (uid) => {
  const currentDeviceId = getDeviceId();
  const deviceRef = doc(db, 'devices', currentDeviceId);
  const deviceSnap = await getDoc(deviceRef);

  if (deviceSnap.exists()) {
    const linkedUid = deviceSnap.data().uid;
    if (linkedUid !== uid) {
      throw new Error('This device is already linked to another account.');
    }
  } else {
    // First time login on this device, lock it to this UID
    await setDoc(deviceRef, {
      uid: uid,
      lockedAt: new Date().toISOString()
    });
  }
  return true;
};

// Google Auth
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Validate device lock
    await validateDeviceLock(result.user.uid);
    
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Google Login Error:", error);
    return { success: false, error: error.message };
  }
};

// Setup Recaptcha for Phone Auth
export const setupRecaptcha = (buttonId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved
      }
    });
  }
};

// Request OTP
export const requestOTP = async (phoneNumber) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return { success: true };
  } catch (error) {
    console.error("OTP Request Error:", error);
    return { success: false, error: error.message };
  }
};

// Verify OTP
export const verifyOTP = async (otpCode) => {
  try {
    const result = await window.confirmationResult.confirm(otpCode);
    
    // Validate device lock
    await validateDeviceLock(result.user.uid);
    
    return { success: true, user: result.user };
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return { success: false, error: error.message };
  }
};

export const logoutUser = () => {
  return signOut(auth);
};
