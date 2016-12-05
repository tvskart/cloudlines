# cloudlines

Brief walkthrough - 

type npm start
what happens?
    server starts, stream.json keeps getting updated every 10 seconds..

hit url - http://localhost:3000/
what is shown? 
    monitoring app with debug details.
    can view global variables historical_data or stream_data on console.
    
How api works? returns recent most 100 mentions. pass a last_id value, returns 100 mentions since tht id.
Database? We could upload data to ES instance, etc. or just pick from json file for now.
