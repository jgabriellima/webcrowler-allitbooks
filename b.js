var request = require('request'),
    cheerio = require('cheerio'),
    url = require('url'),
    queryString = require('query-string'),
    fs = require('fs'),
    url_base = "http://www.allitebooks.com/";


getTopics(url_base, function(array) {
    for (var i = 0; i < array.length; i++) {
        /**/
        getAllPages(array[i], function(result) {
            /**/
            for (var j = 0; j <= result.pages; j++) {
                /**/
                var u = result.link + "page/" + (j + 1);
                getAllBooks(u, function(book) {
                    /**/
                    // for (var k = 0; k < books.length; k++) {
                    //     /**/
                    getAllBooksDetails(book, function(bookfinal) {
                        console.log("bookfinal: ", bookfinal);
                        // fs.appendFile('empresas_belem.txt', JSON.stringify(bookfinal), encoding = 'utf8', function(err) {
                        //     if (err) throw err;
                        // });
                    });
                    // }
                });
            }
        });
    }
});

function getAllPages(obj, callback) {
    request.get({
        url: obj.link,
        jar: true
    }, function(err, httpResponse, body) {
        var book = {};
        $ = cheerio.load(body, {
            normalizeWhitespace: true
        });
        obj.pages = parseInt($('.pagination').children().last().text());
        callback(obj);
    });

}

function getAllBooks(u, callback) {
    request.get({
        url: u,
        jar: true
    }, function(err, httpResponse, body) {
        var books = [];
        $ = cheerio.load(body, {
            normalizeWhitespace: true
        });
        /**/
        $('article').each(function() {
            var book = {};
            book['title'] = $(this).find(".entry-title").text();
            book['author'] = $(this).find(".entry-author").text().replace("By: ", "");
            book['resume'] = $(this).find(".entry-summary").text();
            book['img'] = $(this).find(".entry-thumbnail img").attr("src");
            book['link'] = $(this).find(".entry-thumbnail a").attr("href");
            book['pagesource'] = u;
            callback(book);
        });
        // callback(books);
        /**/
    });
}

function getAllBooksDetails(obj, callback) {

    request.get({
        url: obj.link,
        jar: true
    }, function(err, httpResponse, body) {
        var book = {};
        $ = cheerio.load(body, {
            normalizeWhitespace: true
        });
        console.log(body);
        console.log("DOWNLOAD: ",$(".download-links a").attr("href"));
        callback(obj);
        /**/
        // $('article').each(function() {
        //     book['title'] = $(this).find(".entry-title").text();
        //     book['author'] = $(this).find(".entry-author").text().replace("By: ", "");
        //     book['resume'] = $(this).find(".entry-summary").text();
        //     book['img'] = $(this).find(".entry-thumbnail img").attr("src");
        //     book['link'] = $(this).find(".entry-thumbnail a").attr("href");
        //     book['pagesource'] = u;
        //     callback(book);
        // });
        /**/
    });
}
/*
ul#menu-categories a
*/
function getTopics(url, callback) {
    request.get({
        url: url,
        jar: true
    }, function(err, httpResponse, body) {
        var objs = [];
        $ = cheerio.load(body, {
            normalizeWhitespace: true
        });
        $('ul#menu-categories a').each(function() {
            objs.push({
                title: $(this).text(),
                link: $(this).attr("href")
            });
        });
        callback(objs);
    });
};
