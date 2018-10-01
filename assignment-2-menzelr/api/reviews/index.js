const router = require('express').Router();
const validation = require('../../lib/validation');

//let reviews = require('./reviews');

exports.router = router;
//exports.reviews = reviews;

/*
 * Schema describing required/optional fields of a review object.
 */
const reviewSchema = {
  userid: { required: true },
  businessid: { required: true },
  dollars: { required: true },
  stars: { required: true },
  reviewText: { required: false }
};

function checkReview(review, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM reviews WHERE userid = ? AND businessid = ?', [ review.userid, review.businessid ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results[0]);
			}
		});
	});
}

function insertNewReview(review, mysqlPool) {
	return new Promise((resolve, reject) => {
		const reviewValues = {
			id: 33,
			userid: review.userid,
			businessid: review.businessid,
			dollars: review.dollars,
			stars: review.stars,
			reviewText: review.reviewText
		};
		mysqlPool.query(
			'INSERT INTO reviews SET ?',
			reviewValues,
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
 * Route to create a new review.
 */
router.post('/', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
  
	checkReview(req.body, mysqlPool)
		.then((review) => {
			if (review) {
				res.status(403).json({
						error: "User has already posted a review of this business."
				});
			} else {
				if (validation.validateAgainstSchema(req.body, reviewSchema)) {
					let newReview = validation.extractValidFields(req.body, reviewSchema);
					insertNewReview(newReview, mysqlPool)
						.then((id) => {
							res.status(201).json({
								id: id,
								links: {
									review: `/reviews/${id}`,
									business: `/businesses/${newReview.businessid}`
								}
							});
						})
				} else {
					res.status(400).json({
						error: "Request body is not a valid review object"
					});
				}
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Error inserting review into DB.  Please try again later."
			});
		});
});

function getReviewByID(reviewID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM reviews WHERE id = ?', [ reviewID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results[0]);
			}
		});
	});
}

/*
 * Route to fetch info about a specific review.
 */
router.get('/:reviewID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const reviewID = parseInt(req.params.reviewID);
	
	getReviewByID(reviewID, mysqlPool)
		.then((review) => {
			res.status(201).json(review);
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to fetch review.  Please try again later."
			});
		});
});

function updateReviewByID(reviewID, review, mysqlPool) {
	return new Promise((resolve, reject) => {
		const reviewValues = {
			userid: review.userid,
			businessid: review.businessid,
			dollars: review.dollars,
			stars: review.stars,
			reviewText: review.reviewText
		};
		mysqlPool.query('UPDATE reviews SET ? WHERE id = ?', [ reviewValues, reviewID ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

/*
 * Route to update a review.
 */
router.put('/:reviewID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const reviewID = parseInt(req.params.reviewID);
	
	if (validation.validateAgainstSchema(req.body, reviewSchema)) {
		let newReview = validation.extractValidFields(req.body, reviewSchema);
		getReviewByID(reviewID, mysqlPool)
			.then((currReview) => {
				if (currReview) {
					if (newReview.businessid === currReview.businessid && newReview.userid === currReview.userid) {
						updateReviewByID(reviewID, newReview, mysqlPool)
							.then((updateSuccessful) => {
								if (updateSuccessful) {
									res.status(200).json({
										links: {
											review: `reviews/${reviewID}`
										}
									});
								} else {
									next();
								}
							})
					} else {
						res.status(403).json({
							error: "Updated review must have the same businessID and userID."
						});
					}
				} else {
					next();
				}
			})
			.catch((err) => {
				res.status(500).json({
					error: "Unable to update review."
				});
			});	
	} else {
		res.status(400).json({
			error: "Request body is not a valid review object"
		});
	}
});

function deleteReviewByID(reviewID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('DELETE FROM reviews WHERE id = ?', [ reviewID ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}
/*
 * Route to delete a review.
 */
router.delete('/:reviewID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const reviewID = parseInt(req.params.reviewID);
	
	deleteReviewByID(reviewID, mysqlPool)
		.then((deleteSuccessful) => {
			if (deleteSuccessful) {
				res.status(204).end();
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to delete review."
			});
		});
});
