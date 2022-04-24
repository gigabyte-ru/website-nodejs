product-memory: # Run parser for product memory
	node --es-module-specifier-resolution=node src/bin/product-memory.js productId=${productId}

product-images: # Run parser for product images
	node --es-module-specifier-resolution=node src/bin/product-images.js productId=${productId}