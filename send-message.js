const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
var serviceAccount = {
  "type": "service_account",
  "project_id": "boostb-project-iwyjv5",
  "private_key_id": "362e88c80ec3fa837896bc26b0177badbe3a97d7",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6NpBITLEkSCoH\nJZj+BfgHA5uTda7dKSjyRjcveKItJRIBViLdtf7HlyvDZEcCuMnz/mSRLuKBX/DO\nDJqJPRn2fQlt+Mx65ok6zzTqVENOc+FOr6DQq9AaoQVVsOeDau9CHQ3kfWLNJZxU\nyaUrf/u3KOMXuvAPHq+If2lbRPyf38L3akJKJjOxJzY8XoxirBHxjj5M2lvB7/WH\n1Bk0xnbXZSy3TyPxthCPvjOwG5wPFYClHheaxMLizsoFfepedxCWIqova2lBd+FN\n40gy5idc4LZT3JCrbRVeKDvAI5aGKmyCed++zgXsbjPBxw+iLXr090g1u2oEFc/m\nQHnyvdltAgMBAAECggEAE3rDP6j0K/M3oE1E0qf9sQAl3XhlXUHhxGxnd/oS3w2e\nc1DXL2HLQAZWn+dEzWpWyAUv8Icaz0Vhy7BCV0JyzZf5bU1mWKH2r5X+91duvg19\nv408Ua/zgmGfTP5HTbZZRo2DB0i9le/OCYmZk3IdOyUWEoSt+arwWmNXumI+Whvw\n2vtRqSlmUgc/bw+Au4lTMQlmDtUYi/Yp7CkwbBxyULZ/mTu+/FGoAL7bOG0Li0Gq\nP1lsmOCKfTaRnYFKaspT2xR/5l7E2tKtdwYmqStjMPZNwwDbyBmvILlyn7h+1k37\nrKRSzpDlon00EYjZMB2Ec8WtPwzFb1tUaYR7RhwBEQKBgQDcIeyZ+PbYzvCR5Rpv\n6rAb5d7SVcdZsJe5FOFF2MUQDefTXunt1lOeJ+sPwsWHQvo0Ir60Vu/SCZUbHnjp\nGyfCMmYHBHz27K5gTaR4bpfZzVa+H8T9CM++NWszHe20KKWJqYAj7mXfYntaqvX+\nzhlyqazKJpqYYbDy55AWkIgHkQKBgQDYjc72Rr71ou1okxaszvyFpTMhA2Z8+4n/\nSog7nQVaYklLIOAOB0VrxZo3I0ZOSoHWPZ8fEbcStQ74u2PkH+kp/FObgiKE+sQs\nDVtmA8PUUgK4wlZ8ShI8rbJ/+m7rmvYAe3SMwmMVVpoAojQ+hpaS38W3fYRCIOBg\ngYa21lIeHQKBgFGN3/JLYmiAgnAKyPidohEz4JFcZja8Tfmr2qnd3WRNQo30pAYR\nWXlGoLd+GWA7WCbomG6HpuHR2wPpDjKOdPRlZ5dB+mog1ZmoKj7T+j4e7PwTGRAF\nq7F0aPrPI7mTNYEC4w5szCEugzTcEbcM9DCe2/0owC2kQ8I6OA+kDEGBAoGAUESg\nBiFK/vmZTj3XFc7TQyZswTvlbUY/bGVQAei95zavPC2/XvPLA5uHAhENKk/ruGG2\n7Wk/lquOFRxAdnptjqZ8xxOBgBEDTeDVlAapO7X6VEmUjRVXlS49D7rgCmyx6pPY\nK6SR3YLwKnP1MYfpoB9Zxh28PFa7VIouSO9AGPECgYAYWkC3illOjCcf905SpBw5\nlnzXWWi0XLlrcRXDx1a/YzOGe+NviqEK+a5Z6tDEB9m6noDr+eO1I/aHZE7g/X5c\nt3cI6zY9rAhqF1yxBnoZgVh41w4lAODzc4O9R5kGHDNsYnho0Pfb+2kPolkdmcXC\no4PpKPTSMiQjJ1C3cLRjqA==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@boostb-project-iwyjv5.iam.gserviceaccount.com",
  "client_id": "103622364253138740274",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40boostb-project-iwyjv5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// POST API to send notification
app.post('/send-message', async (req, res) => {
  const { title, body, token } = req.body;

  if (!title || !body || !token) {
    return res.status(400).json({ error: 'title, body, and token are required' });
  }

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
        },
      },
    },
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
