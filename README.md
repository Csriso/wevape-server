<p align="center">
  <img src="https://github.com/Csriso/wevape-client/blob/main/public/logo.png?raw=true" />
</p>

# WeVape Back-End

Social network for vape users around the world.

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/Csriso/wevape-client/main/public/screen.png)

## MVP

- Social Stories of different users about vaping (CRUD) ✔️
- Users, add users to follow ✔️
- Users can comment other people stories ✔️
- Users can like people stories ✔️

## Backlog

- Groups. ✔️
- Used products market, sales offers. ✔️
- Private messages.
- Meetings of vapelovers (flavors tastings, etc)
- Store locations to find in your city.
- Group live chats.

## Proyect layout

- "/config" -> Express config
- "/db" -> Db config
- "/error-handling" -> Express error config
- "/middlewares" -> Auth JWT and image uploader middleware
- "/models" -> Models of Mongo DB database
- "/routes" -> API Routes

## API Reference

### Auth Routes

#### Login

```http
  POST /api/auth/signup
```

#### Register

```http
  POST /api/auth/signup
```

#### Verify JWT

```http
  GET /api/auth/verify
```

### Post Routes

#### Get all posts

```http
  GET /api/post
```

#### Get single post

```http
  GET /api/post/:id
```

#### Get user feed

```http
  GET /api/post/:id/myfeed
```

#### Get posts by username

```http
  GET /api/post/:username/user
```

#### Create post

```http
  POST /api/post
```

#### Edit post likes

```http
  PATCH /api/post/:id/manageLikes
```

#### Delete post

```http
  DELETE /api/post/:id
```

### User Routes

#### Get user by username

```http
  GET /api/user/:username
```

#### Get user by id

```http
  GET /api/user/:id/id
```

#### Edit user by username

```http
  PATCH /api/user/:username
```

#### Follow user by username

```http
  PATCH /api/user/:username/follow
```

#### Delete user by username

```http
  DELETE /api/user/:username
```

#### Change user image

```http
  PATCH /api/user/:userid/image
```

#### Edit user

```http
  PATCH /api/user/:id/edit
```

### Comments

#### Get comment by id

```http
  GET /api/comment/:id
```

#### Create comment of comment by id

```http
  POST /api/comment/of/comment/:id
```

#### Create comment of post

```http
  POST /api/comment/:idPost
```

### Ads (Marketplace)

#### Create Comment on Ad

```http
  POST /api/comment/:idAd/ad
```

#### Get all ads

```http
  POST /api/comment/:idAd/ad
```

#### Get ad by id

```http
  GET /api/ad/:id
```

#### Create new ad

```http
  POST /api/ad
```

#### Edit ad

```http
  PATCH /api/ad/:id
```

#### Delete ad

```http
  DELETE /api/ad/:id
```

### Groups

#### Get groups

```http
  GET /api/group
```

#### Get logged user groups

```http
  GET /api/group/my
```

#### Get user groups

```http
  GET /api/group/:id
```

#### Create group

```http
  POST /api/group
```

#### Join group

```http
  POST /api/group/:id/join
```

#### Edit group

```http
  POST /api/group/:id
```

#### Delete group

```http
  DELETE /api/group/:id
```

### Utils

#### Upload photos

```http
  POST /api/upload
```

## Authors

- [@csriso](https://github.com/Csriso/)
