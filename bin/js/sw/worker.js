// offline version
var CACHE_NAME = 'offline-cache';

// Files required to make this app work offline
var REQUIRED_FILES = [
    'offline.html',
    'offline.css',
    'offline.png',
    'worker.php',
    '/favicon.ico'
];

self.addEventListener('install', function (event) {
    "use strict";
    console.log('sw installed');


    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // Add all offline dependencies to the cache
            return cache.addAll(REQUIRED_FILES);
        }).then(function () {
            // At this point everything has been cached
            return self.skipWaiting();
        }).catch(function (e) {
            console.error(e);
        })
    );
});

self.addEventListener('fetch', function (event) {
    "use strict";

    var request = event.request;

    if (request.method === 'GET') {
        event.respondWith(
            self.caches.open(CACHE_NAME).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    // Cache hit - return the response from the cached version
                    if (response) {
                        return response;
                    }

                    if (request.url.match('/admin/')) {
                        return fetch(request).catch(function () {
                            return new Response('An error has occurred when requesting the server.');
                        });
                    }

                    return fetch(request).catch(function () {
                        return cache.match('offline.html');
                    });
                });
            })
        );
    }
});

self.addEventListener('activate', function (event) {
    "use strict";
    console.log('sw activated');
});
