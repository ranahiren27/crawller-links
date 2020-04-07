import { Router } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface Attribs {
    href: string
}
interface Link {
    attribs: Attribs;
}
const router: Router = Router();

var visitedLinks = [];
var listOfLinks = [];
async function getLinks(url,path='/') {

    if(path.startsWith(url)){
        url = path;
    }else{
        url =  url + path
    }
    try {
        var data = await axios.get(url);        
    } catch (error) {
        console.log(url);
        return false;
    }
    var flag = 0;
    const $ = cheerio.load(data.data);
    var links = $('a');
    console.log(listOfLinks, visitedLinks);
    for(let [_, link] of Object.entries(links)){

        var href = "";

        if(link.attribs != undefined && link.attribs.href != undefined){
            href = link.attribs.href;
        }

            if(listOfLinks.includes(href) === false){
                visitedLinks.push(href);
                listOfLinks.push(href);
                flag = 1;
            }
    }
    if(flag === 1){
        return true;
    }else{
        return false;
    }
}

router.get('/getlinks', async (req, res, next)=>{
    const root = req.query.root;
    console.log("start: ",root)
    // const root = "http://www.buffalotrace.com/"
    var status = await getLinks(root);

    while(status === true){
        var path = visitedLinks.pop();
        status = await getLinks(root,path);
    }

    res.json({
        "links": listOfLinks
    });
}); 

router.get('/', async (req, res, next)=>{
    res.json({
        "links": "Welcome to web link crawller api"
    });
}); 

export default router;
