db = db.getSiblingDB('users');	// use <db> syntax doesn't work in js

db.createUser({
  user: "rick",
  pwd: "hunter2",
  roles: [ { role: "readWrite", db: "users" } ]
});

//NOTE: passwords are prehashed versions of "password"
db.users.insertOne({ 
	userID: "test_user1", 
	email: "test_user1@gmail.com", 
	password: "$2a$08$VaaE1RdyjCfbAEeBwMy1vOaGN8uFFgSIh68u4kkr9cEIcos2cHNZi", 
	businesses: [ 1, 4, 7, 10, 13, 16, 19 ],
	photos: [ 1, 4, 7, 10 ],
	reviews: [  1, 4, 7, 10 ]
});
db.users.insertOne({ 
	userID: "test_user2", 
	email: "test_user2@gmail.com", 
	password: "$2a$08$VaaE1RdyjCfbAEeBwMy1vOaGN8uFFgSIh68u4kkr9cEIcos2cHNZi", 
	businesses: [ 2, 5, 8, 11, 14, 17 ],
	photos: [ 2, 5, 8 ],
	reviews: [  2, 5, 8  ]
});
db.users.insertOne({ 
	userID: "test_user3", 
	email: "test_user3@gmail.com", 
	password: "$2a$08$VaaE1RdyjCfbAEeBwMy1vOaGN8uFFgSIh68u4kkr9cEIcos2cHNZi", 
	businesses: [ 3, 6, 9, 12, 15, 18 ],
	photos: [ 3, 6, 9 ],
	reviews: [ 3, 6, 9 ]
});

db.users.createIndex({ userID: 1 }, { unique: true });