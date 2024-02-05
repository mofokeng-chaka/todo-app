# TodoApp

## Developer notes

### Running the TodoApp in development

Before running the simulator the first time, install the required packages.

```shell
cd backend
python -m pip install -r requirements.txt
```

```shell
cd frontend
npm install
```

Start the uvicorn server.

```shell
cd backend
uvicorn main:app --reload
```

Start the frontend application

```shell
cd frontend
npm start
```

**Note: You might run into an error running the application for the first time as the database table might be missing. In this case, stop the backend server and run it again. 

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

```shell
cd backend
python -m pytest
```
