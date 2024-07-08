# OpenIPAM Frontend Login DEMO
This is a locally hosted demo that shows the setup needed to allow for login through the seperate backend, dealing with CSRF and CORS errors

## Setup

- First, copy `example.env` into `.env`
- You will fill this out in a moment

### OpenIPAM Backend
- You will need this cloned [GitHub Repo](https://github.com/Treyson-Grange/django-openipam)
- After cloning, use poetry to install packages, and run it.
- Note what host and port it is running on, and throw it in your `.env`
- If you work here you should have a dev db for OpenIPAM lol im not gonna help you there

### OpenIPAM Frontend
- Inside of this repository, run the following commands
```
npm install 
npm run dev
```
- Note the host and port, and throw it in your `.env` (You don't actually need this one)

### Finally,
- Head to the frontend URL.
- Login with a username, specific to your local OpenIPAM db.

## Todo For Demo
- [ ] Error Catching / Incorrect login
- [ ] Make it pretty