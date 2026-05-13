import { db } from './config';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Get or Create User Profile
export const getUserProfile = async (uid, defaultData = {}) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    // Create new profile
    const newProfile = {
      uid,
      coins: 0,
      createdAt: new Date().toISOString(),
      role: 'user',
      ...defaultData
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  }
};

// Update User Coins (Positive for earn, Negative for withdraw)
export const updateUserCoins = async (uid, coinAmount) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) throw new Error("User not found");
  
  const currentCoins = userSnap.data().coins || 0;
  const newBalance = currentCoins + coinAmount;
  
  if (newBalance < 0) throw new Error("Insufficient coins");
  
  await updateDoc(userRef, {
    coins: newBalance
  });
  
  return newBalance;
};

// Create Withdrawal Request
export const createWithdrawalRequest = async (uid, amount, upiId) => {
  // 1. Deduct coins first
  await updateUserCoins(uid, -amount);
  
  // 2. Create withdrawal record
  const withdrawalRef = doc(collection(db, 'withdrawals'));
  await setDoc(withdrawalRef, {
    id: withdrawalRef.id,
    uid,
    amount,
    upiId,
    status: 'pending',
    requestedAt: new Date().toISOString()
  });
  
  return true;
};
