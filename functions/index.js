const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

// Secure Withdrawal Request Function
// Prevents users from manipulating their client-side coin balance directly
exports.requestWithdrawal = functions.https.onCall(async (data, context) => {
  // 1. Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to request a withdrawal.');
  }

  const uid = context.auth.uid;
  const amount = parseInt(data.amount);
  const upiId = data.upiId;

  // 2. Validate Input
  if (isNaN(amount) || amount < 50) {
    throw new functions.https.HttpsError('invalid-argument', 'Minimum withdrawal is 50 Coins.');
  }
  if (!upiId || !upiId.includes('@')) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid UPI ID is required.');
  }

  // 3. Process Transaction Securely using Firestore Transactions
  try {
    const result = await db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(uid);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'User profile not found.');
      }

      const currentCoins = userDoc.data().coins || 0;

      // Ensure user has enough coins
      if (currentCoins < amount) {
        throw new functions.https.HttpsError('failed-precondition', 'Insufficient coin balance.');
      }

      // Deduct Coins
      transaction.update(userRef, { coins: currentCoins - amount });

      // Create Withdrawal Record
      const withdrawalRef = db.collection('withdrawals').doc();
      transaction.set(withdrawalRef, {
        uid: uid,
        amount: amount,
        upiId: upiId,
        status: 'pending',
        requestedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true, withdrawalId: withdrawalRef.id };
    });

    return result;
  } catch (error) {
    console.error("Transaction Error:", error);
    throw new functions.https.HttpsError('internal', error.message || 'Withdrawal failed.');
  }
});

// Secure Ticket Purchase Function
// Validates 1 ticket per day limit server-side
exports.buyTicket = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be logged in.');
  }

  const uid = context.auth.uid;
  const productId = data.productId;

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const ticketId = `${uid}_${productId}_${today}`;
  const ticketRef = db.collection('tickets').doc(ticketId);

  try {
    await db.runTransaction(async (transaction) => {
      const ticketDoc = await transaction.get(ticketRef);
      if (ticketDoc.exists) {
        throw new functions.https.HttpsError('already-exists', 'You have already bought a ticket for this product today.');
      }

      transaction.set(ticketRef, {
        uid: uid,
        productId: productId,
        date: today,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    return { success: true, message: 'Ticket purchased successfully!' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
