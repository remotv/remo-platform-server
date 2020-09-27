const router = require("express").Router();
const axios = require("axios");
const config = require("../../config");
const auth = require("../auth");

let legacyAVData = [];
let AVData = [];

setInterval(async () => {
    if (config.legacyAVServerInternal){
        try {
            const response = await axios.get(`http://${config.legacyAVServerInternal}/streams`);
            const newData = [];
    
            for (id of response.data){ //filter out audio and add ids to array with trailing -video
                if (id.endsWith("-video")){
                    newData.push(id.replace("-video", ""));
                }
            }
    
            legacyAVData = newData;
        } catch (e){
            legacyAVData = [];
            console.error(e, "Error Fetching Legacy AV Data");
        }
    }

    if (config.AVServer){
        try {
            const response = await axios.get(`http://${config.AVServer}/streams`);
            AVData = response.data;
        } catch (e){
            console.error(e, "Error Fetching AV Data");
        }
    }
}, 4000)

router.get("/stream/:id", async (req, res) => {
    const id = req.params.id;

    if (AVData.includes(id)){
        return res.json({live: true, type: 'webRTC', data: {}});
    } else if (legacyAVData.includes(id)){
        return res.json({live: true, type: 'legacy', data: {server: config.legacyAVServerExternal}});
    } else {
        return res.json({live: false, type: 'none', data: {}});
    }
})

router.post("/watch/:id", async (req, res) => { //webRTC peering
    if (!config.AVServer) return res.status(400).json({error: "SERVICE_UNAVALIABLE"});

    if (!req.body || !req.body.sdp) return res.status(400).json({error: "BAD_REQUEST"});
    
    const id = req.params.id;
    const sdp = req.body.sdp;

    try {
        const response = await axios.post(`http://${config.AVServer}/watch`, {id, sdp});
        res.json(response.data);
    } catch (e){
        if (e.response && e.response.status === 400){
            res.status(400).json(e.response.data);
        } else {
            res.status(500).json("INTERNAL_SERVE_RERROR");
        }
    }
})

router.post("/heartbeat/:id", async (req, res) => { //webRTC heartbeat
    if (!config.AVServer) return res.status(400).json({error: "SERVICE_UNAVALIABLE"});
    
    const id = req.params.id;

    try {
        const response = await axios.post(`http://${config.AVServer}/heartbeat`, {id});
        res.json(response.data)
    } catch (e){
        if (e.response && e.response.status === 400){
            res.status(400).json(e.response.data);
        } else {
            res.status(500).json("INTERNAL_SERVE_RERROR");
        }
    }
})

router.post("/stream", auth({ robot: true, required: true }), async (req, res) => { //robot open request / heartbeat
    if (!config.AVServer) return res.status(400).json({error: "SERVICE_UNAVALIABLE"});
    
    const id = req.robot.id;
    const ip = req.headers["x-real-ip"];

    try {
        const response = await axios.post(`http://${config.AVServer}/stream`, {id, ip});
        res.json(response.data)
    } catch (e){
        if (e.response && e.response.status === 400){
            res.status(400).json(e.response.data)
        } else {
            res.status(500).json("INTERNAL_SERVE_RERROR")
        }
    }
})

module.exports = router;