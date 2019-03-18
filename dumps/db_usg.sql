-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: db_usg
-- ------------------------------------------------------
-- Server version	5.5.5-10.1.34-MariaDB

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
-- Table structure for table `tbladjustments`
--

DROP TABLE IF EXISTS `tbladjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbladjustments` (
  `intAdjustmentNo` varchar(15) NOT NULL,
  `intAdjustmentType` int(11) DEFAULT NULL,
  `strAdjustmentNote` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `intAdminID` varchar(15) DEFAULT NULL,
  `intQuantity` int(11) DEFAULT NULL,
  `intInventoryNo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intAdjustmentNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbladjustments`
--

LOCK TABLES `tbladjustments` WRITE;
/*!40000 ALTER TABLE `tbladjustments` DISABLE KEYS */;
INSERT INTO `tbladjustments` VALUES ('1000',1000,'s','2018-08-10 05:59:55','1006',10,'1001'),('1001',1001,'s','2018-08-10 06:02:15','1006',10,'1001'),('1002',1001,'sasa','2018-08-11 06:11:30','1006',10,'1000'),('1003',0,'','2018-08-17 18:00:51','1000',10,'1001'),('1004',0,'','2018-08-17 18:01:16','1000',0,'1001'),('1005',0,'','2018-08-17 18:01:24','1000',0,'1001'),('1006',0,'','2018-08-17 18:03:39','1000',10,'1001'),('1007',0,'','2018-08-17 18:03:56','1000',10,'1001'),('1008',0,'','2018-08-17 18:09:30','1000',10,'1001'),('1009',0,'e','2018-08-23 16:56:12','1000',3,'1009'),('1010',1001,'Returned','2018-08-26 16:52:55','1000',2,'1001'),('1011',1001,'Returned','2018-08-26 16:52:55','1000',1,'1003'),('1012',1001,'Returned','2018-08-26 16:54:02','1000',10,'1001'),('1013',1001,'Returned','2018-08-26 16:54:02','1000',2,'1003'),('1014',1001,'Returned','2018-08-26 16:56:45','1000',15,'1003'),('1015',1001,'Returned','2018-08-26 18:49:30','1000',2,'1003'),('1016',1001,'Returned','2018-08-26 18:49:30','1000',1,'1003'),('1017',0,'','2018-08-31 16:41:18','1000',1,'1001'),('1018',1000,'','2018-08-31 16:43:52','1000',3,'1001'),('1019',1001,'Returned','2018-09-01 06:58:04','1000',1,'1002'),('1020',0,'wsds','2018-09-18 18:05:11','1000',12,'1001'),('1021',1,'dsdsdsdsdsd','2018-09-18 18:05:25','1000',12,'1001'),('1022',0,'Used for Replacement','2018-10-01 19:57:58','1000',1,'1000'),('1023',1,'Chuwaps','2018-10-04 18:54:40','1000',2,'1006'),('1024',0,'Used for Replacement','2018-10-06 01:03:00','1000',1,'1006'),('1025',0,'Used for Replacement','2018-10-06 01:56:41','1000',14,'1006'),('1026',0,'Used for Replacement','2018-10-06 02:40:07','1000',1,'1006'),('1027',0,'Used for Replacement','2018-10-06 02:40:24','1000',1,'1006'),('1028',0,'Used for Replacement','2018-10-06 09:14:12','1000',1,'1000'),('1029',0,'Used for Replacement','2018-10-07 14:44:17','1000',1,'1006'),('1030',0,'Used for Replacement','2018-10-09 06:37:24','1000',2,'1001');
/*!40000 ALTER TABLE `tbladjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbladjustmenttypes`
--

DROP TABLE IF EXISTS `tbladjustmenttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbladjustmenttypes` (
  `intAdjustmentTypeNo` varchar(15) NOT NULL,
  `strAdjustment` varchar(45) DEFAULT NULL,
  `intAdjustmentType` varchar(45) DEFAULT NULL,
  `intStatus` int(11) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `intAdminID` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`intAdjustmentTypeNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbladjustmenttypes`
--

LOCK TABLES `tbladjustmenttypes` WRITE;
/*!40000 ALTER TABLE `tbladjustmenttypes` DISABLE KEYS */;
INSERT INTO `tbladjustmenttypes` VALUES ('1000','Returned','1',1,'2018-08-31 09:47:17','1000'),('1001','Lost','0',1,'2018-08-31 17:19:51','1000'),('1002','Shop Use','0',1,'2018-08-31 17:20:24','1000');
/*!40000 ALTER TABLE `tbladjustmenttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbladmin`
--

DROP TABLE IF EXISTS `tbladmin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbladmin` (
  `intUserID` varchar(15) NOT NULL,
  `strbusinessAddress` varchar(100) DEFAULT NULL,
  `strbusinessEmail` varchar(100) DEFAULT NULL,
  `businessTimeOpening` timestamp NULL DEFAULT NULL,
  `intRole` int(11) NOT NULL,
  `strbusinessName` varchar(45) DEFAULT NULL,
  `strbusinessPhone` varchar(45) DEFAULT NULL,
  `strbusinessMobile` varchar(45) DEFAULT NULL,
  `shippingFee` double DEFAULT NULL,
  `deliveryPeriod` int(11) DEFAULT NULL,
  `paymentVoucherValidity` int(11) DEFAULT NULL,
  `bankAccountNo` int(11) DEFAULT NULL,
  `bankServiceFee` double DEFAULT NULL,
  `businessBank` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`intUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbladmin`
--

LOCK TABLES `tbladmin` WRITE;
/*!40000 ALTER TABLE `tbladmin` DISABLE KEYS */;
INSERT INTO `tbladmin` VALUES ('1000','Elizabeth Bldg., Katipunan Ave., Quezon City','info.ultrasupergreen@gmail.com',NULL,1,'Ultra Super Green Trading Corporation','(02)713-0405','09470741773',0,1,1,123456789,25,'BDO'),('1011','undefined','undefined','0000-00-00 00:00:00',2,'undefined','undefined','undefined',0,1,1,123456789,25,'BDO');
/*!40000 ALTER TABLE `tbladmin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblbadorderslist`
--

DROP TABLE IF EXISTS `tblbadorderslist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblbadorderslist` (
  `intBadOrdersListNo` varchar(15) NOT NULL,
  `intBadOrdersNo` varchar(15) NOT NULL,
  `strProduct` varchar(45) DEFAULT NULL,
  `strVariant` varchar(45) DEFAULT NULL,
  `strSize` varchar(45) DEFAULT NULL,
  `intQuantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`intBadOrdersListNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbadorderslist`
--

LOCK TABLES `tblbadorderslist` WRITE;
/*!40000 ALTER TABLE `tblbadorderslist` DISABLE KEYS */;
INSERT INTO `tblbadorderslist` VALUES ('1000','1000','Artisanal Dulong','None','12 ml',10),('1001','1001','Keto Loaf','Sweet','100ml',5);
/*!40000 ALTER TABLE `tblbadorderslist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblbatch`
--

DROP TABLE IF EXISTS `tblbatch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblbatch` (
  `intBatchNo` varchar(15) NOT NULL,
  `expirationDate` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `intInventoryNo` varchar(15) DEFAULT NULL,
  `intQuantity` int(11) DEFAULT '0',
  PRIMARY KEY (`intBatchNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbatch`
--

LOCK TABLES `tblbatch` WRITE;
/*!40000 ALTER TABLE `tblbatch` DISABLE KEYS */;
INSERT INTO `tblbatch` VALUES ('1000','2018-10-20','2018-08-31 17:42:19',1,'1000',0),('1001','2018-11-20','2018-08-31 17:43:49',0,'1001',0),('1002','2018-12-12','2018-08-31 17:46:14',1,'1002',0),('1003','2019-11-21','2018-08-31 17:48:17',0,'1003',0),('1004','2020-05-05','2018-08-31 17:50:48',0,'1004',0),('1005','2021-04-04','2018-08-31 17:52:56',0,'1005',0),('1006','2019-04-04','2018-08-31 17:54:36',1,'1006',1),('1007','2020-09-08','2018-08-31 17:55:59',1,'1007',0),('1008','2018-09-05','2018-08-31 17:58:07',0,'1008',0),('1009','2018-09-05','2018-08-31 17:59:57',0,'1009',0),('1010','2018-09-30','2018-09-21 20:01:51',1,'1003',0),('1011','2018-09-20','2018-09-22 03:02:35',0,'1003',0),('1012','2018-10-10','2018-09-22 03:30:08',0,'1000',0),('1013','2018-09-27','2018-09-22 03:30:43',0,'1005',0),('1014','2018-09-25','2018-09-22 03:31:22',0,'1002',0),('1015','2018-09-24','2018-09-22 03:31:51',0,'1008',0),('1016','2018-10-04','2018-10-03 21:01:31',0,'1000',0),('1017','2018-10-05','2018-10-04 17:57:32',0,'1002',0),('1018','2018-10-05','2018-10-05 13:49:50',1,'1000',0),('1019','2017-10-10','2018-10-06 07:34:15',1,'1000',20),('1020','2018-10-06','2018-10-06 07:34:27',1,'1001',43),('1021','2018-10-07','2018-10-06 07:34:45',1,'1002',20),('1022','2018-10-09','2018-10-06 07:34:59',1,'1003',25),('1023','2018-10-07','2018-10-06 07:35:25',1,'1004',27),('1024','2018-10-20','2018-10-06 07:35:42',1,'1005',15),('1025','2018-10-30','2018-10-06 07:35:56',1,'1007',24),('1026','2018-10-30','2018-10-06 07:36:25',1,'1008',20),('1027','2018-10-11','2018-10-06 07:36:35',1,'1009',29),('1028','2019-10-01','2018-10-06 07:53:00',1,'1010',15),('1029','2019-10-20','2018-10-06 07:53:51',1,'1011',15),('1030','2019-10-20','2018-10-09 02:53:08',1,'1012',40);
/*!40000 ALTER TABLE `tblbatch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblbusinesstype`
--

DROP TABLE IF EXISTS `tblbusinesstype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblbusinesstype` (
  `intBusinessTypeNo` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `strBusinessType` varchar(60) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `dateCreated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intBusinessTypeNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblbusinesstype`
--

LOCK TABLES `tblbusinesstype` WRITE;
/*!40000 ALTER TABLE `tblbusinesstype` DISABLE KEYS */;
INSERT INTO `tblbusinesstype` VALUES ('1000','1000','Online Seller',1,'2018-08-31 07:40:16'),('1001','1000','Social Enterprise',1,'2018-08-31 09:30:24'),('1002','1000','Multi Level Marketing',1,'2018-08-31 09:30:50'),('1003','1000','Single Proprietorship',1,'2018-08-31 09:31:09'),('1004','1000','Business Partnership',1,'2018-08-31 09:31:22'),('1005','1000','Business Partnership',2,'2018-09-22 11:38:48');
/*!40000 ALTER TABLE `tblbusinesstype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcategory`
--

DROP TABLE IF EXISTS `tblcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcategory` (
  `intCategoryNo` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `strCategory` varchar(20) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intCategoryNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcategory`
--

LOCK TABLES `tblcategory` WRITE;
/*!40000 ALTER TABLE `tblcategory` DISABLE KEYS */;
INSERT INTO `tblcategory` VALUES ('1000','1000','Food',1),('1001','1000','Herbal Supplements',1),('1002','1000','Beverage',1),('1003','1000','Pet Care',1),('1004','1000','Hygiene',1);
/*!40000 ALTER TABLE `tblcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblconsignmentpaymentlist`
--

DROP TABLE IF EXISTS `tblconsignmentpaymentlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblconsignmentpaymentlist` (
  `intConsPaymentListNo` varchar(15) NOT NULL,
  `intConsignorPaymentNo` varchar(15) DEFAULT NULL,
  `strDescription` varchar(50) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  PRIMARY KEY (`intConsPaymentListNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblconsignmentpaymentlist`
--

LOCK TABLES `tblconsignmentpaymentlist` WRITE;
/*!40000 ALTER TABLE `tblconsignmentpaymentlist` DISABLE KEYS */;
INSERT INTO `tblconsignmentpaymentlist` VALUES ('1000','1000','ss',2),('1001','1000','ddd',2);
/*!40000 ALTER TABLE `tblconsignmentpaymentlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblconsignorpayment`
--

DROP TABLE IF EXISTS `tblconsignorpayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblconsignorpayment` (
  `intConsignorPaymentNo` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `intConsignorID` varchar(15) NOT NULL,
  `paymentDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `intStatus` int(11) DEFAULT NULL,
  PRIMARY KEY (`intConsignorPaymentNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblconsignorpayment`
--

LOCK TABLES `tblconsignorpayment` WRITE;
/*!40000 ALTER TABLE `tblconsignorpayment` DISABLE KEYS */;
INSERT INTO `tblconsignorpayment` VALUES ('1000','1000','1008','2018-09-08 06:44:53',0);
/*!40000 ALTER TABLE `tblconsignorpayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblconsignorrequest`
--

DROP TABLE IF EXISTS `tblconsignorrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblconsignorrequest` (
  `intRequestNo` varchar(15) NOT NULL,
  `intConsignorNo` varchar(15) DEFAULT NULL,
  `dateRequested` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `dateAcknowledged` timestamp NULL DEFAULT NULL,
  `intRequestType` int(11) DEFAULT NULL,
  `intStatus` int(11) DEFAULT '0',
  PRIMARY KEY (`intRequestNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblconsignorrequest`
--

LOCK TABLES `tblconsignorrequest` WRITE;
/*!40000 ALTER TABLE `tblconsignorrequest` DISABLE KEYS */;
INSERT INTO `tblconsignorrequest` VALUES ('1000','1008','2018-09-25 10:18:22','2018-09-28 08:38:13',1,1),('1001','1008','2018-09-28 07:48:14',NULL,1,1);
/*!40000 ALTER TABLE `tblconsignorrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcontract`
--

DROP TABLE IF EXISTS `tblcontract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcontract` (
  `intContractNo` varchar(15) NOT NULL,
  `intConsignorID` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `startingDate` date DEFAULT NULL,
  `endingDate` date DEFAULT NULL,
  `deliverySchedule` varchar(100) DEFAULT NULL,
  `strFrequencyOfDelivery` varchar(100) DEFAULT NULL,
  `remittanceSchedule` varchar(50) DEFAULT NULL,
  `intCompanyProfile` int(11) NOT NULL DEFAULT '0',
  `intProductInfoSheet` int(11) NOT NULL DEFAULT '0',
  `intDTIStat` int(11) NOT NULL DEFAULT '0',
  `intBIRstat` int(11) NOT NULL DEFAULT '0',
  `intDeliveryReceipt` int(11) NOT NULL DEFAULT '0',
  `intFDAstat` int(11) NOT NULL DEFAULT '0',
  `intContractStatus` int(11) NOT NULL DEFAULT '0',
  `applicationDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `timeDayToReach` varchar(100) DEFAULT NULL,
  `consignmentPrice` float DEFAULT NULL,
  `strProductCertifications` varchar(250) DEFAULT NULL,
  `strCategories` varchar(500) DEFAULT NULL,
  `strFDAID` varchar(45) DEFAULT NULL,
  `replacementAgreement` int(11) DEFAULT '0',
  `marketingAgreement` int(11) DEFAULT '0',
  `intEcoCertification` int(11) DEFAULT '0',
  PRIMARY KEY (`intContractNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcontract`
--

LOCK TABLES `tblcontract` WRITE;
/*!40000 ALTER TABLE `tblcontract` DISABLE KEYS */;
INSERT INTO `tblcontract` VALUES ('1000','1008','',NULL,NULL,'1st week of september','Every week','0000-00-00 00:00:00',1,1,1,1,1,1,1,'2018-08-31 17:40:10','Tuesday, 12:00pm',40,'Certified Organic, Gluten-free','Food - Dairy, Food - Non Dairy, Food - Seasoning','232321321',1,1,1),('1001','1009','',NULL,NULL,'Every end of the month','Every week','0000-00-00 00:00:00',1,1,1,1,1,1,1,'2018-09-01 06:25:40','Every tuesday',40,'Certified Organic','Food - Dairy, Food - Non Dairy, Food - Seasoning','3455675',1,1,1),('1002','1012','1000',NULL,NULL,'12','12','0000-00-00 00:00:00',1,1,1,1,1,1,1,'2018-09-22 03:49:40','everyday',40,'Certified Organic, Gluten-free','Food - Dairy, Food - Non Dairy','12',1,1,1),('1003','1013','1000',NULL,NULL,'Sundayy','Every month','0000-00-00 00:00:00',1,1,1,1,1,1,1,'2018-09-22 12:02:17','Every thursday',40,'Vegetarian','Food - Dairy, Food - Non Dairy','123455',1,1,1),('1004','1016','1000',NULL,NULL,'Every tuesday','Ever yweek',NULL,1,1,1,2,1,1,1,'2018-10-06 08:50:51',NULL,40,'Certified Organic, Gluten-free','Food - Dairy, Food - Non Dairy',NULL,1,1,1);
/*!40000 ALTER TABLE `tblcontract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcontracthistory`
--

DROP TABLE IF EXISTS `tblcontracthistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcontracthistory` (
  `intContractHistoryNo` varchar(15) NOT NULL,
  `intContractNo` varchar(15) DEFAULT NULL,
  `intContractStatus` int(11) DEFAULT NULL,
  `historyDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `strChanges` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`intContractHistoryNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcontracthistory`
--

LOCK TABLES `tblcontracthistory` WRITE;
/*!40000 ALTER TABLE `tblcontracthistory` DISABLE KEYS */;
INSERT INTO `tblcontracthistory` VALUES ('1000','1000',4,'2018-09-05 03:11:47',NULL),('1001','1002',4,'2018-09-22 03:52:55',NULL),('1002','1002',1,'2018-09-22 03:53:14',NULL),('1003','1003',1,'2018-10-05 09:16:04','fdfd'),('1004','1003',1,'2018-10-05 09:16:50','dsds'),('1005','1003',1,'2018-10-05 09:23:25','delivery receipt'),('1006','1003',1,'2018-10-05 09:23:42','deil'),('1007','1003',1,'2018-10-05 09:24:23','dsds'),('1008','1003',4,'2018-10-05 09:41:35',NULL),('1009','1003',1,'2018-10-05 09:41:38','Renewed Contract 10/05/2018'),('1010','1003',4,'2018-10-05 09:42:35','Terminated Contract 10/05/2018'),('1011','1003',1,'2018-10-05 09:42:38','Renewed Contract 10/05/2018'),('1012','1000',4,'2018-10-05 13:24:15','Terminated Contract 10/05/2018'),('1013','1000',4,'2018-10-05 13:24:52','Terminated Contract 10/05/2018'),('1014','1000',1,'2018-10-05 13:49:29','Renewed Contract 10/05/2018'),('1015','1000',4,'2018-10-05 14:18:49','Terminated Contract 10/05/2018'),('1016','1000',1,'2018-10-05 14:18:53','Renewed Contract 10/05/2018'),('1017','1000',4,'2018-10-05 15:06:54','Terminated Contract 10/05/2018'),('1018','1001',4,'2018-10-06 08:01:47','Terminated Contract 10/06/2018'),('1019','1001',1,'2018-10-06 08:01:53','Renewed Contract 10/06/2018'),('1020','1000',1,'2018-10-11 06:56:42','Renewed Contract 10/11/2018');
/*!40000 ALTER TABLE `tblcontracthistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcustomer`
--

DROP TABLE IF EXISTS `tblcustomer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcustomer` (
  `intUserID` varchar(15) NOT NULL,
  `strShippingAddress` varchar(100) DEFAULT NULL,
  `strBillingAddress` varchar(100) DEFAULT NULL,
  `strCusPhoneNo` varchar(9) DEFAULT NULL,
  `strCusMobileNo` varchar(15) DEFAULT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcustomer`
--

LOCK TABLES `tblcustomer` WRITE;
/*!40000 ALTER TABLE `tblcustomer` DISABLE KEYS */;
INSERT INTO `tblcustomer` VALUES ('1002','156 M.H Delpilar St. Pamplona 1, Las Piñas Cityj','156 M.H Delpilar St. Pamplona 1, Las Piñas City','','',1),('1010','Tuazon Village','Tuazon Village',NULL,NULL,2),('1014','156 mh. delpilar st. ','156 mh. delpilar st. ',NULL,NULL,1),('1017','delpilar st','delpilar st',NULL,NULL,1),('1018','156 M.H Delpilar Sat.','156 M.H Delpilar Sat.',NULL,NULL,1),('1019','156 M.H Delpilar St.','156 M.H Delpilar St.',NULL,NULL,1);
/*!40000 ALTER TABLE `tblcustomer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblcustomerpayment`
--

DROP TABLE IF EXISTS `tblcustomerpayment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblcustomerpayment` (
  `intPaymentNo` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `amountPaid` double NOT NULL,
  `intStatus` int(11) NOT NULL,
  `intModeOfPayment` int(11) NOT NULL,
  `paymentDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `depositSlip` varchar(45) DEFAULT NULL,
  `intOrderNo` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`intPaymentNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblcustomerpayment`
--

LOCK TABLES `tblcustomerpayment` WRITE;
/*!40000 ALTER TABLE `tblcustomerpayment` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblcustomerpayment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblfaq`
--

DROP TABLE IF EXISTS `tblfaq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblfaq` (
  `intFaqNo` varchar(15) NOT NULL,
  `strQuestion` varchar(200) NOT NULL,
  `strAnswer` varchar(200) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `intUserID` int(11) NOT NULL,
  PRIMARY KEY (`intFaqNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblfaq`
--

LOCK TABLES `tblfaq` WRITE;
/*!40000 ALTER TABLE `tblfaq` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblfaq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblinventorytransactions`
--

DROP TABLE IF EXISTS `tblinventorytransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblinventorytransactions` (
  `intTransactionID` varchar(15) NOT NULL,
  `intInventoryNo` varchar(15) NOT NULL,
  `intShelfNo` int(11) DEFAULT '0',
  `intCriticalLimit` int(11) DEFAULT '0',
  `strTypeOfChanges` varchar(40) NOT NULL,
  `intUserID` varchar(45) NOT NULL,
  `transactionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `productSRP` double DEFAULT NULL,
  `productPrice` double DEFAULT NULL,
  `currQuantity` int(11) DEFAULT '0',
  PRIMARY KEY (`intTransactionID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblinventorytransactions`
--

LOCK TABLES `tblinventorytransactions` WRITE;
/*!40000 ALTER TABLE `tblinventorytransactions` DISABLE KEYS */;
INSERT INTO `tblinventorytransactions` VALUES ('1000','1000',14,10,'Added Batch Products','1000','2018-08-31 17:42:19',150,200,0),('1001','1001',14,10,'Added Batch Products','1000','2018-08-31 17:43:49',100,130,0),('1002','1002',30,10,'Added Batch Products','1000','2018-08-31 17:46:14',80,104,0),('1003','1003',15,7,'Added Batch Products','1000','2018-08-31 17:48:17',130,169,0),('1004','1004',23,10,'Added Batch Products','1000','2018-08-31 17:50:48',120,156,0),('1005','1005',17,10,'Added Batch Products','1000','2018-08-31 17:52:56',120,156,0),('1006','1006',16,10,'Added Batch Products','1000','2018-08-31 17:54:36',200,260,0),('1007','1007',24,10,'Added Batch Products','1000','2018-08-31 17:55:59',200,260,0),('1008','1008',15,5,'Added Batch Products','1000','2018-08-31 17:58:08',80,104,0),('1009','1009',12,5,'Added Batch Products','1000','2018-08-31 17:59:57',80,104,0),('1010','1000',14,10,'Price Changes','1000','2018-09-01 06:34:59',150,250,0),('1011','1002',30,10,'Used Product for Replacement','1000','2018-09-01 06:58:04',80,104,0),('1012','1000',14,10,'Discounted 50% (No: 1000)','1000','2018-09-16 07:00:21',150,250,0),('1013','1001',14,10,'Loss Stock (- 12)','1000','2018-09-18 18:05:11',100,130,0),('1014','1001',14,10,'Gain Stock (+ 12)','1000','2018-09-18 18:05:25',100,130,0),('1015','1003',15,7,'Added Batch Products','1000','2018-09-21 20:01:51',130,169,0),('1016','1003',15,7,'Discounted 10% (No: 1001)','1000','2018-09-22 01:47:46',130,169,0),('1017','1007',24,10,'Discounted 100% (No: 1002)','1000','2018-09-22 01:50:23',200,260,0),('1018','1003',15,7,'Added Batch Products','1000','2018-09-22 03:02:35',130,169,0),('1019','1000',14,10,'Added Batch Products','1000','2018-09-22 03:30:08',150,250,0),('1020','1005',17,10,'Added Batch Products','1000','2018-09-22 03:30:43',120,156,0),('1021','1002',30,10,'Added Batch Products','1000','2018-09-22 03:31:22',80,104,0),('1022','1008',15,5,'Added Batch Products','1000','2018-09-22 03:31:51',80,104,0),('1023','1000',14,10,'Used Product for Replacement','1000','2018-10-01 19:57:58',150,250,0),('1024','1006',16,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-03 20:30:01',200,260,23),('1025','1000',14,10,'(+30) Added to stocks','1000','2018-10-03 21:01:31',150,250,30),('1026','1008',15,5,'(-25) Pulled-out Expired Products','1000','2018-10-04 17:39:11',80,104,-25),('1027','1000',14,10,'(-30) Pulled-out Expired Products','1000','2018-10-04 17:49:38',150,250,-30),('1028','1002',30,10,'(+15) Added to stocks','1000','2018-10-04 17:57:32',80,104,15),('1029','1002',30,10,'(-15) Pulled-out Expired Products','1000','2018-10-04 18:00:16',80,104,-15),('1030','1001',14,10,'(-12) Pulled-out Expired Products','1000','2018-10-04 18:30:28',100,130,-12),('1031','1004',23,10,'(-19) Pulled-out Products','1000','2018-10-04 18:33:14',120,156,-19),('1032','1006',16,10,'(-1) Pulled-out Products','1000','2018-10-04 18:43:16',200,260,20),('1033','1006',16,10,'(+ 2) Adjusted','1000','2018-10-04 18:54:40',200,260,21),('1034','1000',14,10,'(+15) Added to stocks','1000','2018-10-05 13:49:50',150,250,15),('1035','1000',14,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-06 00:41:24',150,250,14),('1036','1006',16,10,'Used Product for Replacement','1000','2018-10-06 01:03:00',200,260,0),('1037','1000',14,10,'Sold Products (-14 deduct from Inventory','1000','2018-10-06 01:52:26',150,250,0),('1038','1006',16,10,'Used Product for Replacement','1000','2018-10-06 01:56:41',200,260,0),('1039','1006',16,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-06 02:20:37',200,260,7),('1040','1006',16,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-06 02:39:45',200,260,6),('1041','1006',16,10,'Used Product for Replacement','1000','2018-10-06 02:40:07',200,260,0),('1042','1006',16,10,'Used Product for Replacement','1000','2018-10-06 02:40:24',200,260,0),('1043','1000',14,10,'(+25) Added to stocks','1000','2018-10-06 07:34:15',150,250,25),('1044','1001',14,10,'(+45) Added to stocks','1000','2018-10-06 07:34:27',100,130,45),('1045','1002',30,10,'(+20) Added to stocks','1000','2018-10-06 07:34:45',80,104,20),('1046','1003',15,7,'(+25) Added to stocks','1000','2018-10-06 07:34:59',130,169,25),('1047','1004',23,10,'(+30) Added to stocks','1000','2018-10-06 07:35:25',120,156,30),('1048','1005',17,10,'(+15) Added to stocks','1000','2018-10-06 07:35:42',120,156,15),('1049','1007',24,10,'(+24) Added to stocks','1000','2018-10-06 07:35:56',200,260,24),('1050','1008',15,5,'(+20) Added to stocks','1000','2018-10-06 07:36:25',80,104,20),('1051','1009',12,5,'(+29) Added to stocks','1000','2018-10-06 07:36:35',80,104,29),('1052','1010',14,10,'(+15) Added to stocks','1000','2018-10-06 07:53:00',100,150,15),('1053','1011',14,10,'(+15) Added to stocks','1000','2018-10-06 07:53:51',200,250,15),('1054','1006',16,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-06 09:08:55',200,260,3),('1055','1004',23,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-06 09:08:55',120,156,29),('1056','1000',14,10,'Used Product for Replacement','1000','2018-10-06 09:14:12',150,250,0),('1057','1006',16,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-07 02:09:25',200,260,2),('1058','1004',23,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-07 02:09:25',120,156,28),('1059','1000',14,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-07 11:30:44',150,250,23),('1060','1004',23,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-07 11:44:35',120,156,27),('1061','1006',16,10,'Used Product for Replacement','1000','2018-10-07 14:44:17',200,260,0),('1062','1012',14,10,'(+40) Added Batch Products','1000','2018-10-09 02:53:08',200,280,40),('1063','1006',16,10,'Update Inventory Details','1000','2018-10-09 02:54:15',200,260,1),('1064','1000',14,10,'Sold Products (-1 deduct from Inventory)','1000','2018-10-09 03:03:45',150,250,22),('1065','1000',14,10,'Sold Products (-2 deduct from Inventory)','1000','2018-10-09 06:31:08',150,250,20),('1066','1001',14,10,'Used Product for Replacement','1000','2018-10-09 06:37:24',100,130,0);
/*!40000 ALTER TABLE `tblinventorytransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblmessages`
--

DROP TABLE IF EXISTS `tblmessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblmessages` (
  `intMessageNo` varchar(15) NOT NULL,
  `intCustomerID` varchar(15) DEFAULT NULL,
  `strMessage` varchar(100) DEFAULT NULL,
  `intAdminID` varchar(15) DEFAULT NULL,
  `seenStatus` int(11) NOT NULL DEFAULT '0',
  `intStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intMessageNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmessages`
--

LOCK TABLES `tblmessages` WRITE;
/*!40000 ALTER TABLE `tblmessages` DISABLE KEYS */;
INSERT INTO `tblmessages` VALUES ('1000','1000','Order #1000 has been placed','1000',1,1),('1001','1003','Order #1001 has been placed','1000',1,1),('1002','1007','Order #1002 has been placed','1000',0,1),('1003','1009','Order #1003 has been placed','1000',1,1),('1004','1012','Order #1004 has been placed','1000',1,1),('1005','1013','Order #1005 has been placed','1000',1,1),('1006','1014','Order #1006 has been placed','1000',1,1),('1007','1015','Order #1007 has been placed','1000',1,1),('1008','1016','sample','1000',0,1),('1009','1017','Order #1008 has been placed','1000',1,1),('1010','1018','sample','1000',0,1),('1011','1019','Order #1009 has been placed','1000',1,1),('1012','1020','sample2\r\n','1000',0,1),('1013','1021','Order #1010 has been placed','1000',1,1),('1014','1023','sorry bhe','1000',0,1),('1015','1024','s','1000',0,1),('1016','1025','Order #1011 has been placed','1000',1,1),('1017','1031','Order #1012 has been placed','1000',1,1),('1018','1035','Order #1013 has been placed','1000',1,1),('1019','1036','Your order has been shipped','1000',1,1),('1020','1038','Order #1014 has been placed','1000',0,1),('1021','1039','Order #1015 has been placed','1000',0,1),('1022','1010','wala lang','1000',1,1),('1023','1010','bye gurl','1000',1,1),('1024','1010','Order #1026 has been placed','1000',1,1),('1025','1010','Order #1026 return form has been submitted','1000',1,1),('1026','1010','Order #1027 has been placed','1000',1,1),('1027','1010','Order #1028 has been placed','1000',1,1),('1028','1010','Order #1028 return form has been submitted','1000',1,1),('1029','1010','Order #1029 has been placed','1000',1,1),('1030','1017','Order #1030 has been placed','1000',1,1),('1031','1017','Order #1031 has been placed','1000',1,1),('1032','1017','Order #1031 return form has been submitted','1000',1,1),('1033','1017','Your order has been shipped (Order #1031)','1000',1,1),('1034','1010','Order #1032 has been placed','1000',0,1),('1035','1010',' (Order #1032)','1000',0,1),('1036','1010',' (Order #1032)','1000',0,1),('1037','1010','Order #1033 has been placed','1000',0,1),('1038','1010',' (Order #1033)','1000',0,1),('1039','1010',' (Order #1033)','1000',0,1),('1040','1010','Order #1033 return form has been submitted','1000',0,1),('1041','1010',' (Order #1033)','1000',0,1),('1042','1010',' (Order #1032)','1000',0,1),('1043','1017',' (Order #1030)','1000',0,1),('1044','1010',' (Order #1028)','1000',0,1),('1045','1010',' (Order #1024)','1000',0,1),('1046','1010',' (Order #1023)','1000',0,1),('1047','1010','Order #1034 has been placed','1000',0,1),('1048','1010','Order #1035 has been placed','1000',0,1),('1049','1010','Your order no 1035 has been shipped (Order #1035)','1000',0,1),('1050','1010','Your order 1035 has been delivered. Thank you! (Order #1035)','1000',0,1),('1051','1018','Order #1036 has been placed','1000',0,1),('1052','1018','Your order no 1036 has been shipped (Order #1036)','1000',0,1),('1053','1018',' (Order #1036)','1000',0,1),('1054','1018','Order #1036 return form has been submitted','1000',0,1),('1055','1019','Order #1037 has been placed','1000',0,1),('1056','1010','Order #1038 has been placed','1000',0,1),('1057','1010','Order #1035 return form has been submitted','1000',0,1);
/*!40000 ALTER TABLE `tblmessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblorder`
--

DROP TABLE IF EXISTS `tblorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblorder` (
  `intOrderNo` varchar(15) NOT NULL,
  `intInvoiceNo` varchar(15) DEFAULT NULL,
  `intUserID` varchar(15) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '0',
  `dateOrdered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `strSpecialNote` varchar(50) DEFAULT NULL,
  `intPaymentMethod` int(11) DEFAULT NULL,
  `strShippingMethod` varchar(45) DEFAULT NULL,
  `strCourier` varchar(45) DEFAULT NULL,
  `intPaymentStatus` int(11) NOT NULL DEFAULT '0',
  `strReferenceNo` varchar(45) NOT NULL,
  `strShippingAddress` varchar(100) DEFAULT NULL,
  `strBillingAddress` varchar(100) DEFAULT NULL,
  `paymentDue` timestamp NULL DEFAULT NULL,
  `strCancellationReason` varchar(100) DEFAULT NULL,
  `dateCancelled` timestamp NULL DEFAULT NULL,
  `shippingFee` double DEFAULT '0',
  `depositSlip` varchar(45) DEFAULT NULL,
  `paymentDate` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`intOrderNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblorder`
--

LOCK TABLES `tblorder` WRITE;
/*!40000 ALTER TABLE `tblorder` DISABLE KEYS */;
INSERT INTO `tblorder` VALUES ('1000',NULL,'1002',3,'2018-09-01 01:47:10',NULL,2,'Courier','',1,'','156 M.H Delpilar St. Pamplona 1, Las Piñas City','156 M.H Delpilar St. Pamplona 1, Las Piñas City','2018-09-01 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1001',NULL,'1002',3,'2018-09-01 01:56:20',NULL,1,'None','',1,'','156 M.H Delpilar St. Pamplona 1, Las Piñas City','156 M.H Delpilar St. Pamplona 1, Las Piñas City','2018-09-01 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1002',NULL,'1002',2,'2018-09-01 05:47:59',NULL,1,'None','',1,'','156 M.H Delpilar St. Pamplona 1, Las Piñas City','156 M.H Delpilar St. Pamplona 1, Las Piñas City','2018-09-01 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1003',NULL,'1010',3,'2018-09-01 06:44:03',NULL,2,'Courier','LBC',0,'','Tuazon Village','Tuazon Village','2018-09-01 16:00:00',NULL,NULL,0,NULL,NULL),('1004',NULL,'1010',6,'2018-09-15 06:04:16',NULL,1,'None','',0,'','Tuazon Village','Tuazon Village','2018-09-15 16:00:00',NULL,NULL,0,NULL,NULL),('1005',NULL,'1010',2,'2018-09-18 11:31:40',NULL,1,'None','',0,'','Tuazon Village','Tuazon Village','2018-09-18 16:00:00',NULL,NULL,0,NULL,NULL),('1006',NULL,'1010',6,'2018-09-20 08:02:30',NULL,2,'None','',1,'','Tuazon Village','Tuazon Village','2018-09-20 16:00:00',NULL,NULL,0,'bs-1006.png','2018-10-09 00:34:08'),('1007',NULL,'1010',6,'2018-09-21 14:39:17',NULL,1,'None','',0,'','Tuazon Village','Tuazon Village','2018-09-21 16:00:00',NULL,NULL,0,NULL,NULL),('1008',NULL,'1010',6,'2018-09-21 14:57:15',NULL,1,'None','',0,'','Tuazon Village','Tuazon Village','2018-09-21 16:00:00',NULL,NULL,0,NULL,NULL),('1009',NULL,'1010',6,'2018-09-21 15:00:01',NULL,1,'None','',0,'','Tuazon Village','Tuazon Village','2018-09-21 16:00:00',NULL,NULL,0,NULL,NULL),('1010',NULL,'1010',2,'2018-09-21 15:48:51',NULL,1,'None','',0,'','Tuazon Village','Tuazon Village','2018-09-21 16:00:00',NULL,NULL,0,NULL,NULL),('1011',NULL,'1010',2,'2018-09-21 20:00:58',NULL,1,'None','',1,'','Tuazon Village','Tuazon Village','2018-09-22 16:00:00',NULL,NULL,0,NULL,NULL),('1012',NULL,'1010',2,'2018-09-22 01:50:55',NULL,1,'Courier','',0,'','Tuazon Village','Tuazon Village','2018-09-22 16:00:00',NULL,NULL,0,NULL,NULL),('1013',NULL,'1014',3,'2018-09-22 12:24:01',NULL,2,'','',1,'','156 mh. delpilar st. ','156 mh. delpilar st. ','2018-09-22 16:00:00',NULL,NULL,0,'bs-1013.png',NULL),('1014',NULL,'1010',2,'2018-09-30 08:02:24',NULL,1,'','',1,'','Tuazon Village','Tuazon Village','2018-09-30 16:00:00',NULL,NULL,0,NULL,NULL),('1015',NULL,'1010',2,'2018-09-30 08:04:15',NULL,1,'','',1,'','Tuazon Village','Tuazon Village','2018-09-30 16:00:00',NULL,NULL,0,NULL,NULL),('1016',NULL,'1010',6,'2018-10-02 10:09:29',NULL,1,'Courier','sample',0,'','Tuazon Village','Tuazon Village','2018-10-02 16:00:00',NULL,NULL,0,NULL,NULL),('1017',NULL,'1010',6,'2018-10-02 15:02:01',NULL,1,'','',0,'','Tuazon Village','Tuazon Village','2018-10-02 16:00:00',NULL,NULL,0,NULL,NULL),('1018',NULL,'1010',6,'2018-10-02 15:54:53',NULL,1,'','',0,'','Tuazon Village','Tuazon Village','2018-10-02 16:00:00',NULL,NULL,0,NULL,NULL),('1019',NULL,'1010',6,'2018-10-02 15:55:39',NULL,1,'','',0,'','Tuazon Village','Tuazon Village','2018-10-02 16:00:00',NULL,NULL,0,NULL,NULL),('1020',NULL,'1010',2,'2018-10-03 20:15:21',NULL,1,'','',0,'','Tuazon Village','Tuazon Village','2018-10-04 16:00:00',NULL,NULL,0,NULL,NULL),('1021',NULL,'1010',2,'2018-10-03 20:17:41',NULL,1,'','',0,'','Tuazon Village','Tuazon Village','2018-10-04 16:00:00',NULL,NULL,0,NULL,NULL),('1022',NULL,'1010',2,'2018-10-03 20:25:16',NULL,1,'','',0,'','Tuazon Village','Tuazon Village','2018-10-04 16:00:00',NULL,NULL,0,NULL,NULL),('1023',NULL,'1010',2,'2018-10-03 20:27:50',NULL,1,'','',1,'','Tuazon Village','Tuazon Village','2018-10-04 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:24:30'),('1024',NULL,'1010',2,'2018-10-03 20:29:45',NULL,1,'','',1,'','Tuazon Village','Tuazon Village','2018-10-04 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:24:16'),('1025',NULL,'1010',6,'2018-10-05 13:52:00',NULL,1,'','',1,'','Tuazon Village','Tuazon Village','2018-10-05 16:00:00',NULL,NULL,0,NULL,'2018-10-06 07:20:58'),('1026',NULL,'1010',5,'2018-10-06 00:40:06',NULL,1,'','',1,'758368156213864','Tuazon Village','Tuazon Village','2018-10-06 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1027',NULL,'1010',3,'2018-10-06 01:51:56',NULL,1,'','',1,'826616643518437','Tuazon Village','Tuazon Village','2018-10-06 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1028',NULL,'1010',5,'2018-10-06 02:19:59',NULL,1,'','',1,'281836915440980','Tuazon Village','Tuazon Village','2018-10-06 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:24:07'),('1029',NULL,'1010',3,'2018-10-06 02:38:03',NULL,1,'','',1,'852560209444178','Tuazon Village','Tuazon Village','2018-10-06 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1030',NULL,'1017',6,'2018-10-06 09:01:44',NULL,1,'','',1,'380700638793714','delpilar st','delpilar st','2018-10-06 16:00:00','Decided for alternative product',NULL,0,NULL,'2018-10-08 16:23:55'),('1031',NULL,'1017',2,'2018-10-06 09:07:27',NULL,1,'','',1,'675334438549878','delpilar st','delpilar st','2018-10-06 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1032',NULL,'1010',6,'2018-10-07 11:29:27',NULL,1,'','',1,'973029877526316','Tuazon Village','Tuazon Village','2018-10-07 16:00:00','Changed Mind',NULL,0,NULL,'2018-10-08 16:22:32'),('1033',NULL,'1010',5,'2018-10-07 11:42:41',NULL,1,'','',1,'642694327591962','Tuazon Village','Tuazon Village','2018-10-07 16:00:00',NULL,NULL,0,NULL,'2018-10-08 16:22:32'),('1034',NULL,'1010',0,'2018-10-09 02:59:11',NULL,2,NULL,NULL,0,'624449178993301','Tuazon Village','Tuazon Village','2018-10-09 16:00:00',NULL,NULL,0,'bs-1034.png',NULL),('1035',NULL,'1010',5,'2018-10-09 03:03:01',NULL,1,'','',1,'237561443053252','Tuazon Village','Tuazon Village','2018-10-09 16:00:00',NULL,NULL,0,NULL,'2018-10-09 03:04:27'),('1036',NULL,'1018',5,'2018-10-09 06:29:47',NULL,2,'','',0,'626754647504301','156 M.H Delpilar Sat.','156 M.H Delpilar Sat.','2018-10-09 16:00:00',NULL,NULL,0,NULL,NULL),('1037',NULL,'1019',6,'2018-10-09 06:42:38',NULL,1,NULL,NULL,0,'899573490051082','156 M.H Delpilar St.','156 M.H Delpilar St.','2018-10-09 16:00:00','Decided for alternative product',NULL,0,NULL,NULL),('1038',NULL,'1010',0,'2018-10-10 04:14:28',NULL,1,NULL,NULL,0,'129267643171256','Tuazon Village','Tuazon Village','2018-10-10 16:00:00',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `tblorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblorderdetails`
--

DROP TABLE IF EXISTS `tblorderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblorderdetails` (
  `intOrderDetailsNo` varchar(15) NOT NULL,
  `intOrderNo` varchar(15) NOT NULL,
  `intInventoryNo` varchar(15) NOT NULL,
  `intProductType` int(11) NOT NULL DEFAULT '1',
  `intStatus` int(11) NOT NULL,
  `purchasePrice` double NOT NULL,
  `intQuantity` int(11) DEFAULT NULL,
  `strCancellationReason` varchar(100) DEFAULT NULL,
  `dateCancelled` varchar(45) DEFAULT NULL,
  `currentSRP` double DEFAULT NULL,
  `discount` double DEFAULT '0',
  PRIMARY KEY (`intOrderDetailsNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblorderdetails`
--

LOCK TABLES `tblorderdetails` WRITE;
/*!40000 ALTER TABLE `tblorderdetails` DISABLE KEYS */;
INSERT INTO `tblorderdetails` VALUES ('1000','1000','1005',1,1,156,1,NULL,NULL,NULL,0),('1001','1001','1003',1,1,169,1,NULL,NULL,NULL,0),('1002','1002','1005',1,1,156,1,NULL,NULL,NULL,0),('1003','1003','1007',1,1,260,4,NULL,NULL,NULL,0),('1004','1004','1000',1,1,250,19,NULL,NULL,NULL,0),('1005','1005','1004',1,1,156,20,NULL,NULL,0,0),('1006','1006','1004',1,1,156,1,NULL,NULL,0,0),('1007','1007','1003',1,1,169,1,NULL,NULL,0,0),('1008','1008','1003',1,1,169,1,NULL,NULL,0,0),('1009','1009','1003',1,1,169,1,NULL,NULL,0,0),('1010','1010','1006',1,1,260,1,NULL,NULL,0,0),('1011','1010','1000',2,1,169,1,NULL,NULL,0,0),('1012','1011','1003',1,1,169,13,NULL,NULL,0,0),('1013','1012','1007',1,1,260,1,NULL,NULL,200,100),('1014','1013','1005',1,1,156,7,NULL,NULL,120,0),('1015','1014','1007',1,1,260,2,NULL,NULL,200,0),('1016','1015','1007',1,1,260,23,NULL,NULL,200,0),('1017','1016','1004',1,1,156,1,NULL,NULL,120,0),('1018','1017','1004',1,1,156,1,NULL,NULL,120,0),('1019','1018','1004',1,1,156,1,NULL,NULL,120,0),('1020','1019','1004',1,1,156,1,NULL,NULL,120,0),('1021','1020','1006',1,1,260,1,NULL,NULL,200,0),('1022','1021','1006',1,1,260,1,NULL,NULL,200,0),('1023','1022','1006',1,1,260,1,NULL,NULL,200,0),('1024','1023','1006',1,1,260,1,NULL,NULL,200,0),('1025','1024','1006',1,1,260,1,NULL,NULL,200,0),('1026','1025','1000',1,1,250,1,NULL,NULL,150,0),('1027','1026','1000',1,1,250,1,NULL,NULL,150,0),('1028','1027','1000',1,1,250,14,NULL,NULL,150,0),('1029','1028','1006',1,1,260,1,NULL,NULL,200,0),('1030','1029','1006',1,1,260,1,NULL,NULL,200,0),('1031','1030','1004',1,1,156,4,NULL,NULL,120,0),('1032','1030','1003',1,1,169,6,NULL,NULL,130,10),('1033','1030','1010',1,1,150,1,NULL,NULL,100,0),('1034','1031','1006',1,1,260,1,NULL,NULL,200,0),('1035','1031','1004',1,1,156,1,NULL,NULL,120,0),('1036','1032','1000',1,1,250,1,NULL,NULL,150,0),('1037','1033','1004',1,1,156,1,NULL,NULL,120,0),('1038','1034','1012',1,1,280,1,NULL,NULL,200,0),('1039','1034','1003',1,1,169,1,NULL,NULL,130,10),('1040','1035','1000',1,1,250,1,NULL,NULL,150,0),('1041','1036','1000',1,1,250,2,NULL,NULL,150,0),('1042','1037','1003',1,1,169,1,NULL,NULL,130,10),('1043','1037','1000',1,1,250,1,NULL,NULL,150,0),('1044','1038','1000',1,1,250,1,NULL,NULL,150,0);
/*!40000 ALTER TABLE `tblorderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblorderhistory`
--

DROP TABLE IF EXISTS `tblorderhistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblorderhistory` (
  `intOrderHistoryNo` varchar(15) NOT NULL,
  `intOrderNo` varchar(45) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '0',
  `intAdminID` varchar(15) NOT NULL,
  `intMessageNo` varchar(15) DEFAULT NULL,
  `historyDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `strShippingMethod` varchar(45) DEFAULT NULL,
  `strCourier` varchar(45) DEFAULT NULL,
  `strShippingAddress` varchar(100) DEFAULT NULL,
  `strBillingAddress` varchar(100) DEFAULT NULL,
  `intPaymentStatus` int(11) DEFAULT '0',
  `shippingFee` double DEFAULT '0',
  PRIMARY KEY (`intOrderHistoryNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblorderhistory`
--

LOCK TABLES `tblorderhistory` WRITE;
/*!40000 ALTER TABLE `tblorderhistory` DISABLE KEYS */;
INSERT INTO `tblorderhistory` VALUES ('1000','1000',0,'1000','0','2018-09-01 01:47:10',NULL,NULL,'156 M.H Delpilar St. Pamplona 1, Las Piñas City','156 M.H Delpilar St. Pamplona 1, Las Piñas City',0,0),('1001','1000',1,'1000','0','2018-09-01 01:48:24','None','',NULL,NULL,0,0),('1002','1000',2,'1000','0','2018-09-01 01:49:01','None','',NULL,NULL,1,0),('1003','1001',0,'1000','0','2018-09-01 01:56:20',NULL,NULL,'156 M.H Delpilar St. Pamplona 1, Las Piñas City','156 M.H Delpilar St. Pamplona 1, Las Piñas City',0,0),('1004','1001',1,'1000','0','2018-09-01 01:56:31','None','',NULL,NULL,1,0),('1005','1001',2,'1000','0','2018-09-01 02:01:56','None','',NULL,NULL,1,0),('1006','1000',3,'1000','0','2018-09-01 04:22:37','Courier','',NULL,NULL,1,0),('1007','1002',0,'1000','0','2018-09-01 05:47:59',NULL,NULL,'156 M.H Delpilar St. Pamplona 1, Las Piñas City','156 M.H Delpilar St. Pamplona 1, Las Piñas City',0,0),('1008','1002',2,'1000','0','2018-09-01 05:48:34','None','',NULL,NULL,1,0),('1009','1003',0,'1000','0','2018-09-01 06:44:03',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1010','1003',2,'1000','0','2018-09-01 06:47:56','Courier','LBC',NULL,NULL,0,0),('1011','1003',3,'1000','0','2018-09-01 06:49:39','Courier','LBC',NULL,NULL,1,0),('1012','1004',0,'1000','0','2018-09-15 06:04:16',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1013','1005',0,'1000','0','2018-09-18 11:31:40',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1014','1006',0,'1000','0','2018-09-20 08:02:30',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1015','1007',0,'1000','0','2018-09-21 14:39:17',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1016','',6,'1000','1008','2018-09-21 14:42:34','None','','Tuazon Village','Tuazon Village',0,0),('1017','1008',0,'1000','0','2018-09-21 14:57:15',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1018','',6,'1000','1010','2018-09-21 14:57:26','None','','Tuazon Village','Tuazon Village',0,0),('1019','1009',0,'1000','0','2018-09-21 15:00:01',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1020','',6,'1000','1012','2018-09-21 15:00:14','None','','Tuazon Village','Tuazon Village',0,0),('1021','1010',0,'1000','0','2018-09-21 15:48:51',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1022','1010',2,'1000','0','2018-09-21 18:44:04','None','',NULL,NULL,0,0),('1023','',6,'1000','1014','2018-09-21 19:39:54','None','','Tuazon Village','Tuazon Village',0,0),('1024','',6,'1000','1015','2018-09-21 19:56:59','None','','Tuazon Village','Tuazon Village',0,0),('1025','1011',0,'1000','0','2018-09-21 20:00:58',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1026','1011',1,'1000','0','2018-09-21 20:02:36','None','',NULL,NULL,0,0),('1027','1011',1,'1000','0','2018-09-21 20:09:15','None','',NULL,NULL,0,0),('1028','1011',1,'1000','0','2018-09-21 20:10:35','None','',NULL,NULL,1,0),('1029','1011',1,'1000','0','2018-09-22 00:39:58','None','',NULL,NULL,1,0),('1030','1011',1,'1000','0','2018-09-22 00:40:04','None','',NULL,NULL,1,0),('1031','1012',0,'1000','0','2018-09-22 01:50:55',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1032','1011',2,'1000','0','2018-09-22 03:02:39','None','',NULL,NULL,1,0),('1033','1005',2,'1000','0','2018-09-22 03:06:25','None','',NULL,NULL,1,0),('1034','1012',2,'1000','0','2018-09-22 03:07:23','Courier','',NULL,NULL,0,0),('1035','1013',0,'1000','0','2018-09-22 12:24:01',NULL,NULL,'156 mh. delpilar st. ','156 mh. delpilar st. ',0,0),('1036','1013',2,'1000','1019','2018-09-22 12:30:48','','',NULL,NULL,1,0),('1037','1013',3,'1000','0','2018-09-22 12:37:06','','',NULL,NULL,1,0),('1038','1014',0,'1000','0','2018-09-30 08:02:24',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1039','1015',0,'1000','0','2018-09-30 08:04:15',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1040','1015',2,'1000','0','2018-09-30 08:05:02','','',NULL,NULL,1,0),('1041','1014',2,'1000','0','2018-09-30 08:05:48','','',NULL,NULL,1,0),('1042','1001',3,'1000',NULL,'2018-10-02 09:43:35','None','',NULL,NULL,1,0),('1043','1001',3,'1000',NULL,'2018-10-02 09:43:42','None','',NULL,NULL,1,0),('1044','1016',0,'1000','0','2018-10-02 10:09:29',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1045','1016',1,'1000',NULL,'2018-10-02 10:10:46','Courier','sample',NULL,NULL,0,0),('1046','1016',1,'1000',NULL,'2018-10-02 10:12:09','Courier','sample',NULL,NULL,0,0),('1047','1016',1,'1000',NULL,'2018-10-02 10:12:15','Courier','sample',NULL,NULL,1,0),('1048','1016',1,'1000',NULL,'2018-10-02 10:12:19','Courier','sample',NULL,NULL,0,0),('1049','1016',1,'1000',NULL,'2018-10-02 11:00:02','Courier','sample',NULL,NULL,0,0),('1050','1016',1,'1000',NULL,'2018-10-02 11:11:50','Courier','sample',NULL,NULL,0,0),('1051','1016',2,'1000',NULL,'2018-10-02 11:19:04','Courier','sample',NULL,NULL,0,0),('1052','1016',2,'1000',NULL,'2018-10-02 11:19:07','Courier','sample',NULL,NULL,0,0),('1053','1016',2,'1000',NULL,'2018-10-02 11:19:11','Courier','sample',NULL,NULL,0,0),('1054','1016',2,'1000',NULL,'2018-10-02 11:19:13','Courier','sample',NULL,NULL,0,0),('1055','1016',2,'1000',NULL,'2018-10-02 11:19:15','Courier','sample',NULL,NULL,0,0),('1056','1016',2,'1000',NULL,'2018-10-02 11:19:17','Courier','sample',NULL,NULL,0,0),('1057','1016',2,'1000',NULL,'2018-10-02 11:19:33','Courier','sample',NULL,NULL,0,0),('1058','1016',2,'1000',NULL,'2018-10-02 13:10:58','Courier','sample',NULL,NULL,0,0),('1059','1016',6,'1000',NULL,'2018-10-02 15:00:29','Courier','sample',NULL,NULL,0,0),('1060','1017',0,'1000','0','2018-10-02 15:02:01',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1061','1017',6,'1000',NULL,'2018-10-02 15:02:26','','',NULL,NULL,0,0),('1062','1017',6,'1000',NULL,'2018-10-02 15:48:06','','',NULL,NULL,0,0),('1063','1017',6,'1000',NULL,'2018-10-02 15:53:43','','',NULL,NULL,0,0),('1064','1018',0,'1000','0','2018-10-02 15:54:53',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1065','1018',6,'1000',NULL,'2018-10-02 15:55:12','','',NULL,NULL,0,0),('1066','1019',0,'1000','0','2018-10-02 15:55:39',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1067','1019',2,'1000',NULL,'2018-10-02 15:55:56','','',NULL,NULL,0,0),('1068','1019',2,'1000',NULL,'2018-10-02 15:56:01','','',NULL,NULL,0,0),('1069','1019',2,'1000',NULL,'2018-10-02 15:56:15','','',NULL,NULL,0,0),('1070','',6,'1000',NULL,'2018-10-02 16:41:13','','','Tuazon Village','Tuazon Village',0,0),('1071','1020',0,'1000','0','2018-10-03 20:15:22',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1072','1020',2,'1000',NULL,'2018-10-03 20:16:10','','',NULL,NULL,0,0),('1073','1021',0,'1000','0','2018-10-03 20:17:41',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1074','1021',2,'1000',NULL,'2018-10-03 20:20:40','','',NULL,NULL,0,0),('1075','1022',0,'1000','0','2018-10-03 20:25:16',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1076','1022',2,'1000',NULL,'2018-10-03 20:25:29','','',NULL,NULL,0,0),('1077','1023',0,'1000','0','2018-10-03 20:27:50',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1078','1023',2,'1000',NULL,'2018-10-03 20:28:01','','',NULL,NULL,0,0),('1079','1024',0,'1000','0','2018-10-03 20:29:45',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1080','1024',2,'1000',NULL,'2018-10-03 20:30:00','','',NULL,NULL,0,0),('1081','1025',0,'1000','0','2018-10-05 13:52:00',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1082','1025',6,'1000',NULL,'2018-10-05 14:18:41','','',NULL,NULL,0,0),('1083','1026',0,'1000','0','2018-10-06 00:40:06',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1084','1026',2,'1000',NULL,'2018-10-06 00:41:24','','',NULL,NULL,0,0),('1085','1026',3,'1000',NULL,'2018-10-06 00:41:31','','',NULL,NULL,1,0),('1086','1026',0,'1000','0','2018-10-06 00:43:37',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1087','1027',0,'1000','0','2018-10-06 01:51:56',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1088','1027',2,'1000',NULL,'2018-10-06 01:52:26','','',NULL,NULL,0,0),('1089','1027',3,'1000',NULL,'2018-10-06 01:52:31','','',NULL,NULL,1,0),('1090','1028',0,'1000','0','2018-10-06 02:19:59',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1091','1028',2,'1000',NULL,'2018-10-06 02:20:36','','',NULL,NULL,0,0),('1092','1028',3,'1000',NULL,'2018-10-06 02:20:41','','',NULL,NULL,0,0),('1093','1028',0,'1000','0','2018-10-06 02:21:05',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1094','1029',0,'1000','0','2018-10-06 02:38:03',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1095','1029',2,'1000',NULL,'2018-10-06 02:39:45','','',NULL,NULL,0,0),('1096','1029',3,'1000',NULL,'2018-10-06 02:39:51','','',NULL,NULL,1,0),('1097','1030',0,'1000','0','2018-10-06 09:01:44',NULL,NULL,'delpilar st','delpilar st',0,0),('1098','1030',6,'1000','0','2018-10-06 09:05:57',NULL,NULL,'delpilar st','delpilar st',0,0),('1099','1031',0,'1000','0','2018-10-06 09:07:27',NULL,NULL,'delpilar st','delpilar st',0,0),('1100','1031',2,'1000',NULL,'2018-10-06 09:08:55','','',NULL,NULL,0,0),('1101','1031',3,'1000',NULL,'2018-10-06 09:09:04','','',NULL,NULL,1,0),('1102','1031',0,'1000','0','2018-10-06 09:12:40',NULL,NULL,'delpilar st','delpilar st',0,0),('1103','1031',2,'1000',NULL,'2018-10-07 02:09:25','','',NULL,NULL,1,0),('1104','1032',0,'1000','0','2018-10-07 11:29:27',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1105','1032',2,'1000',NULL,'2018-10-07 11:30:44','','',NULL,NULL,0,0),('1106','1032',3,'1000',NULL,'2018-10-07 11:30:52','','',NULL,NULL,0,0),('1107','1032',6,'1000','0','2018-10-07 11:39:35',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1108','1033',0,'1000','0','2018-10-07 11:42:41',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1109','1033',2,'1000',NULL,'2018-10-07 11:44:35','','',NULL,NULL,0,0),('1110','1033',3,'1000',NULL,'2018-10-07 11:44:42','','',NULL,NULL,0,0),('1111','1033',0,'1000','0','2018-10-07 11:45:12',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1112','1033',5,'1000',NULL,'2018-10-08 16:20:09','','',NULL,NULL,1,0),('1113','1032',6,'1000',NULL,'2018-10-08 16:22:31','','',NULL,NULL,1,0),('1114','1030',6,'1000',NULL,'2018-10-08 16:23:55','','',NULL,NULL,1,0),('1115','1028',5,'1000',NULL,'2018-10-08 16:24:07','','',NULL,NULL,1,0),('1116','1024',2,'1000',NULL,'2018-10-08 16:24:16','','',NULL,NULL,1,0),('1117','1023',2,'1000',NULL,'2018-10-08 16:24:30','','',NULL,NULL,1,0),('1118','1034',0,'1000','0','2018-10-09 02:59:11',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1119','1035',0,'1000','0','2018-10-09 03:03:01',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1120','1035',2,'1000',NULL,'2018-10-09 03:03:45','','',NULL,NULL,0,0),('1121','1035',3,'1000',NULL,'2018-10-09 03:04:27','','',NULL,NULL,1,0),('1122','1036',0,'1000','0','2018-10-09 06:29:47',NULL,NULL,'156 M.H Delpilar Sat.','156 M.H Delpilar Sat.',0,0),('1123','1036',2,'1000',NULL,'2018-10-09 06:31:08','','',NULL,NULL,0,0),('1124','1036',3,'1000',NULL,'2018-10-09 06:32:03','','',NULL,NULL,0,0),('1125','1036',0,'1000','0','2018-10-09 06:36:18',NULL,NULL,'156 M.H Delpilar Sat.','156 M.H Delpilar Sat.',0,0),('1126','1037',0,'1000','0','2018-10-09 06:42:38',NULL,NULL,'156 M.H Delpilar St.','156 M.H Delpilar St.',0,0),('1127','1037',6,'1000','0','2018-10-09 06:43:12',NULL,NULL,'156 M.H Delpilar St.','156 M.H Delpilar St.',0,0),('1128','1038',0,'1000','0','2018-10-10 04:14:28',NULL,NULL,'Tuazon Village','Tuazon Village',0,0),('1129','1035',0,'1000','0','2018-10-10 06:22:40',NULL,NULL,'Tuazon Village','Tuazon Village',0,0);
/*!40000 ALTER TABLE `tblorderhistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblpackage`
--

DROP TABLE IF EXISTS `tblpackage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblpackage` (
  `intPackageNo` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `strPackageName` varchar(50) NOT NULL,
  `strPackageDescription` varchar(50) DEFAULT NULL,
  `packagePrice` double NOT NULL,
  `dateCreated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `dateDue` date NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `intQuantity` int(11) DEFAULT NULL,
  `strFile` varchar(50) DEFAULT NULL,
  `intReservedItems` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intPackageNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblpackage`
--

LOCK TABLES `tblpackage` WRITE;
/*!40000 ALTER TABLE `tblpackage` DISABLE KEYS */;
INSERT INTO `tblpackage` VALUES ('1000','1000','Buy one take one','Buy one take one package',125,'2018-09-01 01:13:57','2018-10-10',1,0,NULL,0),('1001','1000','Summer Package','Best seller products for summer season',150,'2018-09-22 11:16:29','2018-10-30',1,2,NULL,0),('1002','1000','Sample pacakge','desc',120,'2018-09-22 11:35:59','2018-09-21',1,1,NULL,0);
/*!40000 ALTER TABLE `tblpackage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblpackagelist`
--

DROP TABLE IF EXISTS `tblpackagelist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblpackagelist` (
  `intPackageListNo` varchar(15) NOT NULL,
  `intInventoryNo` varchar(15) NOT NULL,
  `intPackageNo` varchar(15) NOT NULL,
  `intStatus` int(11) NOT NULL,
  `intProductQuantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`intPackageListNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblpackagelist`
--

LOCK TABLES `tblpackagelist` WRITE;
/*!40000 ALTER TABLE `tblpackagelist` DISABLE KEYS */;
INSERT INTO `tblpackagelist` VALUES ('1000','1009','1000',0,1),('1001','1008','1000',0,1),('1002','1005','1000',0,3),('1003','1002','1000',0,11),('1004','1002','1001',0,1),('1005','1004','1001',0,1);
/*!40000 ALTER TABLE `tblpackagelist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductbrand`
--

DROP TABLE IF EXISTS `tblproductbrand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductbrand` (
  `intBrandNo` varchar(15) NOT NULL,
  `strBrand` varchar(20) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intBrandNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductbrand`
--

LOCK TABLES `tblproductbrand` WRITE;
/*!40000 ALTER TABLE `tblproductbrand` DISABLE KEYS */;
INSERT INTO `tblproductbrand` VALUES ('1000','Usares Foods',1),('1001','Coco Keto',1),('1002','Shahani\'s',1),('1003','Coco Natura',1),('1004','eHarvest',1),('1005','Bliss Bowls',1),('1006','Green Palette',1),('1007','Muscle Aide',1),('1008','Chili King',1),('1009','Dr. Juice',1);
/*!40000 ALTER TABLE `tblproductbrand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductcertification`
--

DROP TABLE IF EXISTS `tblproductcertification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductcertification` (
  `intCertificationNo` varchar(15) NOT NULL,
  `intAdminID` varchar(15) DEFAULT NULL,
  `strCertification` varchar(100) DEFAULT NULL,
  `intStatus` int(11) DEFAULT '1',
  `dateAdded` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intCertificationNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductcertification`
--

LOCK TABLES `tblproductcertification` WRITE;
/*!40000 ALTER TABLE `tblproductcertification` DISABLE KEYS */;
INSERT INTO `tblproductcertification` VALUES ('1000',NULL,'Certified Organic',1,'2018-08-31 09:32:05'),('1001',NULL,'Gluten-free',1,'2018-08-31 09:33:50'),('1002',NULL,'Vegan',1,'2018-08-31 09:33:57'),('1003',NULL,'Vegetarian',1,'2018-08-31 09:34:06'),('1004',NULL,'No Certifications',2,'2018-08-31 09:34:21'),('1005',NULL,'123',2,'2018-08-31 09:34:55'),('1006',NULL,'a    Certified Organic',2,'2018-08-31 09:35:56'),('1007',NULL,'Herbal Products',1,'2018-08-31 09:36:13'),('1008',NULL,'Eco-friendly',1,'2018-08-31 09:36:31'),('1009',NULL,'\'',2,'2018-09-27 10:00:38'),('1010',NULL,'```',2,'2018-09-27 10:00:50'),('1011',NULL,'\"',2,'2018-09-27 10:01:07'),('1012',NULL,'zsxedcrfvt gybhunjoi kpo[l',1,'2018-09-27 10:01:19');
/*!40000 ALTER TABLE `tblproductcertification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductdiscount`
--

DROP TABLE IF EXISTS `tblproductdiscount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductdiscount` (
  `intDiscountNo` varchar(15) NOT NULL,
  `intInventoryNo` varchar(15) DEFAULT NULL,
  `discount` double DEFAULT NULL,
  `strDescription` varchar(45) DEFAULT NULL,
  `discountDueDate` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `intStatus` int(11) DEFAULT '1',
  PRIMARY KEY (`intDiscountNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductdiscount`
--

LOCK TABLES `tblproductdiscount` WRITE;
/*!40000 ALTER TABLE `tblproductdiscount` DISABLE KEYS */;
INSERT INTO `tblproductdiscount` VALUES ('1000','1000',50,'Half Discount','2018-09-15 16:00:00','2018-09-16 07:00:21',0),('1001','1003',10,'10% discount','2019-09-22 16:00:00','2018-09-22 01:47:46',1),('1002','1007',10,'Free!','2018-09-22 16:00:00','2018-09-22 01:50:23',1);
/*!40000 ALTER TABLE `tblproductdiscount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductinventory`
--

DROP TABLE IF EXISTS `tblproductinventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductinventory` (
  `intInventoryNo` varchar(15) NOT NULL,
  `intProductNo` varchar(15) NOT NULL,
  `intUserID` varchar(15) DEFAULT NULL,
  `productSRP` double NOT NULL,
  `intUOMno` varchar(15) DEFAULT NULL,
  `intSize` int(11) DEFAULT NULL,
  `intStatus` int(11) DEFAULT '1',
  `productPrice` double DEFAULT NULL,
  `dateRecorded` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `intQuantity` int(11) DEFAULT '0',
  `intCriticalLimit` int(11) DEFAULT '0',
  `intShelfNo` int(11) DEFAULT '0',
  `strBarcode` varchar(45) DEFAULT NULL,
  `intReservedItems` int(11) DEFAULT '0',
  `strVariant` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intInventoryNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductinventory`
--

LOCK TABLES `tblproductinventory` WRITE;
/*!40000 ALTER TABLE `tblproductinventory` DISABLE KEYS */;
INSERT INTO `tblproductinventory` VALUES ('1000','1005','1008',150,'1000',720,1,250,'2018-08-31 17:42:05',20,10,14,'4803925320002',0,'with Royal Jelly'),('1001','1005','1006',100,'1000',150,1,130,'2018-08-31 17:43:32',43,10,14,'4800016052040',0,'with Royal Jelly'),('1002','1001','1007',80,'1001',1,1,104,'2018-08-31 17:45:56',20,10,30,'4802222042150',0,'Cheese'),('1003','1004','1008',130,'1000',500,1,169,'2018-08-31 17:47:56',25,7,15,'4984343840744',1,''),('1004','1003','1007',120,'1000',150,1,156,'2018-08-31 17:50:25',27,10,23,'4902430293402',0,'Bottled'),('1005','1000','1006',120,'1000',720,1,156,'2018-08-31 17:52:07',15,10,17,'4806502727546',0,'with Royal Jelly'),('1006','1006','1008',200,'1000',150,1,260,'2018-08-31 17:54:20',1,10,16,'4800888139306',0,'Ordinary'),('1007','1007','1008',200,'1000',200,1,260,'2018-08-31 17:55:39',24,10,24,'4800111000724',0,'Mint'),('1008','1002','1007',80,'1000',1000,1,104,'2018-08-31 17:57:46',20,5,15,'4902430698658',0,'Choco Milk'),('1009','1002','1007',80,'1000',1000,1,104,'2018-08-31 17:59:45',29,5,12,'4800361394161',0,'Carabao Milk'),('1010','1008','1006',100,'1000',12,1,150,'2018-10-06 07:52:37',15,10,14,'4500938388829',0,'strawberry flavor'),('1011','1008','1006',200,'1002',15,1,250,'2018-10-06 07:53:41',15,10,14,'4892389238741',0,'choco flavor'),('1012','1006','1009',200,'1000',150,1,280,'2018-10-09 02:53:08',40,10,14,'4103925320702',1,'Charcoal');
/*!40000 ALTER TABLE `tblproductinventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductlist`
--

DROP TABLE IF EXISTS `tblproductlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductlist` (
  `intProductNo` varchar(11) NOT NULL,
  `intSubCategoryNo` int(11) NOT NULL,
  `strProductName` varchar(50) NOT NULL,
  `strProductPicture` varchar(50) DEFAULT NULL,
  `strDescription` varchar(1000) DEFAULT NULL,
  `intBrandNo` int(11) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `strProductCode` varchar(20) NOT NULL,
  PRIMARY KEY (`intProductNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductlist`
--

LOCK TABLES `tblproductlist` WRITE;
/*!40000 ALTER TABLE `tblproductlist` DISABLE KEYS */;
INSERT INTO `tblproductlist` VALUES ('1000',1001,'Dugos Wild Forest Honey','1000.jpg','Our love for honey was seeded when we stumbled across an indigenous tribe on one of our travels. The more we learnt about honey, honeybees and beekeepers, the more it grew. The benefits of honey are plenty and a chief contributing factor for our love of honey! Wild Honey comes from the nectar of wildflowers and hence the name. The taste and composition are said to change with the seasons. What doesn’t change is the endless list of benefits.',1000,1,'DGSWLDFRSTHNY'),('1001',1001,'Keto Loaf','1001.jpg','When considering a diet or change in lifestyle, it’s important to consider the benefits and pitfalls. If the diet isn’t going to benefit you – what’s the point? But also, if the side effects are unmanageable, you may want to think twice. Keto diets are more popular than ever with a high number of athletes switching to this way of eating/living. The Keto diet/way of living consists of eating foods that are high in fat, moderate in protein and low in carbs. When on a Keto diet, the body adapts from using carbs to using fats to burn energy.',1001,1,'CCKETOROLLS'),('1002',1000,'Gatas Kalabaw','1002.jpg',' Cow’s milk actually robs our bones of calcium. Animal proteins produce acid when they’re broken down, and calcium is an excellent acid neutralizer, so … you can see where this is going. In order to neutralize and flush out the acids, our bodies have to use the calcium that the milk contains—as well as some from our own stores. So every glass of milk we drink leaches calcium from our bones. That’s why medical study after medical study has found that people who consume the most cow’s milk have significantly higher fracture rates than those who drink little to no milk. ',1002,1,'SHNNSGTSKLBW'),('1003',1004,'Organic Coco Seasoning','1003.jpg','There are many health benefits of herbs and spices, not to mention they improve the taste of so many foods! The problem is, most herbs and spices have been sitting on a grocery store shelf for a long time, and thus they don’t have much nutritional value left. I recommend growing them yourself whenever possible, but if you can’t, always purchase high quality organic ones.',1003,1,'CCNTRCCSSNG'),('1004',1003,'MCT Oil','1004.jpg','MCTs are metabolized differently. They are more quickly degraded and absorbed by the body, providing a quick energy source and less likely to be stored as fat. TCMs are therefore extremely beneficial for your health and metabolism. Organic coconut oil has many health benefits, but be sure to consume organic, unrefined virgin coconut oil ',1001,1,'CCKTMCTOIL'),('1005',1001,'Artisanal Dulong','1005.jpg','Silver fish is small in nature and commonly known as mukene in Uganda. These are between 25 and 50 millimetres long. It is got from L.Victoria, Kyoga and Nabugabo. In Kenya, Silver fish is known as Omena while Daaga in Tanzania. Silver fish is eaten wholly including the head, fins and guts.  Silver fish can be kept in a sack to allow fresh air so that it does not become mould. It should not sit directly on the ground to avoid insects from eating them. it can be bought from the market.',1004,1,'ARTSNLDLNG'),('1006',1008,'Clay Facial Mask','1006.jpg','Face masks are usually applied after facial cleaning or exfoliating.  Masks help remove impurities especially for oily skin. There are many types of masks that you can buy from beauty shops but you can also do your own homemade face mask for combination skin types.  Natural ingredients, free from harsh chemicals, are the main benefits that you get from using organic face masks for your oily skin.  No harmful chemicals and preservatives make organic face masks safe to use. They are free form chemicals such as parabens that can cause serious illness and damage to our organs such as the lungs and kidneys.',1006,1,'GRNPLTCLYMSK'),('1007',1003,'Massage Oil','1007.jpg','Oil massage is the way to mature gracefully – rather than age painfully on many levels. For the body, it helps by: Improving the circulation of blood and lymph so tissues. This means the whole body is better nourished and cleansed so it can look and feel more youthful, Relieving pain and swelling in the body by warming the subtle energy channels, which then expand allowing obstructions to clear and toxins cause all types of diseases to move out, Lubricating tissues inside and out, lubricating the joints and organ linings. This keeps movement more free and graceful, the digestive tract more efficient, and all linings well lubricated.',1007,1,'MSCLADMSOIL'),('1008',1001,'Castle Soap','1008.jpg','Although olive oil is the traditional base oil, the soap can be made with coconut, hemp, avocado, almond, walnut, and many other vegetable oils. Modern castile soap is concentrated, completely biodegradable, and cleans gently, yet effectively. 11 everyday uses for castile soap. All purpose cleaning spray. A little castile soap, mixed with warm water, and some drops of your favorite essential oil mixed in a spray bottle makes for a fabulous all-purpose cleaner. Shower scrub. Handwashing dishes. Toothpaste. Body wash and shampoo. Veggie wash. Dog shampoo. ',1001,1,'CSTLSAPMNL');
/*!40000 ALTER TABLE `tblproductlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductownership`
--

DROP TABLE IF EXISTS `tblproductownership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductownership` (
  `intItemOwnNo` varchar(15) NOT NULL,
  `strProduct` varchar(200) NOT NULL,
  `intUserID` varchar(15) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intItemOwnNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductownership`
--

LOCK TABLES `tblproductownership` WRITE;
/*!40000 ALTER TABLE `tblproductownership` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblproductownership` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductrequest`
--

DROP TABLE IF EXISTS `tblproductrequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductrequest` (
  `intProductRequestNo` varchar(15) NOT NULL,
  `strProductCategory` varchar(45) DEFAULT NULL,
  `strDescription` varchar(45) DEFAULT NULL,
  `strProductName` varchar(45) DEFAULT NULL,
  `strCertifications` varchar(45) DEFAULT NULL,
  `intRequestNo` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`intProductRequestNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductrequest`
--

LOCK TABLES `tblproductrequest` WRITE;
/*!40000 ALTER TABLE `tblproductrequest` DISABLE KEYS */;
INSERT INTO `tblproductrequest` VALUES ('1000','Food','Foodie','New Food','Certified Vegan','1000'),('1001','a','a','a','a','1001'),('1002','s','s','s','s','1001');
/*!40000 ALTER TABLE `tblproductrequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblproductreview`
--

DROP TABLE IF EXISTS `tblproductreview`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblproductreview` (
  `intProductReviewNo` varchar(15) NOT NULL,
  `intProductNo` varchar(15) NOT NULL,
  `intUserID` varchar(15) NOT NULL,
  `strReview` varchar(250) DEFAULT NULL,
  `intStars` int(11) NOT NULL,
  `r_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `r_updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`intProductReviewNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblproductreview`
--

LOCK TABLES `tblproductreview` WRITE;
/*!40000 ALTER TABLE `tblproductreview` DISABLE KEYS */;
INSERT INTO `tblproductreview` VALUES ('1000','1007','1010','Good Products',5,'2018-09-01 07:00:35',NULL),('1001','1003','1017','yummy',5,'2018-10-06 09:10:35',NULL),('1002','1005','1010','Good product',5,'2018-10-09 06:44:37',NULL);
/*!40000 ALTER TABLE `tblproductreview` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblpurchaseorder`
--

DROP TABLE IF EXISTS `tblpurchaseorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblpurchaseorder` (
  `intPurchaseOrderNo` varchar(15) NOT NULL,
  `intSupplierID` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `dateOrdered` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `strSpecialNote` varchar(50) DEFAULT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`intPurchaseOrderNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblpurchaseorder`
--

LOCK TABLES `tblpurchaseorder` WRITE;
/*!40000 ALTER TABLE `tblpurchaseorder` DISABLE KEYS */;
INSERT INTO `tblpurchaseorder` VALUES ('1000','1008','1000','2018-09-01 02:29:43','',2),('1001','1007','1000','2018-09-01 06:38:41','',2),('1002','1006','1000','2018-09-20 17:07:39','',1),('1003','1006','1000','2018-09-20 17:08:00','',1),('1004','1006','1000','2018-09-20 17:08:29','',1),('1005','1006','1000','2018-09-20 17:09:14','',1),('1006','1007','1000','2018-09-20 17:10:14','',1),('1007','1006','1000','2018-09-20 17:12:21','',1),('1008','','1000','2018-09-21 01:39:48','',0),('1009','','1000','2018-09-21 01:41:59','',0),('1010','1006','1000','2018-10-06 08:20:49','',1),('1011','1007','1000','2018-10-06 22:47:13','',0),('1012','1006','1000','2018-10-07 00:44:55','',0),('1013','1008','1000','2018-10-11 06:57:14','',0);
/*!40000 ALTER TABLE `tblpurchaseorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblpurchaseorderlist`
--

DROP TABLE IF EXISTS `tblpurchaseorderlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblpurchaseorderlist` (
  `intPOrderListNo` varchar(15) NOT NULL,
  `intPurchaseOrderNo` varchar(15) NOT NULL,
  `strProduct` varchar(45) NOT NULL,
  `intQuantity` int(11) NOT NULL,
  `strVariant` varchar(50) DEFAULT NULL,
  `strSize` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`intPOrderListNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblpurchaseorderlist`
--

LOCK TABLES `tblpurchaseorderlist` WRITE;
/*!40000 ALTER TABLE `tblpurchaseorderlist` DISABLE KEYS */;
INSERT INTO `tblpurchaseorderlist` VALUES ('1000','1000','Artisanal Dulong',10,'None','12 ml'),('1001','1001','Keto Loaf',50,'Sweet','100ml'),('1002','1002','MCT Oil',14,'None','500ml'),('1003','1003','Dugos Wild Forest Honey',17,'with Royal Jelly','200 ml'),('1004','1004','Dugos Wild Forest Honey',20,'with Royal Jelly','200 ml'),('1005','1005','Gatas Kalabaw',25,'Choco Milk ','1000 ml'),('1006','1006','Gatas Kalabaw',18,'Choco Milk ','1000 ml'),('1007','1007','Gatas Kalabaw',21,'Choco Milk ','1000 ml'),('1008','1010','Artisanal Dulong',12,'Chocolate','10ml'),('1009','1011','Keto Loaf',10,'Chocolate','100'),('1010','1012','Organic Coco Seasoning',11,'bottled','100 ml'),('1011','1013','This product',2,'strawberry','2');
/*!40000 ALTER TABLE `tblpurchaseorderlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreceiveorder`
--

DROP TABLE IF EXISTS `tblreceiveorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreceiveorder` (
  `intReceiveOrderNo` varchar(15) NOT NULL,
  `intPurchaseOrderNo` varchar(15) DEFAULT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `dateOrderReceived` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `specialNotes` varchar(50) DEFAULT NULL,
  `intStatus` int(11) DEFAULT '1',
  PRIMARY KEY (`intReceiveOrderNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreceiveorder`
--

LOCK TABLES `tblreceiveorder` WRITE;
/*!40000 ALTER TABLE `tblreceiveorder` DISABLE KEYS */;
INSERT INTO `tblreceiveorder` VALUES ('1000','1003','1000','2018-10-06 22:24:03','',1),('1001','1004','1000','2018-10-06 22:24:53','',1),('1002','1005','1000','2018-10-06 22:28:51','',1),('1003','1006','1000','2018-10-06 22:34:22','',1),('1004','1007','1000','2018-10-06 22:35:25','',1),('1005','1010','1000','2018-10-06 22:42:11','',1);
/*!40000 ALTER TABLE `tblreceiveorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreceiveorderlist`
--

DROP TABLE IF EXISTS `tblreceiveorderlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreceiveorderlist` (
  `intOrderReceivedNo` varchar(15) NOT NULL,
  `intReceiveOrderNo` varchar(15) NOT NULL,
  `strProduct` varchar(45) NOT NULL,
  `strSize` varchar(45) NOT NULL,
  `strConsignmentPrice` int(11) DEFAULT NULL,
  `intQuantity` int(11) NOT NULL,
  `SRP` int(11) NOT NULL,
  `dateExpiration` date NOT NULL,
  `intOrderStatus` varchar(45) NOT NULL,
  `strVariant` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intOrderReceivedNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreceiveorderlist`
--

LOCK TABLES `tblreceiveorderlist` WRITE;
/*!40000 ALTER TABLE `tblreceiveorderlist` DISABLE KEYS */;
INSERT INTO `tblreceiveorderlist` VALUES ('1000','1000','s','2',0,0,100,'2018-10-10','Good','s'),('1001','1001','xs','2',0,0,100,'2019-10-30','Good','ds'),('1002','1002','x','2',0,0,100,'2019-10-10','Good','fd'),('1003','1003','dsd','2',0,0,100,'2019-10-10','Good','ds'),('1004','1004','e','2',0,0,100,'2019-10-12','Good','e'),('1005','1005','Artisanal Dulong','10ml',0,12,100,'2018-11-10','Good','Chocolate');
/*!40000 ALTER TABLE `tblreceiveorderlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreplacement`
--

DROP TABLE IF EXISTS `tblreplacement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreplacement` (
  `intReplacementNo` varchar(15) NOT NULL,
  `intReturnOrderNo` varchar(15) NOT NULL,
  `dateReplaced` date NOT NULL,
  `intStatus` int(11) NOT NULL,
  PRIMARY KEY (`intReplacementNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreplacement`
--

LOCK TABLES `tblreplacement` WRITE;
/*!40000 ALTER TABLE `tblreplacement` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblreplacement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreplacementlist`
--

DROP TABLE IF EXISTS `tblreplacementlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreplacementlist` (
  `intReplacementListNo` varchar(15) NOT NULL,
  `intReplacementNo` varchar(15) NOT NULL,
  `intInventoryNo` varchar(15) NOT NULL,
  `intQuantity` int(11) NOT NULL,
  PRIMARY KEY (`intReplacementListNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreplacementlist`
--

LOCK TABLES `tblreplacementlist` WRITE;
/*!40000 ALTER TABLE `tblreplacementlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblreplacementlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreturnbadorders`
--

DROP TABLE IF EXISTS `tblreturnbadorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreturnbadorders` (
  `intBadOrdersNo` varchar(15) NOT NULL,
  `intReceiveOrderNo` varchar(15) NOT NULL,
  `dateReturned` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `intStatus` int(11) DEFAULT '0',
  `strReason` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`intBadOrdersNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreturnbadorders`
--

LOCK TABLES `tblreturnbadorders` WRITE;
/*!40000 ALTER TABLE `tblreturnbadorders` DISABLE KEYS */;
INSERT INTO `tblreturnbadorders` VALUES ('1000','1000','2018-09-01 02:41:55',0,''),('1001','1001','2018-09-01 06:40:38',0,'');
/*!40000 ALTER TABLE `tblreturnbadorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreturnorder`
--

DROP TABLE IF EXISTS `tblreturnorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreturnorder` (
  `intReturnOrderNo` varchar(15) NOT NULL,
  `intOrderNo` varchar(15) NOT NULL,
  `dateReturned` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `intStatus` int(11) NOT NULL DEFAULT '0',
  `strReturnReason` varchar(45) DEFAULT NULL,
  `trackingNumber` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intReturnOrderNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreturnorder`
--

LOCK TABLES `tblreturnorder` WRITE;
/*!40000 ALTER TABLE `tblreturnorder` DISABLE KEYS */;
INSERT INTO `tblreturnorder` VALUES ('1002','1026','2018-10-06 00:43:37',1,'daming alam eh','869119384963145'),('1003','1027','2018-10-06 01:56:41',1,NULL,NULL),('1004','1028','2018-10-06 02:21:05',1,'dame gamit','509661479998820'),('1005','1029','2018-10-06 02:40:07',1,NULL,NULL),('1006','1031','2018-10-06 09:12:40',1,'','880558633014311'),('1007','1033','2018-10-07 11:45:12',1,'Reason','911701264191958'),('1008','1036','2018-10-09 06:36:18',1,'Defective','864485594445134'),('1009','1035','2018-10-10 06:22:41',0,'','245798086465846');
/*!40000 ALTER TABLE `tblreturnorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreturnorderlist`
--

DROP TABLE IF EXISTS `tblreturnorderlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreturnorderlist` (
  `intReturnOrderListNo` varchar(15) NOT NULL,
  `intReturnOrderNo` varchar(15) NOT NULL,
  `intOrderDetailsNo` varchar(15) NOT NULL,
  `intOrderQuantity` int(11) NOT NULL DEFAULT '0',
  `intInventoryNo` varchar(15) DEFAULT NULL,
  `intReplaceQuantity` int(11) DEFAULT NULL,
  `strReturnReason` varchar(45) DEFAULT NULL,
  `strAdditionalInfo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intReturnOrderListNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreturnorderlist`
--

LOCK TABLES `tblreturnorderlist` WRITE;
/*!40000 ALTER TABLE `tblreturnorderlist` DISABLE KEYS */;
INSERT INTO `tblreturnorderlist` VALUES ('1002','1002','1027',1,'4800888139306',1,'wrong size',NULL),('1003','1003','1028',14,'4800888139306',14,NULL,NULL),('1004','1004','1029',1,'4800888139306',1,'defective',NULL),('1005','1005','1030',1,'4800888139306',1,NULL,NULL),('1006','1006','1034',1,'4803925320002',1,'wrong item',NULL),('1007','1007','1037',1,'4800888139306',1,'defective',NULL),('1008','1008','1041',2,'4800016052040',2,'defective',NULL),('1009','1009','1040',1,NULL,NULL,'defective',NULL);
/*!40000 ALTER TABLE `tblreturnorderlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreturnproductlist`
--

DROP TABLE IF EXISTS `tblreturnproductlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreturnproductlist` (
  `intReturnProductListNo` varchar(15) NOT NULL,
  `intReturnProductsNo` varchar(15) DEFAULT NULL,
  `intInventoryNo` varchar(15) DEFAULT NULL,
  `intQuantity` int(11) DEFAULT NULL,
  `strReturnReason` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intReturnProductListNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreturnproductlist`
--

LOCK TABLES `tblreturnproductlist` WRITE;
/*!40000 ALTER TABLE `tblreturnproductlist` DISABLE KEYS */;
INSERT INTO `tblreturnproductlist` VALUES ('1000','1000','1007',10,'Damaged'),('1001','1000','1000',10,'Damaged'),('1002','1001','1000',10,'ff'),('1003','1002','1000',100,'disposal'),('1004','1003','1000',10,'For Disposal');
/*!40000 ALTER TABLE `tblreturnproductlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblreturnproducts`
--

DROP TABLE IF EXISTS `tblreturnproducts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblreturnproducts` (
  `intReturnProductsNo` varchar(15) NOT NULL,
  `intSupplierID` varchar(15) DEFAULT NULL,
  `intAdminID` varchar(15) DEFAULT NULL,
  `dateReturned` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `strSpecialNotes` varchar(50) DEFAULT NULL,
  `intStatus` int(11) DEFAULT '0',
  `strEmail` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intReturnProductsNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblreturnproducts`
--

LOCK TABLES `tblreturnproducts` WRITE;
/*!40000 ALTER TABLE `tblreturnproducts` DISABLE KEYS */;
INSERT INTO `tblreturnproducts` VALUES ('1000','1008','1000','2018-09-11 16:42:07','',0,'jade@gmail.com'),('1001','1008','1000','2018-09-21 01:23:53','',0,'jade@gmail.com'),('1002','1008','1000','2018-10-06 08:23:59','',0,'jade@gmail.com'),('1003','1008','1000','2018-10-09 06:35:23','',0,'jade@gmail.com');
/*!40000 ALTER TABLE `tblreturnproducts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblsales`
--

DROP TABLE IF EXISTS `tblsales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblsales` (
  `intSalesNo` varchar(15) NOT NULL,
  `intOrderNo` varchar(15) DEFAULT NULL,
  `amount` double NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `transactionDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intSalesNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsales`
--

LOCK TABLES `tblsales` WRITE;
/*!40000 ALTER TABLE `tblsales` DISABLE KEYS */;
INSERT INTO `tblsales` VALUES ('1000','1000',156,1,'2018-09-01 01:49:01'),('1001','1001',169,1,'2018-09-01 01:56:31'),('1002','1001',169,1,'2018-09-01 02:01:56'),('1003','1000',156,1,'2018-09-01 04:22:37'),('1004','1002',156,1,'2018-09-01 05:48:34'),('1005','1003',1040,1,'2018-09-01 06:49:39'),('1006','1000',156,0,'2018-09-01 06:58:04'),('1007','1011',2197,1,'2018-09-21 20:10:36'),('1008','1011',2197,1,'2018-09-22 00:39:58'),('1009','1011',2197,1,'2018-09-22 00:40:04'),('1010','1011',2197,1,'2018-09-22 03:02:39'),('1011','1005',3120,1,'2018-09-22 03:06:25'),('1012','1013',1092,1,'2018-09-22 12:30:48'),('1013','1013',1092,1,'2018-09-22 12:37:06'),('1014','1015',5980,1,'2018-09-30 08:05:02'),('1015','1014',520,1,'2018-09-30 08:05:48'),('1016','1000',156,0,'2018-10-01 19:57:58'),('1017','1001',169,1,'2018-10-02 09:43:35'),('1018','1001',169,1,'2018-10-02 09:43:42'),('1019','1016',156,1,'2018-10-02 10:12:15'),('1020','1026',250,1,'2018-10-06 00:41:31'),('1021','1026',250,0,'2018-10-06 01:03:00'),('1022','1027',3500,1,'2018-10-06 01:52:31'),('1023','1027',3500,0,'2018-10-06 01:56:41'),('1024','1029',260,1,'2018-10-06 02:39:51'),('1025','1029',260,0,'2018-10-06 02:40:07'),('1026','1028',260,0,'2018-10-06 02:40:24'),('1027','1004',100,1,'2018-10-06 04:36:34'),('1028','1006',100,1,'2018-10-06 04:36:47'),('1029','1007',100,1,'2018-10-06 04:36:53'),('1030','1008',100,1,'2018-10-06 04:36:58'),('1031','1025',100,1,'2018-10-06 07:20:58'),('1032','1000',100,1,'2018-10-06 07:29:56'),('1033','1001',100,1,'2018-10-06 07:32:14'),('1034','1031',416,1,'2018-10-06 09:09:04'),('1035','1031',260,0,'2018-10-06 09:14:12'),('1036','1031',416,1,'2018-10-07 02:09:25'),('1037','1033',0,0,'2018-10-07 12:53:08'),('1038','1033',156,0,'2018-10-07 14:44:17'),('1039','1033',156,1,'2018-10-08 16:20:09'),('1040','1032',250,1,'2018-10-08 16:22:32'),('1041','1030',1686.6,1,'2018-10-08 16:23:55'),('1042','1028',260,1,'2018-10-08 16:24:07'),('1043','1024',260,1,'2018-10-08 16:24:16'),('1044','1023',260,1,'2018-10-08 16:24:30'),('1045','1006',100,1,'2018-10-09 00:34:08'),('1046','1035',250,1,'2018-10-09 03:04:27'),('1047','1036',500,0,'2018-10-09 06:37:24');
/*!40000 ALTER TABLE `tblsales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblshippingfee`
--

DROP TABLE IF EXISTS `tblshippingfee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblshippingfee` (
  `intShippingFeeNo` varchar(15) NOT NULL,
  `strLocation` varchar(50) DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `intStatus` int(11) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intShippingFeeNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblshippingfee`
--

LOCK TABLES `tblshippingfee` WRITE;
/*!40000 ALTER TABLE `tblshippingfee` DISABLE KEYS */;
INSERT INTO `tblshippingfee` VALUES ('1000','Manila',12.25,1,'2018-10-14 03:26:56'),('1001','Quezon City',10.25,1,'2018-10-14 05:57:43');
/*!40000 ALTER TABLE `tblshippingfee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblstockpullout`
--

DROP TABLE IF EXISTS `tblstockpullout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblstockpullout` (
  `intPullOutNo` varchar(15) NOT NULL,
  `intInventoryNo` varchar(15) NOT NULL,
  `intAdminID` varchar(15) NOT NULL,
  `pullOutDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `intQuantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`intPullOutNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstockpullout`
--

LOCK TABLES `tblstockpullout` WRITE;
/*!40000 ALTER TABLE `tblstockpullout` DISABLE KEYS */;
INSERT INTO `tblstockpullout` VALUES ('1000','1005','1000','2018-09-14 05:23:41',35),('1001','1008','1000','2018-09-14 09:36:32',9),('1002','1000','1000','2018-09-15 14:01:31',1),('1003','1003','1000','2018-09-21 20:01:16',14),('1004','1003','1000','2018-09-21 20:02:17',13),('1005','1000','1000','2018-10-01 20:53:43',19),('1006','1005','1000','2018-10-01 21:04:01',13),('1007','1003','1000','2018-10-01 21:05:24',8),('1008','1009','1000','2018-10-01 21:13:15',9),('1009','1002','1000','2018-10-01 21:13:20',38),('1010','1008','1000','2018-10-04 17:39:11',25),('1011','1000','1000','2018-10-04 17:49:38',30),('1012','1002','1000','2018-10-04 18:00:16',15),('1013','1001','1000','2018-10-04 18:30:28',12),('1014','1004','1000','2018-10-04 18:33:14',19),('1015','1006','1000','2018-10-04 18:43:16',1);
/*!40000 ALTER TABLE `tblstockpullout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblsubcategory`
--

DROP TABLE IF EXISTS `tblsubcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblsubcategory` (
  `intSubCategoryNo` varchar(15) NOT NULL,
  `intCategoryNo` varchar(15) NOT NULL,
  `strSubCategory` varchar(20) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`intSubCategoryNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsubcategory`
--

LOCK TABLES `tblsubcategory` WRITE;
/*!40000 ALTER TABLE `tblsubcategory` DISABLE KEYS */;
INSERT INTO `tblsubcategory` VALUES ('1000','1000','Dairy',1),('1001','1000','Non Dairy',1),('1002','1001','Capsules',1),('1003','1001','Weight Loss',1),('1004','1000','Seasoning',1),('1005','1002','Dairy',1),('1006','1003','Food and hygiene',1),('1007','1001','Aromatherapy',1),('1008','1004','Facial Care',1);
/*!40000 ALTER TABLE `tblsubcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblsupplier`
--

DROP TABLE IF EXISTS `tblsupplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblsupplier` (
  `intUserID` varchar(15) NOT NULL,
  `intBusinessTypeNo` int(11) DEFAULT NULL,
  `strBusinessName` varchar(50) DEFAULT NULL,
  `strBusinessAddress` varchar(100) DEFAULT NULL,
  `strSupplierPhone` varchar(9) DEFAULT NULL,
  `strSupplierMobile` varchar(15) DEFAULT NULL,
  `strBusinessTIN` varchar(15) DEFAULT NULL,
  `intInvoiceAvailable` int(11) DEFAULT '0',
  `intSupplierType` int(11) DEFAULT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `strBrands` varchar(100) DEFAULT NULL,
  `strBusinessEmail` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`intUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblsupplier`
--

LOCK TABLES `tblsupplier` WRITE;
/*!40000 ALTER TABLE `tblsupplier` DISABLE KEYS */;
INSERT INTO `tblsupplier` VALUES ('1006',1003,'Usares Foods','M.H Delpilar St., Las Pinas','(02)713-0','0927587455','1029093021',1,2,1,'Usares Foods','usares@gmail.com'),('1007',1000,'Shahani\'s','Mabini St., Tuazon Village, Makati City','(02)714-0','09272587455','5435345354',1,2,1,'Shahani\'s','shahani@gmail.com'),('1008',1003,'Chili King','Balagtas St., Tuazon Village, Laguna','7130453','09359135788','343436546',0,1,1,'Chili King','jade@gmail.com'),('1009',1000,'Ralf\'s Bakery','Quezon City','7130245','09359135788','2232434563',0,1,1,'Ralf\'s','ralf@gmail.com'),('1012',1000,'Sean\'s Bakeshop','Katipunan Ave. Quezon City','7130345','09359135788','938293829',1,1,1,'Sean\'s Bakeshop','imjanellealag@gmail.com'),('1013',1000,'Bryan\'s bakery','Katiunan','7130345','09359135788','123456765',0,1,1,'Bryan\'s bakery','janelle@email.com'),('1015',1001,'sample','sample','0122339','0935913578','1234456',1,2,1,'erica\'s bakery','sample@email.com'),('1016',1001,'sample business','address','7130345','09359135788','1234567890',0,1,1,'sample','janelle@email.com');
/*!40000 ALTER TABLE `tblsupplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluom`
--

DROP TABLE IF EXISTS `tbluom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluom` (
  `intUomNo` varchar(15) NOT NULL,
  `intUserID` varchar(15) NOT NULL,
  `strUnitName` varchar(20) NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `strDescription` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intUomNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluom`
--

LOCK TABLES `tbluom` WRITE;
/*!40000 ALTER TABLE `tbluom` DISABLE KEYS */;
INSERT INTO `tbluom` VALUES ('1000','1000','ml',1,'Miligrams'),('1001','1000','roll',1,'Roll'),('1002','1000','lb',1,'Pounds');
/*!40000 ALTER TABLE `tbluom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluser`
--

DROP TABLE IF EXISTS `tbluser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tbluser` (
  `intUserID` varchar(15) NOT NULL,
  `intUserTypeNo` int(11) NOT NULL,
  `strFname` varchar(50) DEFAULT NULL,
  `strMname` varchar(50) DEFAULT NULL,
  `strLname` varchar(50) DEFAULT NULL,
  `strEmail` varchar(100) DEFAULT NULL,
  `strUsername` varchar(50) DEFAULT NULL,
  `strPassword` varchar(72) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `strFile` varchar(50) DEFAULT NULL,
  `intGoogle` varchar(45) DEFAULT NULL,
  `intFacebook` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`intUserID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

LOCK TABLES `tbluser` WRITE;
/*!40000 ALTER TABLE `tbluser` DISABLE KEYS */;
INSERT INTO `tbluser` VALUES ('1000',1,'Gustle','Alag','Agulto','info.ultrasupergreen@gmail.com','admin_usg123','$2b$10$6Fjh1djiWKNbRdV4jNENpOmhsBgyzNt8CnwtqcVbgEk2GHJbXC2m6','2018-08-31 07:18:54',NULL,NULL,NULL),('1001',2,'Janelle','','Alag','imjanellealag@gmail.com',NULL,NULL,'2018-08-31 07:43:20',NULL,NULL,NULL),('1002',3,'Judith','','Alag','judith@gmail.com','judith123','$2b$10$mUDlqM9.ZZegFvJ9mZqLKeyAUfxiy59fGXBp2/VsCsLVfJV.mlA9K','2018-08-31 07:54:30',NULL,NULL,NULL),('1003',2,'Leigh','','Unabia','leigh@gmail.com',NULL,NULL,'2018-08-31 08:31:30',NULL,NULL,NULL),('1004',2,'Piolo','','Sales','pioloosales@gmail.com','PioloSales','$2b$10$Inf9SphrqdjlP2zZcnzoQuFcXy/c.3ecgiIdLOvjQQJBWUsfsTGAm','2018-08-31 10:09:51',NULL,NULL,NULL),('1005',2,'Jon Ervin','','Balmaceda','superscoops@gmail.com',NULL,NULL,'2018-08-31 10:39:50',NULL,NULL,NULL),('1006',2,'Leigh','Alag','Unabia','usares@gmail.com',NULL,NULL,'2018-08-31 17:36:23',NULL,NULL,NULL),('1007',2,'Joerlyn','Alag','Unabia','shahani@gmail.com',NULL,NULL,'2018-08-31 17:37:29',NULL,NULL,NULL),('1008',2,'Jade','Alag','Rogelio','jade@gmail.com','JadeRogelio','$2b$10$wtNOvZrWdArgf/C7oK07lu4UUnvx6HZZt2t4yVSQ..KR15P9o3o3K','2018-08-31 17:40:10',NULL,NULL,NULL),('1009',2,'Ralf','Milan','Sotelo','ralf@gmail.com',NULL,NULL,'2018-09-01 06:25:40',NULL,NULL,NULL),('1010',3,'Jon','Ervin','Balmaceda','jon@email.com','jonervin123','$2b$10$OPyvtwgh9cf4SDtoR5U/K.v11FdOKrQkB7F2IJr7E0p5bBEx9XP6K','2018-09-01 06:43:03',NULL,NULL,NULL),('1011',1,'Janelle','','Alag','janelle@email.com','janellealag','$2b$10$H8XuEsRMBJfkjX6PpEVuT.47g9fJhQpq78dKLwbgkMUWJrSeJPewW','2018-09-14 16:43:22',NULL,NULL,NULL),('1012',2,'Gilbert','','Cortez','imjanellealag@gmail.com',NULL,NULL,'2018-09-22 03:49:40',NULL,NULL,NULL),('1013',2,'Ryan','','Laron','janelle@email.com',NULL,NULL,'2018-09-22 12:02:17',NULL,NULL,NULL),('1014',3,'Ryan',NULL,'Taylor','ryan@gmail.com','ryantaylor123','$2b$10$AzjZCI92fSBqA8LnfPRLoOKjhids6LRmXFtWzMrRsg/xM/RrftIqq','2018-09-22 12:22:00',NULL,NULL,NULL),('1015',2,'Erica','','Rogelio','sample@email.com',NULL,NULL,'2018-10-06 08:00:41',NULL,NULL,NULL),('1016',2,'Janelle','','Alag','janelle@email.com',NULL,NULL,'2018-10-06 08:50:51',NULL,NULL,NULL),('1017',3,'Jillian',NULL,'Rogelio','jillian@email.com','jillian123','$2b$10$zek.hWMStQrw.ZEvRzEdTOtw/5hUhyqHKvsqXk.a0n/mPlkZ9AlmS','2018-10-06 08:56:13',NULL,NULL,NULL),('1018',3,'Janelle',NULL,'Alag','imjanellealag@gmail.com',NULL,NULL,'2018-10-08 13:02:15',NULL,'106967357426123157166',NULL),('1019',3,'Jon',NULL,'Balmaceda','jonervin124@gmail.com','jonervin124','$2b$10$czokknPt4UHsGW7wVQpmRuDpxZ8yXVweCExxhQvdMjCQzXopN.gC.','2018-10-09 06:42:00',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbluser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblvoucher`
--

DROP TABLE IF EXISTS `tblvoucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblvoucher` (
  `intVoucherNo` varchar(15) NOT NULL,
  `strVoucherCode` varchar(15) NOT NULL,
  `strDescription` varchar(50) DEFAULT NULL,
  `validityDate` date NOT NULL,
  `intStatus` int(11) NOT NULL DEFAULT '1',
  `discount` double NOT NULL,
  PRIMARY KEY (`intVoucherNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblvoucher`
--

LOCK TABLES `tblvoucher` WRITE;
/*!40000 ALTER TABLE `tblvoucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblvoucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblvoucherusers`
--

DROP TABLE IF EXISTS `tblvoucherusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tblvoucherusers` (
  `intVoucherUsersNo` varchar(15) NOT NULL,
  `intVoucherNo` varchar(15) NOT NULL,
  `intUserID` varchar(15) NOT NULL,
  `dateUsed` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`intVoucherUsersNo`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblvoucherusers`
--

LOCK TABLES `tblvoucherusers` WRITE;
/*!40000 ALTER TABLE `tblvoucherusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblvoucherusers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-14 13:58:38
