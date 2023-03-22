#!/bin/sh

# Start the server
cd server
npm run server & 

# Start the client 
cd client 
npm run dev &