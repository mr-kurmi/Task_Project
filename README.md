# How to run the project 
1. download the zip file from git hub.
2. unzip it in your system(Laptop/PC).
3. Open project using any code editer.
4. Install Node, mongodb in your system.
5. After installing these use command "npm i" or "npm install".
6. For runing the project Use command  "npm run start_nodemon" if nodemon installed else use "node app.js".

# api for singup
URL = http://localhost:3000/v1.0.0/DEV/user/registrationApi
fields = first_name, last_name, mobile, email, school_name, password, Profile_pic.

# api for login 
URL = http://localhost:3000/v1.0.0/DEV/user/loginApi
fields = mobile, password.

# api for upload assignment 
URL = http://localhost:3000/v1.0.0/DEV/user/assignmentApi
fields = assignmentTitle, student, assignmentFile.

# Get Assignment details for student 
URL = http://localhost:3000/v1.0.0/DEV/user/getassignmentApi
fields = studentID.