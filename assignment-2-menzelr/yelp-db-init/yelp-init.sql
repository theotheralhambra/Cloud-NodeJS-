-- MySQL dump 10.13  Distrib 5.7.22, for Linux (x86_64)
--
-- Host: localhost    Database: yelp-like-api
-- ------------------------------------------------------
-- Server version	5.7.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `businesses`
--
DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `businesses` (
	`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`address` VARCHAR(255) NOT NULL,
	`city` VARCHAR(255) NOT NULL,
	`state` CHAR(2) NOT NULL,
	`zip` CHAR(5) NOT NULL,
	`phone` CHAR(12) NOT NULL,
	`category` VARCHAR(255) NOT NULL,
	`subcategory` VARCHAR(255) NOT NULL,
	`website` VARCHAR(255),
	`email` VARCHAR(255),
	`ownerid` MEDIUMINT NOT NULL,
	PRIMARY KEY (`id`),
	INDEX `idx_ownerid` (`ownerid`)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;

INSERT INTO `businesses` VALUES 
(
  1,
  'Block 15',
  '300 SW Jefferson Ave.',
  'Corvallis', 'OR', '97333',
  '541-758-2077',
  'Restaurant',
  'Brewpub',
  'http://block15.com',
  'business@block15.com',
  '1'
),
(
  10,
  'Corvallis Brewing Supply',
  '119 SW 4th St.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Shopping',
  'Brewing Supply',
  'http://www.lickspigot.com',
  'business@lickspigot.com',
  '10'
),
(
  2,
  'Robnetts Hardware',
  '400 SW 2nd St.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Shopping',
  'Hardware',
  'http://www.robnetts.com',
  'business@robnetts.com',
  '2'
),
(
  3,
  'First Alternative Co-op North Store',
  '2855 NW Grant Ave.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Shopping',
  'Groceries',
  'http://www.firstalt.com',
  'business@firstalt.com',
  '3'
),
(
  4,
  'WinCo Foods',
  '2335 NW Kings Blvd.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Shopping',
  'Groceries',
  'http://www.winco.com',
  'business@winco.com',
  '4'
),
(
  5,
  'Fred Meyer',
  '777 NW Kings Blvd.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Shopping',
  'Groceries',
  'http://www.fredmeyer.com',
  'business@fredmeyer.com',
  '5'
),
(
  6,
  'Interzone',
  '1563 NW Monroe Ave.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Restaurant',
  'Coffee Shop',
  'http://www.interzone.com',
  'business@interzone.com',
  '6'
),
(
  7,
  'The Beanery Downtown',
  '500 SW 2nd St.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Restaurant',
  'Coffee Shop',
  'http://www.beanery.com',
  'business@beanery.com',
  '7'
),
(
  8,
  'Local Boyz',
  '1425 NW Monroe Ave.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Restaurant',
  'Hawaiian',
  'http://www.lboyz.com',
  'business@lboyz.com',
  '8'
),
(
  9,
  'Darkside Cinema',
  '215 SW 4th St.',
  'Corvallis', 'OR', '97333',
  '541-758-1674',
  'Entertainment',
  'Movie Theater',
  'http://darksidecinema.com',
  'business@darksidecinema.com',
  '9'
);
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

--
-- Table structure for table `reviews`
--
DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviews` (
	`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
	`userid` MEDIUMINT NOT NULL,
	`businessid` MEDIUMINT NOT NULL,
	`dollars` DECIMAL(2,1) NOT NULL,
	`stars` DECIMAL(2,1) NOT NULL,
	`reviewText` VARCHAR(255),
	PRIMARY KEY (`id`),
	FOREIGN KEY (`businessid`) REFERENCES `businesses`(`id`),
	INDEX `idx_userid1` (`userid`),
	INDEX `idx_businessid1` (`businessid`)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */; 

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES 
(
	1,
	7,
	8, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	2,
	2,
	2, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	3,
	8,
	1, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	4,
	12,
	2, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	5,
	3,
	3, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	6,
	9,
	4, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	7,
	6,
	5, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	8,
	4,
	6, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	9,
	5,
	7, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	10,
	5,
	8, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	11,
	0,
	9, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	12,
	1,
	1, 
	2.0,
	4.5,
	'Some text about a business'
),
(
	13,
	12,
	10, 
	2.0,
	4.5,
	'Some text about a business'
);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
	`id` MEDIUMINT NOT NULL AUTO_INCREMENT,
	`userid` MEDIUMINT NOT NULL,
	`businessid` MEDIUMINT NOT NULL,
	`caption` VARCHAR(255),
	`data` VARCHAR(255),
	PRIMARY KEY (`id`),
	FOREIGN KEY (`businessid`) REFERENCES `businesses`(`id`),
	INDEX `idx_userid2` (`userid`),
	INDEX `idx_businessid2` (`businessid`)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES 
(
	1,
	7,
	8, 
	'This is a caption.',
	'010010101110101010110'
),
(
	2,
	2,
	10, 
	'This is a caption.',
	'010010101110101010110'
),
(
	3,
	8,
	1, 
	'This is a caption.',
	'010010101110101010110'
),
(
	4,
	12,
	2, 
	'This is a caption.',
	'010010101110101010110'
),
(
	5,
	3,
	3, 
	'This is a caption.',
	'010010101110101010110'
),
(
	6,
	9,
	4, 
	'This is a caption.',
	'010010101110101010110'
),
(
	7,
	6,
	5, 
	'This is a caption.',
	'010010101110101010110'
),
(
	8,
	4,
	6, 
	'This is a caption.',
	'010010101110101010110'
),
(
	9,
	5,
	7, 
	'This is a caption.',
	'010010101110101010110'
),
(
	10,
	5,
	8, 
	'This is a caption.',
	'010010101110101010110'
),
(
	11,
	10,
	9, 
	'This is a caption.',
	'010010101110101010110'
),
(
	12,
	1,
	1, 
	'This is a caption.',
	'010010101110101010110'
),
(
	13,
	12,
	10, 
	'This is a caption.',
	'010010101110101010110'
);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;


--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
	`categoryName` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`categoryName`)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ( 'Restaurant' ),( 'Shopping' ),( 'Entertainment' );
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `subcategories`
--

DROP TABLE IF EXISTS `subcategories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subcategories` (
	`categoryName` VARCHAR(255) NOT NULL,
	`subcategoryName` VARCHAR(255),
	PRIMARY KEY (`categoryName`,`subcategoryName`),
	FOREIGN KEY (`categoryName`) REFERENCES `categories`(`categoryName`)
)ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategories`
--

LOCK TABLES `subcategories` WRITE;
/*!40000 ALTER TABLE `subcategories` DISABLE KEYS */;
INSERT INTO `subcategories` VALUES 
(
	'Restaurant',
	'Brewpub'
),
(
	'Restaurant',
	'Coffee Shop'
),
(
	'Restaurant',
	'Hawaiian'
),
(
	'Restaurant',
	'Bakery'
),
(
	'Restaurant',
	'Pizza'
),
(
	'Restaurant',
	'Mexican'
),
(
	'Restaurant',
	'Chinese'
),
(
	'Restaurant',
	'Indian'
),
(
	'Restaurant',
	'Italian'
),
(
	'Shopping',
	'Hardware'
),
(
	'Shopping',
	'Brewing Supply'
),
(
	'Shopping',
	'Groceries'
),
(
	'Shopping',
	'Book Store'
),
(
	'Shopping',
	'Flowers'
),
(
	'Entertainment',
	'Nightclub'
),
(
	'Entertainment',
	'Movie Theater'
),
(
	'Entertainment',
	'Art Gallery'
);
/*!40000 ALTER TABLE `subcategories` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
