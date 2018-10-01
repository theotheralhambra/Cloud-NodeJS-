const router = require('express').Router();
const validation = require('../../lib/validation');

//let categories = require('./categories');

exports.router = router;
//exports.categories = categories;

/*
 * Schema describing required/optional fields of a category object.
 */
const categorySchema = {
	categoryName: { required: true }
};


/*
 * Schema describing required/optional fields of a subcategory object.
 */
const subcategorySchema = {
	categoryName: { required: true },
	subcategoryName: { required: true }
};

function getCategories(mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM categories', function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve({
					categories: results
				});
			}
		});
	});
}

router.get('/', function (req, res) {
	const mysqlPool = req.app.locals.mysqlPool;
	getCategories(mysqlPool)
		.then((categoryList) => {
			res.status(200).json(categoryList);
		})
		.catch((err) => {
			console.log('  -- err:', err);
			res.status(500).json({
				error: "Error fetching category list.  Please try again later."
			});
		});
});

function checkCategory(category, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM categories WHERE categoryName = ?', [ category ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results[0]);
			}
		});
	});
}

function checkSubcategory(subcategory, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT * FROM subcategories WHERE categoryName = ? AND subcategoryName = ?', [ subcategory.categoryName, subcategory.categoryName ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve(results[0]);
			}
		});
	});
}

function getCategory(category, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('SELECT subcategoryName FROM subcategories WHERE categoryName = ?', [ category ], function (err, results) {
			if (err) {
				reject(err);
			} else {
				resolve({
					category: category,
					subcategories: results
				});
			}
		});
	});
}

function insertNewCategory(category, mysqlPool) {
	return new Promise((resolve, reject) => {
		const categoryValues = {
			categoryName: category.categoryName
		};
		mysqlPool.query(
			'INSERT INTO categories SET ?',
			categoryValues,
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

function insertNewSubcategory(subcategory, mysqlPool) {
	return new Promise((resolve, reject) => {
		const categoryValues = {
			categoryName: subcategory.categoryName,
			subcategoryName: subcategory.subcategoryName
		};
		mysqlPool.query(
			'INSERT INTO subcategories SET ?',
			categoryValues,
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
 * Route to create a new category.
 */
router.post('/', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	
	if (validation.validateAgainstSchema(req.body, categorySchema)) {
		/*
		* Make sure category doesn't already exist.
		*/
		let newCategory = validation.extractValidFields(req.body, categorySchema); // may not work
		checkCategory(newCategory, mysqlPool)
			.then((category) => {
				if (category) {
					res.status(403).json({
						error: "Specified category already exists"
					});
				} else {
					insertNewCategory(newCategory, mysqlPool)
						.then((id) => {
							res.status(201).json({
								links: {
									category: `/categories/${newCategory.categoryName}`
								}
							});
						})
				}
			})
			.catch((err) => {
				res.status(500).json({
					error: "Error inserting category into DB.  Please try again later."
				});
			});

	} else {
		res.status(400).json({
			error: "Request body is not a valid category object"
		});
	}
});


/*
 * Route to fetch info about a specific category.
 */
router.get('/:category', function (req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const categoryName = req.params.category;
  
	getCategory(categoryName, mysqlPool)
			.then((categoryInfo) => {
				if (categoryInfo) {
					res.status(200).json({
						category: categoryName,
						subcategories: categoryInfo
					});
				} else {
					next();
				}
			})
			.catch((err) => {
				res.status(500).json({
					error: "Unable to fetch category."
				});
			});
});


/*
 * Route to add a subcategory to a categpry.
 */
router.post('/:category', function (req, res, next) {
	const categoryName = req.params.category;
	const mysqlPool = req.app.locals.mysqlPool;
  
	checkCategory(categoryName, mysqlPool)
		.then((category) => {
			if (category) {
				if (validation.validateAgainstSchema(req.body, subcategorySchema)) {
					/*
					 * Make sure subcategory doesn't already exist for category.
					 */
					let newSubcategory = validation.extractValidFields(req.body, subcategorySchema);
					checkSubcategory(newSubcategory, mysqlPool)
						.then((subcategory) => {
							if (subcategory) {
								res.status(403).json({
									error: "Specified subcategory already exists"
								});
							} else {
								insertNewSubcategory(newSubcategory, mysqlPool)
									.then((id) => {
										res.status(201).json({
											links: {
												subcategory: `/categories/${categoryName}`
											}
										});
									})
							}
						})
				} else {
					res.status(400).json({
						error: "Request body is not a valid subcategory object"
					});
				} 	
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Error inserting subcategory into DB.  Please try again later."
			});
		});
});

function deleteAllSubcategories(category, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('DELETE FROM subcategories WHERE categoryName = ?', [ category ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

function deleteCategory(category, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('DELETE FROM categories WHERE categoryName = ?', [ category ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

/*
 * Route to delete a category.
 */
router.delete('/:category', function( req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const categoryName = req.params.category;
	
	deleteAllSubcategories(categoryName, mysqlPool)
		.then((subdeleteSuccessful) => {
			if (subdeleteSuccessful) {
				deleteCategory(categoryName, mysqlPool)
					.then((deleteSuccessful) => {
						if (deleteSuccessful) {
							res.status(204).end();
						} else {
							next();
						}
					})
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to delete category."
			});
		});
});

function deleteSubcategory(category, subcategory, mysqlPool) {
	return new Promise((resolve, reject) => {
		mysqlPool.query('DELETE FROM subcategories WHERE categoryName = ? AND subcategoryName = ?', [ category, subcategory ], function (err, result) {
			if (err) {
				reject(err);
			} else {
				resolve(result.affectedRows > 0);
			}
		});
	});
}

/*
 * Route to delete a subcategory.
 */
router.delete('/:category/:subcategory', function( req, res, next) {
	const mysqlPool = req.app.locals.mysqlPool;
	const categoryName = req.params.category;
	const subcategoryName = req.params.subcategory;
	
	checkCategory(categoryName, mysqlPool)
		.then((category) => {
			if (category) {
				deleteSubcategory(categoryName, subcategoryName, mysqlPool)
					.then((deleteSuccessful) => {
						if (deleteSuccessful) {
							res.status(204).end();
						} else {
							next();
						}
					})
			} else {
				next();
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "Unable to delete subcategory."
			});
		});
});
