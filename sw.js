importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';



const APP_SHELL = [
    '/twittor-pwa/',
	'index.html',
	'css/style.css',
	'img/favicon.ico',
	'img/avatars/hulk.jpg',
	'img/avatars/ironman.jpg',
	'img/avatars/spiderman.jpg',
	'img/avatars/thor.jpg',
	'img/avatars/wolverine.jpg',
	'js/app.js',
	'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
	'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
	'css/animate.css',
	'js/libs/jquery.js'
];

self.addEventListener('install', e =>{
	const cacheStatic = caches.open( STATIC_CACHE ).then( cache => 
		cache.addAll( APP_SHELL ));

	const cacheInmutable = caches.open( INMUTABLE_CACHE ).then( cache =>
		cache.addAll( APP_SHELL_INMUTABLE ));

	e.waitUntil(Promise.all([cacheStatic]));
});

self.addEventListener('activate', e => {
    const response = caches.keys().then(keys =>{
        return Promise.all(
            keys
                .filter(cacheName => (cacheName.startsWith('static')))
                .filter(cacheName => (cacheName !== STATIC_CACHE ))
                .map(cacheName => caches.delete(cacheName))
        );
    });
    e.waitUntil( response );	
});

self.addEventListener('fetch', e => {
    const responseStrategy = caches.match( e.request )
        .then( response => {
            if ( response ){
            	return response
            }
            else{
	            return fetch( e.request ).then( newResponse => {
	            	let dataNueva = updateDynamicCache(DYNAMIC_CACHE, e.request, newResponse);
	            	return dataNueva;
	            });
        	}


        });
    e.respondWith( responseStrategy );	
});