
self.addEventListener('install', (event) => {
 event.waitUntil(
   caches.open('restaurant').then((cache) => {
     return cache.addAll([
       '/',
       '/index.html',
       '/restaurant.html',
       '/css/styles.css',
       '/js/main.js',
       '/js/restaurant_info.js',
       '/js/dbhelper.js',
       '/data/restaurants.json',
       '/images/'
     ]).then(() => {
      console.log('All Files are cached');
      return self.skipWaiting();
     }).catch((error) => {
      console.log('Failed to cache', error);
     })
   })
 );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
});

/*self.addEventListener('fetch', function(event) {
  console.log('Fetching:', event.request.url);
});*/
self.addEventListener('fetch', (event) => {
  //console.log(event.request.url);
  var request = event.request;
  console.log('request:', request)
  event.respondWith(
    caches.match(request).then((response) => {
      if(response) {
        return response;
      }
      return fetch(request).then((response) => {//return response || fetch(event.request);
        var responsetoCache = response.clone();
        caches.open('restaurant').then((cache) => {
          cache.put(request, responsetoCache).catch((err) => {
            console.log('error!!: ', err);
          });
        });
        return response;
      });
    })
  )
});