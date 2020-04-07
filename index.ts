var axios = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");
// const root = "https://www.tutorialspoint.com";
// const root = "https://www.wine.com";
// const root = 'https://full-circle-solutions.herokuapp.com/';
const root = "https://primo-liquors-dev.herokuapp.com/store";
var visitedLinks = [];
var listOfLinks = [];
async function getLinks(url,path='/') {
    if(path.startsWith(root)){
        url = path;
    }
    try {
        var data = await axios.get(url+path);        
    } catch (error) {
        console.log(url);
        // console.log("Error occured while axios call",error);
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

        var linkMatchRe = /^[A-Za-z/]+$/;

        // if(linkMatchRe.test(href)){
            if(listOfLinks.includes(href) === false){
                visitedLinks.push(href);
                listOfLinks.push(href);
                flag = 1;
            }
        // }
    }

    if(flag === 1){
        return true;
    }else{
        return false;
    }

}

function writeDump(dump){
    fs.writeFile('links.list', dump, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
}

async function main(){
    var status = await getLinks(root);

    while(status === true){
        var path = visitedLinks.pop();
        status = await getLinks(root,path);
    }

    listOfLinks = listOfLinks.join().replace(/,/g,'\n');

    writeDump(listOfLinks);
}
main();
//https://full-circle-solutions.herokuapp.com/