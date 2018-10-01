const router = require('express').Router();
const validation = require('../../lib/validation');

//let businesses = require('./businesses');
//const { reviews } = require('../reviews');
//const { photos } = require('../photos');

exports.router = router;
//exports.businesses = businesses;

/*
 * Schema describing required/optional fields of a business object.
 */
const businessSchema = {
	ownerid: { required: true },
	name: { required: true },
	address: { required: true },
	city: { required: true },
	state: { required: true },
	zip: { required: true },
	phone: { required: true },
	category: { required: true },
	subcategory: { required: true },
	website: { required: false },
	email: { required: false }
};

function validateBusinessObject(business) {
	return business && business.name && 
	       business.address && business.city && 
	       business.state && business.zip && 
	       business.phone && business.category && 
	       business.subcategory && business.ownerid;
}

function getBusinessesCount(mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT COUNT(*) AS count FROM businesses', function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results[0].count);
			}
		});
	});
}

function getBusinessesPage(page, totalCount, mysqlPool) {
	return new Promise((resolve, reject) => {
		const numPerPage = 10;
		const lastPage = Math.ceil(totalCount / numPerPage);
		page = page < 1 ? 1 : page;
		page = page > lastPage ? lastPage : page;
		const offset = (page - 1) * numPerPage;
		mysqlPool.query('SELECT * FROM businesses ORDER BY id LIMIT ?,?', [offset, numPerPage], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve({
					businesses: results,
					pageNumber: page,
					totalPages: lastPage,
					pageSize: numPerPage,
					totalCount: totalCount
				});
			}
		});
	});
}

/*
 * Route to return a list of businesses.
 */
router.get('/', function (req, res) {
	
	const mysqlPool = req.app.locals.mysqlPool;
	getBusinessesCount(mysqlPool)
		.then((count) => {
			return getBusinessesPage(parseInt(req.query.page) || 1, count, mysqlPool);
		})
		.then((businessesPageInfo) => {
			businessesPageInfo.links = {};
			let { links, pageNumber, totalPages } = businessesPageInfo;
			if (pageNumber < totalPages) {
				links.nextPage = '/businesses?page=' + (pageNumber + 1);
				links.lastPage = '/businesses?page=' + totalPages;
			}
			if (pageNumber > 1) {
				links.prevPage = '/businesses?page=' + (pageNumber - 1);
				links.firstPage = '/businesses?page=1';
			}
			res.status(200).json(businessesPageInfo);
		})
		.catch((err) => {
			console.log('  -- err:', err);
			res.status(500).json({
				error: "Error fetching businesses list.  Please try again later."
			});
		});
});

function insertNewBusiness(business, mysqlPool) {
	return new Promise((resolve, reject) => {
		const businessValues = {
			id: 33,
			name: business.name,
			address: business.address,
			city: business.city,
			state: business.state,
			zip: business.zip,
			phone: business.phone,
			category: business.category,
			subcategory: business.subcategory,
			website: business.website,
			email: business.email,
			ownerid: business.ownerid
		};
		mysqlPool.query(
			'INSERT INTO businesses SET ?',
			businessValues,
			function (err, result) {
				if (err) {
					reject(err);
				} else {
					resolve(result.insertId);
				}
			}
		);
	});
}

/*
 * Route to create a new business.
 */
router.post('/', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	//if (validation.validateAgainstSchema(req.body, businessSchema)) {
		// let business = validation.extractValidFields(req.body, businessSchema);
	if (validateBusinessObject(req.body)) {		//see above
		insertNewBusiness(req.body, mysqlPool)
			.then((id) => {
				res.status(201).json({
					id: id,
					links: {
						business: `/businesses/${id}`
					}
				});
			})
			.catch((err) => {
				res.status(500).json({
					error: "Error inserting business into DB.  Please try again later."
				});
			});
	} else {
		res.status(400).json({
			error: "Request body is not a valid business object"
		});
	}
});
	

function getBusinessByID(businessID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM businesses WHERE id = ?', [ businessID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results[0]);
			}
		});
	});
}

function getReviewsByBusinessID(businessID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM reviews WHERE businessid = ?', [ businessID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}

function getPhotosByBusinessID(businessID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM photos WHERE businessid = ?', [ businessID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}
////////////////////////////////////WIP//////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Route to fetch info about a specific business.
 */
router.get('/:businessID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const businessID = parseInt(req.params.businessID);
	
	/*
	 * Find all reviews and photos for the specified business and create a
	 * new object containing all of the business data, including reviews and
	 * photos.
	 */
	//let business = {
	//	reviews: reviews.filter(review => review.businessID === businessID),
	//	photos: photos.filter(photo => photo.businessID === businessID)
	//};
	//Object.assign(business, businesses[businessID]);
	
	getBusinessByID(businessID, mysqlPool)
		.then((business) => {
			if (business) {
				getReviewsByBusinessID(businessID, mysqlPool)
					.then((reviews) => {
						getPhotosByBusinessID(businessID, mysqlPool)
							.then((photos) => {
								res.status(200).json({
									business: business,
									reviews: reviews,
									photos: photos
								});
							})
					})
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to fetch business."
			});
		});
});

////////////////////////////////////WIP//////////////////////////////////////////////////////////////////////////////////////////////////////

function updateBusinessByID(businessID, business, mysqlPool) {
	return new Promise((resolve, reject) => {
		const businessValues = {
			name: business.name,
			address: business.address,
			city: business.city,
			state: business.state,
			zip: business.zip,
			phone: business.phone,
			category: business.category,
			subcategory: business.subcategory,
			website: business.website,
			email: business.email,
			ownerid: business.ownerid
		};
		mysqlPool.query('UPDATE businesses SET ? WHERE id = ?', [ businessValues, businessID ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

/*
 * Route to replace data for a business.
 */
router.put('/:businessID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const businessID = parseInt(req.params.businessID);
	//if (validation.validateAgainstSchema(req.body, businessSchema)) {
		//businesses[businessID] = validation.extractValidFields(req.body, businessSchema);
	if (validateBusinessObject(req.body)) {
		updateBusinessByID(businessID, req.body, mysqlPool)
			.then((updateSuccessful) => {
				if (updateSuccessful) {
					res.status(200).json({
						links: {
							business: `/businesses/${businessID}`
						}
					});
				} else {
					next();
				}
			})
			.catch((err) => {
				res.status(500).json({
					error: "Unable to update business."
				});
			});
	} else {
		res.status(400).json({
			err: "Request body is not a valid business object"
		});
	}
});

function deleteBusinessByID(businessID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('DELETE FROM businesses WHERE id = ?', [ businessID ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

/*
 * Route to delete a business.
 */
router.delete('/:businessID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const businessID = parseInt(req.params.businessID);
	deleteBusinessByID(businessID, mysqlPool)
		.then((deleteSuccessful) => {
			if (deleteSuccessful) {
				res.status(204).end();
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to delete business."
			});
		});
});
