# OpenIPAM Frontend

This is a WIP rework of the openIPAM front end. openIPAM is currently setup through Django admin dashboard, this is bringing it to a React based app to remove its connection with the Django REST framework.

## Setup

1. **Environment Configuration**
   - Copy `example.env` to `.env`
   - Fill out the `.env` file as needed.

2. **OpenIPAM Backend**
   - Clone the [OpenIPAM Backend Repository](https://github.com/Treyson-Grange/django-openipam).
   - Use `poetry` to install the packages and start the backend.
   - Note the host and port the backend is running on and update your `.env` accordingly.
   - Ensure you have access to the development database for OpenIPAM.

3. **OpenIPAM Frontend**
   - Inside this repository, run:
     ```
     npm install 
     npm run dev
     ```
   - Note the host and port, and update your `.env` (though this one is not strictly necessary).

4. **Access the Application**
   - Navigate to the frontend URL.
   - Log in with a username specific to your local OpenIPAM database.


## More

- GitHub repo [here](https://github.com/Treyson-Grange/openipam-react-frontend)
- Project board [here](https://github.com/users/Treyson-Grange/projects/2/views/2)
