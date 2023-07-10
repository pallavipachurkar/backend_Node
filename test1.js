

const express = require('express');
const app = express();
app.use(express.json());

// Your code starts here. Placeholders for .get and .post are provided for


let candidates = [];
app.post('/candidates', function (req, res) {

    // Delete this to start and implement your solution
    
    if (req.body.skills.length) {
        candidates.push(req.body)
    }
   
    if (candidates.length) {
        res.status(200);
        res.end(JSON.stringify(candidates[0]));
    }
    else {
        res.status(404);
        res.end(JSON.stringify({}));
    }

});

app.get('/candidates/search', function (req, res) {
    // Delete this to start and implement your solution
   

    if (!req.query.skills) {
        res.status(400);
        res.send();
    }
    else if (!candidates.length) {
        res.status(404);
        res.send();
    }
    else if (req.query.skills) {
        let skills = req.query.skills.split(",");   
        for (var i = 0; i < candidates.length; i++) {
            candidates[i]['skillCount'] = 0;
           

            skills.forEach((skill) => {              
                if (candidates[i]['skills'].includes(skill)) {               
                    candidates[i]['skillCount']++;                  
                }
            })
        }     

        candidates.sort(sortFunction);

        function sortFunction(a, b) {
            if (a['skillCount'] === b['skillCount']) {
                return 0;
            }
            else {
                return (a['skillCount'] > b['skillCount']) ? -1 : 1;
            }
        }
    }
    else {
        res.status(404);
        res.send();
    }
   
    if (candidates.length > 0 && candidates[0]['skillCount'] > 0) {
        res.status(200);
        res.end(JSON.stringify(candidates[0]));
    }
    else if (candidates.length > 0 && candidates[0]['skillCount'] == 0) {
        res.status(404);
        res.end();
    }
    else {
        res.status(404);
        res.end();
    }
});

app.listen(process.env.HTTP_PORT || 3000);

// app.listen(8083);