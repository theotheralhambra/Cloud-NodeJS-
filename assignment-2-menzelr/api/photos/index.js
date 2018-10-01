const router = require('express').Router();
const validation = require('../../lib/validation');

//let photos = require('./photos');

exports.router = router;
//exports.photos = photos;

/*
 * Schema describing required/optional fields of a photo object.
 */
const photoSchema = {
  userid: { required: true },
  businessid: { required: true },
  caption: { required: false },
  data: { required: true }
};

function insertNewPhoto(photo, mysqlPool) {
	return new Promise((resolve, reject) => {
		const photoValues = {
			id: 33,
			userid: photo.userid,
			businessid: photo.businessid,
			caption: photo.caption,
			data: photo.data
		};
		mysqlPool.query(
			'INSERT INTO photos SET ?',
			photoValues,
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
 * Route to create a new photo.
 */
router.post('/', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	
	if (validation.validateAgainstSchema(req.body, photoSchema)) {
		let newPhoto = validation.extractValidFields(req.body, photoSchema);
		insertNewPhoto(newPhoto, mysqlPool)
			.then((id) => {
				res.status(201).json({
					id: id,
					links: {
						photo: `/photos/${id}`
					}
				});
			})
			.catch((err) => {
				res.status(500).json({
					error: "Error inserting photo into DB.  Please try again later."
				});
			});
	} else {
		res.status(400).json({
			error: "Request body is not a valid photo object"
		});
	}
});

function getPhotoByID(photoID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM photos WHERE id = ?', [ photoID ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results[0]);
			}
		});
	});
}

/*
 * Route to fetch info about a specific photo.
 */
router.get('/:photoID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const photoID = parseInt(req.params.photoID);
	
	getPhotoByID(photoID, mysqlPool)
		.then((photo) => {
			res.status(201).json(photo);
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to fetch photo.  Please try again later."
			});
		});
});

function updatePhotoByID(photoID, photo, mysqlPool) {
	return new Promise((resolve, reject) => {
		const photoValues = {
			userid: photo.userid,
			businessid: photo.businessid,
			caption: photo.caption,
			data: photo.data
		};
		mysqlPool.query('UPDATE photos SET ? WHERE id = ?', [ photoValues, photoID ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

/*
 * Route to update a photo.
 */
router.put('/:photoID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const photoID = parseInt(req.params.photoID);
	
	if (validation.validateAgainstSchema(req.body, photoSchema)) {
		let newPhoto = validation.extractValidFields(req.body, photoSchema);
		getPhotoByID(photoID, mysqlPool)
			.then((currPhoto) => {
				if (currPhoto) {
					if (newPhoto.businessid === currPhoto.businessid && newPhoto.userid === currPhoto.userid) { 
						updatePhotoByID(photoID, newPhoto, mysqlPool)
							.then((updateSuccessful) => {
								if (updateSuccessful) {
									res.status(200).json({
										links: {
											photo: `/${photoID}`
										}
									});
								} else {
									next();
								}
							})	
					} else {
						res.status(403).json({
							error: "Updated photo must have the same businessID and userID."
						});
					}
				} else {
					next();
				}	
			})
			.catch((err) => {
				res.status(500).json({
					error: "Unable to update photo."
				});
			});
	} else {
		res.status(400).json({
			error: "Request body is not a valid photo object"
		});
	}
});

function deletePhotoByID(photoID, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('DELETE FROM photos WHERE id = ?', [ photoID ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

/*
 * Route to delete a photo.
 */
router.delete('/:photoID', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const photoID = parseInt(req.params.photoID);

	deletePhotoByID(photoID, mysqlPool) 
		.then((deleteSuccessful) => {
			if (deleteSuccessful) {
				res.status(204).end();
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to delete photo."
			});
		});
});
