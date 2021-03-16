function updateDynamicCache(dynamicCahe, request, response) {
	if (response.ok) {
		caches.open(dynamicCahe).then(cache =>{
			cache.put(request, response.clone());
			return response.clone();
		});
	}
	else{
		return response;
	}
}