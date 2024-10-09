'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "310eeb9849609a367fd5cb8d85418e2c",
"assets/AssetManifest.bin.json": "4538aa996afafa14adf5aca7a6c82c59",
"assets/AssetManifest.json": "e34421ca0a17b45d7ec1aeadacbe783e",
"assets/assets/images/background/back.PNG": "217025bdbbeb8c801c85457cd25fcca9",
"assets/assets/images/logo/client.png": "01803ac20cb67cf6acbb00d2f7223a64",
"assets/assets/images/logo/Icons.PNG": "cdb474c24491ff5913797e5731378b36",
"assets/assets/images/logo/Logofreelancer.png": "17189749b3dec0e9267f0ac93124bfc2",
"assets/assets/images/logo/User1.png": "57bd50e4a159004a029bd1b51db07999",
"assets/assets/images/logo/WorkWave1.png": "71fc061e8e7bcdce7d772f5bdf08b8ff",
"assets/assets/images/Team/background.jpg": "d6dd2d6a2f8d2d53c3656832dd2e14bd",
"assets/assets/images/Team/Bushra.jpeg": "8fe7af0f615d607940cee01b48f14fd6",
"assets/assets/images/Team/Faizan.jpg": "78466d27c6ffa2e66baf178590532fb9",
"assets/assets/images/Team/Fatima.jpg": "be779698efbc83fc5ee42c71f4e6324c",
"assets/assets/images/Team/rimsha.jpeg": "a93d968cc265e17252d0300a76a339ed",
"assets/assets/images/Team/Sehrish.jpg": "31dab51bad5bce3cf0d6f4605711fd86",
"assets/assets/images/Team/Shakir.jpg": "fe2eabc606e5656fcf179581a45e8015",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "e7d24fadba6b2ed189b40f4b4616c1d0",
"assets/NOTICES": "2875b55bcdb374bffc4fc619dc5dcae9",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "7d7d11d311494c798f1c2a0a53f9b163",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "b0905b3a5dfed325a28628f3b03bb269",
"icons/Icon-192.png": "283b5a7996e34a21c5abd5b06eb55b7c",
"icons/Icon-512.png": "34471c3d273fc60df567ff6ab8767ec0",
"icons/Icon-maskable-192.png": "283b5a7996e34a21c5abd5b06eb55b7c",
"icons/Icon-maskable-512.png": "34471c3d273fc60df567ff6ab8767ec0",
"index.html": "c3d2220dac8f1e98c163ef99603a927d",
"/": "c3d2220dac8f1e98c163ef99603a927d",
"main.dart.js": "d8a0208b4b947b11e5c97ae502d2bc2b",
"manifest.json": "58cbd2551e77d933d210fceddb2cd6f6",
"splash/img/dark-1x.png": "9383ec47ff6dd7e43a4e7449b55eee4d",
"splash/img/dark-2x.png": "986f701ac2a4153bb93951056d1005dc",
"splash/img/dark-3x.png": "931bfa01de1d46b89a659fb9f750c2e6",
"splash/img/dark-4x.png": "131ba8a9d2a8e9e61bbd9dd330653e5f",
"splash/img/light-1x.png": "9383ec47ff6dd7e43a4e7449b55eee4d",
"splash/img/light-2x.png": "986f701ac2a4153bb93951056d1005dc",
"splash/img/light-3x.png": "931bfa01de1d46b89a659fb9f750c2e6",
"splash/img/light-4x.png": "131ba8a9d2a8e9e61bbd9dd330653e5f",
"version.json": "8c2d4b03a5f80a7c81d6ae6242e94dfa"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
