# cloudlines

Brief walkthrough - 

index.js file has a runstream function that essentialy populates a data.json file with latest data.
How api works? returns recent most 100 mentions. pass a last_id value, returns 100 mentions since tht id.

We could upload data to ES instance, etc. or just pick from json file for now.
Can get started on index.html to visualize the data (static). 
Will add code later to stream on client side the recent most data EVERY 10 sec or so. might convert to express app for this scenario..
