# Use a node 9 image
FROM node:9

# Set envornmrnt variables
ARG build_config
ENV start_config start

# Set the working directory to /5050dapp
WORKDIR /5050dapp

# Copy the current directory contents into the container at /5050dapp
ADD . /5050dapp

# Install any needed packages specified in requirements.txt
RUN npm install

# Build the project
RUN npm run-script ${build_config}

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run npm start when the container launches
CMD npm run-script ${start_config} 
