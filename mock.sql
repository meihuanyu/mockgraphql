# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 172.96.221.198 (MySQL 5.7.23)
# Database: mock
# Generation Time: 2018-08-29 13:59:34 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table class
# ------------------------------------------------------------

DROP TABLE IF EXISTS `class`;

CREATE TABLE `class` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `classname` varchar(128) DEFAULT NULL,
  `xs` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;

INSERT INTO `class` (`id`, `createdAt`, `updatedAt`, `classname`, `xs`)
VALUES
	(1,NULL,NULL,'三年二班',NULL),
	(2,NULL,NULL,'初一1班',NULL);

/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table class_student
# ------------------------------------------------------------

DROP TABLE IF EXISTS `class_student`;

CREATE TABLE `class_student` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `classid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `class_student` WRITE;
/*!40000 ALTER TABLE `class_student` DISABLE KEYS */;

INSERT INTO `class_student` (`id`, `classid`, `studentid`)
VALUES
	(1,1,1),
	(2,1,2),
	(3,1,3),
	(4,2,4),
	(5,2,5);

/*!40000 ALTER TABLE `class_student` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table graphql_field
# ------------------------------------------------------------

DROP TABLE IF EXISTS `graphql_field`;

CREATE TABLE `graphql_field` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fieldname` varchar(128) DEFAULT NULL COMMENT '名称',
  `fieldtype` varchar(128) DEFAULT NULL COMMENT '类型',
  `issingleorlist` int(1) DEFAULT NULL COMMENT '单选还是多选',
  `relationtableid` int(11) DEFAULT NULL COMMENT '关联表id',
  `isdeleteindex` int(1) DEFAULT NULL COMMENT '是否为删除索引',
  `isqueryindex` int(1) DEFAULT NULL COMMENT '是否可以被查询索引',
  `isupdateindex` int(1) DEFAULT NULL COMMENT '是否作为修改的索引',
  `isupdate` int(1) DEFAULT NULL COMMENT '是否可以修改',
  `fieldrelationtablename` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `graphql_field` WRITE;
/*!40000 ALTER TABLE `graphql_field` DISABLE KEYS */;

INSERT INTO `graphql_field` (`id`, `fieldname`, `fieldtype`, `issingleorlist`, `relationtableid`, `isdeleteindex`, `isqueryindex`, `isupdateindex`, `isupdate`, `fieldrelationtablename`)
VALUES
	(9,'id','int',NULL,9,1,1,1,0,NULL),
	(10,'id','int',NULL,10,1,1,1,0,NULL),
	(11,'id','int',NULL,11,1,1,1,0,NULL),
	(12,'classname','varchar',NULL,9,0,1,0,1,NULL),
	(13,'name','varchar',NULL,10,0,1,0,1,NULL),
	(14,'age','int',NULL,10,0,1,0,1,NULL),
	(15,'aihao','varchar',NULL,11,0,1,0,1,NULL),
	(22,'id','int',NULL,12,1,1,1,1,NULL),
	(23,'displayname','varchar',NULL,12,0,1,0,1,NULL),
	(24,'name','varchar',NULL,12,0,1,0,1,NULL),
	(25,'parentid','varchar',NULL,12,0,1,0,1,NULL),
	(26,'type','varchar',NULL,12,0,1,0,1,NULL),
	(27,'postion','varchar',NULL,12,0,1,0,1,NULL),
	(28,'icon','varchar',NULL,12,0,1,0,1,NULL),
	(29,'css','varchar',NULL,12,0,1,0,1,NULL),
	(30,'component','varchar',NULL,12,0,1,0,1,NULL),
	(31,'oper','varchar',NULL,12,0,1,0,1,NULL),
	(36,'id','int',NULL,13,1,1,1,1,NULL),
	(37,'accountnumber','varchar',NULL,13,0,1,0,1,NULL),
	(38,'password','varchar',NULL,13,0,1,0,1,NULL),
	(39,'username','varchar',NULL,13,0,1,0,1,NULL),
	(40,'token','varchar',NULL,13,0,1,0,1,NULL),
	(41,'id','int',NULL,14,1,1,1,1,NULL),
	(42,'name','varchar',NULL,14,0,1,0,1,NULL),
	(43,'id','int',NULL,15,1,1,1,1,NULL),
	(45,'itable','varchar',NULL,15,0,1,0,1,NULL),
	(46,'table_update','int',NULL,15,0,1,0,1,NULL),
	(47,'table_add','int',NULL,15,0,1,0,1,NULL),
	(48,'table_query','int',NULL,15,0,1,0,1,NULL),
	(49,'table_delete','int',NULL,15,0,1,0,1,NULL),
	(50,'tableid','int',NULL,15,0,1,0,1,NULL),
	(51,'roleid','int',NULL,15,0,1,0,1,NULL),
	(59,'xs','graphqlObj',1,9,NULL,NULL,NULL,1,'student'),
	(60,'xq','graphqlObj',0,10,NULL,NULL,NULL,1,'info'),
	(61,'id','int',NULL,16,1,1,1,1,NULL),
	(62,'name','varchar',NULL,16,0,1,0,1,NULL),
	(63,'apikey','varchar',NULL,16,0,1,0,1,NULL),
	(64,'userid','int',NULL,16,0,1,0,1,NULL),
	(65,'id','int',NULL,17,1,1,1,1,NULL),
	(66,'id','int',NULL,18,1,1,1,1,NULL);

/*!40000 ALTER TABLE `graphql_field` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table graphql_table
# ------------------------------------------------------------

DROP TABLE IF EXISTS `graphql_table`;

CREATE TABLE `graphql_table` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tablename` varchar(128) DEFAULT NULL COMMENT '表名称',
  `descinfo` varchar(128) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL COMMENT '关联用户id',
  `type` int(11) DEFAULT NULL,
  `projectid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `graphql_table` WRITE;
/*!40000 ALTER TABLE `graphql_table` DISABLE KEYS */;

INSERT INTO `graphql_table` (`id`, `tablename`, `descinfo`, `userid`, `type`, `projectid`)
VALUES
	(9,'class','班级表',NULL,NULL,1),
	(10,'student','学生表',NULL,NULL,1),
	(11,'info','学生详情表',NULL,NULL,1),
	(12,'systemmenu','菜单表',NULL,NULL,NULL),
	(13,'user','用户表',NULL,NULL,NULL),
	(14,'userrole','用户角色表',NULL,NULL,NULL),
	(15,'permissions','权限表',NULL,NULL,NULL),
	(16,'project','项目表',NULL,NULL,NULL),
	(18,'test','测试表',NULL,NULL,1);

/*!40000 ALTER TABLE `graphql_table` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `info`;

CREATE TABLE `info` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `aihao` varchar(128) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `info` WRITE;
/*!40000 ALTER TABLE `info` DISABLE KEYS */;

INSERT INTO `info` (`id`, `createdAt`, `updatedAt`, `aihao`, `pid`)
VALUES
	(1,NULL,NULL,'爬山',1),
	(2,NULL,NULL,'打游戏',2),
	(3,NULL,NULL,'写代码',3),
	(4,NULL,NULL,'篮球',2);

/*!40000 ALTER TABLE `info` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table permissions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `itable` varchar(128) DEFAULT NULL,
  `table_update` int(10) DEFAULT NULL,
  `table_add` int(10) DEFAULT NULL,
  `table_query` int(10) DEFAULT NULL,
  `table_delete` int(10) DEFAULT NULL,
  `tableid` int(11) DEFAULT NULL,
  `roleid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;

INSERT INTO `permissions` (`id`, `createdAt`, `updatedAt`, `itable`, `table_update`, `table_add`, `table_query`, `table_delete`, `tableid`, `roleid`)
VALUES
	(15,NULL,NULL,'class',1,1,1,0,9,1),
	(16,NULL,NULL,'student',1,1,1,0,10,1),
	(17,NULL,NULL,'info',1,1,1,1,11,1),
	(18,NULL,NULL,'systemmenu',1,1,1,0,12,1),
	(19,NULL,NULL,'user',1,1,1,0,13,1),
	(20,NULL,NULL,'userrole',1,1,1,0,14,1),
	(21,NULL,NULL,'permissions',1,1,1,0,15,1);

/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table project
# ------------------------------------------------------------

DROP TABLE IF EXISTS `project`;

CREATE TABLE `project` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `apikey` varchar(128) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `project` WRITE;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;

INSERT INTO `project` (`id`, `createdAt`, `updatedAt`, `name`, `apikey`, `userid`)
VALUES
	(1,NULL,NULL,'测试项目哦','textx',3);

/*!40000 ALTER TABLE `project` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table student
# ------------------------------------------------------------

DROP TABLE IF EXISTS `student`;

CREATE TABLE `student` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `infoid` int(11) DEFAULT NULL,
  `xq` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;

INSERT INTO `student` (`id`, `createdAt`, `updatedAt`, `name`, `age`, `infoid`, `xq`)
VALUES
	(1,NULL,NULL,'fuxuewei',13,1,NULL),
	(2,NULL,NULL,'meiyu',11,1,NULL),
	(3,NULL,NULL,'xiaohe',11,2,NULL),
	(4,NULL,NULL,'cp',11,3,NULL),
	(5,NULL,NULL,'wangpeng',11,4,NULL),
	(6,NULL,NULL,'ggggg',11,1,1);

/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table systemmenu
# ------------------------------------------------------------

DROP TABLE IF EXISTS `systemmenu`;

CREATE TABLE `systemmenu` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `displayname` varchar(128) DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `parentid` varchar(128) DEFAULT NULL,
  `type` varchar(128) DEFAULT NULL,
  `postion` varchar(128) DEFAULT NULL,
  `icon` varchar(128) DEFAULT NULL,
  `css` varchar(128) DEFAULT NULL,
  `component` varchar(128) DEFAULT NULL,
  `children` varchar(128) DEFAULT NULL,
  `oper` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `systemmenu` WRITE;
/*!40000 ALTER TABLE `systemmenu` DISABLE KEYS */;

INSERT INTO `systemmenu` (`id`, `createdAt`, `updatedAt`, `displayname`, `name`, `parentid`, `type`, `postion`, `icon`, `css`, `component`, `children`, `oper`)
VALUES
	(1,NULL,NULL,'系统管理','systemManger','0',NULL,NULL,NULL,NULL,'/system/index',NULL,NULL),
	(3,NULL,NULL,'菜单管理','menuManger','1',NULL,NULL,NULL,NULL,'/system/menu',NULL,NULL),
	(4,NULL,NULL,'用户管理','userManger','1',NULL,NULL,NULL,NULL,'/system/user',NULL,NULL),
	(5,NULL,NULL,'创建','createMenu','3',NULL,NULL,NULL,NULL,NULL,NULL,'g.ds(\"currentRows\"),f.show(\"/dialog/CreateMenu\"),c.ds(\"reload\")'),
	(6,NULL,NULL,'删除','deleteMenu','3',NULL,NULL,NULL,NULL,NULL,NULL,'g.ds(\"currentRows\"),f.show(\"/dialog/Delete\"),c.ds(\"reload\")'),
	(8,NULL,NULL,'222','22','2','undefined','undefined','undefined','undefined','undefined',NULL,'undefined'),
	(9,NULL,NULL,'编辑','menuUpdate','3','undefined','undefined','undefined','undefined','',NULL,'g.ds(\'currentRows\'),f.show(\'/dialog/CreateMenu\',{type:\'edit\'})'),
	(15,NULL,NULL,'创建','create_uesr','4','undefined','undefined','undefined','undefined','undefined',NULL,'f.show(\"/dialog/CreateUser\"),c.ds(\"reload\")'),
	(16,NULL,NULL,'表管理1','table_mannger','0','undefined','undefined','undefined','undefined','/system/table',NULL,'undefined'),
	(17,NULL,NULL,'表管理','table_mannger','1','undefined','undefined','undefined','undefined','/system/tableAdmin',NULL,'undefined'),
	(18,NULL,NULL,'创建表','create_table','17','undefined','undefined','undefined','undefined','undefined',NULL,'f.show(\'/dialog/createTable\')'),
	(19,NULL,NULL,'创建字段','create_field','17','undefined','undefined','undefined','undefined','undefined',NULL,'c.ds(\"currentRows\"),f.show(\"/dialog/createField\")'),
	(20,NULL,NULL,'编辑表字段','update_field','17','undefined','undefined','undefined','undefined','undefined',NULL,'g.ds(\"currentRows\"),f.show(\"/dialog/UpdateField\")'),
	(21,NULL,NULL,'用户角色','user_role','1','undefined','undefined','undefined','undefined','/system/role',NULL,'undefined'),
	(22,NULL,NULL,'注入权限','Injection_permissions','21','undefined','undefined','undefined','undefined','undefined',NULL,'g.ds(\"currentRows\"),f.show(\"/dialog/Injection_permissions\"),c.ds(\"reload\")'),
	(23,NULL,NULL,'修改','user_update','4','undefined','undefined','undefined','undefined','undefined',NULL,'g.ds(\"currentRows\"),f.show(\"/dialog/CreateUser\",{type:\"edit\"}),c.ds(\"reload\")'),
	(24,NULL,NULL,'项目','project','1','undefined','undefined','undefined','undefined','/system/project',NULL,'undefined'),
	(25,NULL,NULL,'创建','project_create','24','undefined','undefined','undefined','undefined','undefined',NULL,'f.show(\'/dialog/createProject\')'),
	(26,NULL,NULL,'xxx','xxx','1','undefined','undefined','undefined','undefined','undefined',NULL,'undefined');

/*!40000 ALTER TABLE `systemmenu` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table test
# ------------------------------------------------------------

DROP TABLE IF EXISTS `test`;

CREATE TABLE `test` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `accountnumber` varchar(128) DEFAULT NULL,
  `password` varchar(128) DEFAULT NULL,
  `username` varchar(128) DEFAULT NULL,
  `token` varchar(128) DEFAULT NULL,
  `roleid` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;

INSERT INTO `user` (`id`, `createdAt`, `updatedAt`, `accountnumber`, `password`, `username`, `token`, `roleid`)
VALUES
	(1,NULL,NULL,'RecoAdmin@RECO','0','xxxx','1b62ba34f7d1747f3c85d4b913c6becf','xxx\r\n'),
	(3,NULL,NULL,'xiaozhi','0','小志','6423b25cf6157924461d38a50e9381d3','1');

/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table userrole
# ------------------------------------------------------------

DROP TABLE IF EXISTS `userrole`;

CREATE TABLE `userrole` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `userrole` WRITE;
/*!40000 ALTER TABLE `userrole` DISABLE KEYS */;

INSERT INTO `userrole` (`id`, `createdAt`, `updatedAt`, `name`)
VALUES
	(1,NULL,NULL,'管理员');

/*!40000 ALTER TABLE `userrole` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
