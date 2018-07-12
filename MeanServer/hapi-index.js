var Hapi = require('hapi');
var server = Hapi.server({host: 'localhost', port: 3000 });
//var server = Hapi.server({host: '192.168.0.24', port: 3000 });
//var server = new Hapi.Server('localhost', 3000);

server.route({method:'GET', path:'/', handler:function(request,h) { 
    return 'hello Hapi world!'; 
}});
server.route({method:'GET', path:'/{name}', handler:function(request,h) { 
    return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
}});

server.route({method: 'GET', path: '/users', handler: function(request, reply) {
    var result = {};
//    setTimeout(function () {
        result.user = [
            { first: 'Abraham', last: 'Lincoln' },
            { first: 'Andrew', last: 'Johnson' },
            { first: 'Ulysses', last: 'Grant' }
        ];
        result.time = Date.now();
        //return reply(result).header('X-Special-Header', 'MEAN Stack');
        return result;
//    }, 1400);
}});

//server.start();
var init = async() => {
    try {
        await server.register(require('inert'));
        server.route({method:'GET', path:'/{file}.epub', handler:function(request,h) { 
            return h.file('./public/' + encodeURIComponent(request.params.file) + '.epub');
        }});
        server.route({method:'GET', path:'/{file}.pdf', handler:function(request,h) { 
            return h.file('./public/' + encodeURIComponent(request.params.file) + '.pdf');
        }});
        server.route({method:'GET', path:'/angular-exercise', handler:function(request,h) { 
            return h.file('./public/angular-exercise.html');
        }});
        await server.start(); 
        console.log(`Hapi Server started at: ${server.info.uri}.`)
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
