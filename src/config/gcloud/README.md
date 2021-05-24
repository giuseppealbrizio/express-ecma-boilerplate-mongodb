This folder contains all the config files to link the project to Google Cloud Platform

## **Basic Concepts**

### 1. SERVICE ACCOUNT

To manage things like upload file to Cloud Storage, etc...

- Go to GCP and create a new project
- Go to Service Account and create one service account with a descriptive name
- Assign a role you want to the service account (i.e. "Storage Admin")
- Create a JSON key, download and put in `./src/config/gcloud` renaming google-application-credentials.json
- In the .env file specify the path to this file like
  - In this way we can configure the app to be linked with the service account created

```dotenv
GOOGLE_APPLICATION_CREDENTIALS='./../config/gcloud/google-application-credentials.json'
```

### 2. OAUTH Client ID Account

i.e. Used to create passport strategies with google

- Go to GCP
- Go to API & Services and create one OAuth Client ID account
- Choose Application Type -> Web application
- Name the web client (i.e. Dev Test - Web Client Oauth 2.0 Account)
- In Authorized javascript origins put

```
Authorized JavaScript origins

URIs*

http://localhost:3000

Authorized redirect URIs

URIs*

http://localhost:3000/auth/google/callback
```

- Copy the google client id and the google client secret and put them in the .env file like

```dotenv
GOOGLE_CLIENT_ID='your-google-client-id'
GOOGLE_CLIENT_SECRET='your-client-secret'
```

- Download the json file and rename to google-web-client-secret.json
- Then if you need to import the file in a middleware like passport or something else you can do

```javascript
const OAuth2Data = require('./google-web-client-secret.json');

const app = express();

const CLIENT_ID = OAuth2Data.client.id;
const CLIENT_SECRET = OAuth2Data.client.secret;
const REDIRECT_URL = OAuth2Data.client.redirect;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
);
var authed = false;

app.get('/', (req, res) => {
  if (!authed) {
    // Generate an OAuth URL and redirect there
    const url = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
    });
    console.log(url);
    res.redirect(url);
  } else {
    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    gmail.users.labels.list(
      {
        userId: 'me',
      },
      (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const labels = res.data.labels;
        if (labels.length) {
          console.log('Labels:');
          labels.forEach((label) => {
            console.log(`- ${label.name}`);
          });
        } else {
          console.log('No labels found.');
        }
      },
    );
    res.send('Logged in');
  }
});

app.get('/auth/google/callback', function (req, res) {
  const code = req.query.code;
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log('Error authenticating');
        console.log(err);
      } else {
        console.log('Successfully authenticated');
        oAuth2Client.setCredentials(tokens);
        authed = true;
        res.redirect('/');
      }
    });
  }
});
```
