# Social Sync

SocialSync is a social media application that allows users to share images, videos, and text posts, similar to instagram and Twitter. It includes features such as user authentication with email verification, profile management, social interactions (likes, comments, and follows), and real-time chat.

## Features

- Users can sign up by providing their email address and a password. After registration, they receive a verification email with a link to activate their account.
- Users can request a password reset link via email if they forget their password.
- Users can update their profile details, such as their name and password.
- Users can upload and change their profile picture to personalize their account.m
- Users can create and share text-based posts, similar to Instagram and Twitter.
- Users can upload and share images and videos in their posts. Supports various media formats.
- Users can edit their posts after sharing, allowing for corrections or updates.
- Users can like posts to show appreciation or agreement.
- Users can comment on posts to start discussions or provide feedback.
- Users can edit their comments if they need to make changes.
- Users can follow other users to see their posts in their feed and unfollow them if they wish.
- Users can send and receive messages in real-time to and from other users.
- Users can view their chat history with other users.
- Users see a feed of posts from people they follow, including text, images, and videos.
- Users can discover new posts and interact with them through likes and comments.
- Users can contact the developer by providing their name, email, and a description of their issue or feedback.

## Tech Stack

**Client:** React, Redux, TailwindCSS, shadcn/ui

**Server:** Django, Django REST Framework, Redis

**DataBase:** DataBase: PostgreSQL

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

In frontend

`VITE_BASE_URL` is backend url `http://127.0.0.1:8000`

`VITE_SOCKET_URL` is backend web socket url `ws://127.0.0.1:8000`

in backend

`SECRET_KEY` django need a key you can give anything

`EMAIL_HOST_USER` and `EMAIL_HOST_PASSWORD` for give mail to user for account verification.

## Run Locally

Clone the repository:

```bash
  git clone https://github.com/Lohit-Behera/SocialSync.git
  cd SocialSync
```

**Installing using [Docker](https://www.docker.com/)**

in root directory

```bash
  docker compose up
```

Then go to [localhost:5173](http://localhost:5173/) for frontend and [localhost:8000](http://localhost:8000/) for backend

**Installation without Docker**

In root directory
Create Python virtual environment using [virtualenv](https://virtualenv.pypa.io/en/latest/):

```bash
  pip install virtualenv
```

```bash
  python -m venv myenv
```

```bash
  myenv\Scripts\activate
```

install python libraries

```bash
  cd backend
```

```bash
  pip install -r requirements.txt
```

Start the server

```bash
  python manage.py runserver
```

In another terminal for React js

```bash
  cd SocialSync
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Screenshots

![App Screenshot](https://drive.usercontent.google.com/download?id=1CHercT2Ha5U5v84-cE5TDJVWG4JrwlTj)

![App Screenshot](https://drive.usercontent.google.com/download?id=17foDXnoyZMCC6-lWeY91jozl6fEYnuiC)

![App Screenshot](https://drive.usercontent.google.com/download?id=1SJX2INCQpii3u-ac-VraRQY7Abbu6aUg)

![App Screenshot](https://drive.usercontent.google.com/download?id=1c9OJ5pHGfBtYRAHYMq5Zzr3Lot8ck69L)

for more Screenshots here is Google Drive [Link](https://drive.google.com/drive/folders/18deawy9hTZGbcxtPPRtNTL4ayjZ235s7?usp=drive_link)

## License

This project is licensed under the MIT License - see the [LICENSE](https://choosealicense.com/licenses/mit/) file for details.
