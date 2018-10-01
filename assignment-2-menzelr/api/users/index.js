const router = require('express').Router();

exports.router = router;

//const { businesses } = require('../businesses');
//const { reviews } = require('../reviews');
//const { photos } = require('../photos');

function getBusinessesByUserID(userID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM businesses WHERE ownerid = ?', [ userID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}

/*
 * Route to list all of a user's businesses.
 */
router.get('/:userID/businesses', function (req, res) {
	const mysqlPool = req.app.locals.mysqlPool;
	const userID = parseInt(req.params.userID);
	
	getBusinessesByUserID(userID, mysqlPool)
		.then((businessList) => {
			res.status(200).json(businessList);
		})
		.catch((err) => {
			console.log('  -- err:', err);
			res.status(500).json({
				error: "Error fetching businesses list.  Please try again later."
			});
		});
});


function getReviewsByUserID(userID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM reviews WHERE userid = ?', [ userID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}
/*
 * Route to list all of a user's reviews.
 */
router.get('/:userID/reviews', function (req, res) {
	const mysqlPool = req.app.locals.mysqlPool;
	const userID = parseInt(req.params.userID);
	
	getReviewsByUserID(userID, mysqlPool)
		.then((businessList) => {
			res.status(200).json(businessList);
		})
		.catch((err) => {
			console.log('  -- err:', err);
			res.status(500).json({
				error: "Error fetching reviews list.  Please try again later."
			});
		});
});

function getPhotosByUserID(userID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM photos WHERE userid = ?', [ userID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
}
/*
 * Route to list all of a user's photos.
 */
router.get('/:userID/photos', function (req, res) {
	const mysqlPool = req.app.locals.mysqlPool;
	const userID = parseInt(req.params.userID);
	
	getPhotosByUserID(userID, mysqlPool)
		.then((businessList) => {
			res.status(200).json(businessList);
		})
		.catch((err) => {
			console.log('  -- err:', err);
			res.status(500).json({
				error: "Error fetching photos list.  Please try again later."
			});
		});
});
