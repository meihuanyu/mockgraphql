/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50721
Source Host           : localhost:3306
Source Database       : mock

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2018-08-03 17:54:49
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `class`
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `classname` varchar(128) DEFAULT NULL,
  `xs` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of class
-- ----------------------------
INSERT INTO `class` VALUES ('1', null, null, '三年二班', null);
INSERT INTO `class` VALUES ('2', null, null, '初一1班', null);

-- ----------------------------
-- Table structure for `class_student`
-- ----------------------------
DROP TABLE IF EXISTS `class_student`;
CREATE TABLE `class_student` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `classid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of class_student
-- ----------------------------
INSERT INTO `class_student` VALUES ('1', '1', '1');
INSERT INTO `class_student` VALUES ('2', '1', '2');
INSERT INTO `class_student` VALUES ('3', '1', '3');
INSERT INTO `class_student` VALUES ('4', '2', '4');
INSERT INTO `class_student` VALUES ('5', '2', '5');

-- ----------------------------
-- Table structure for `graphql_field`
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of graphql_field
-- ----------------------------
INSERT INTO `graphql_field` VALUES ('9', 'id', 'int', null, '9', '1', '1', '1', '0', null);
INSERT INTO `graphql_field` VALUES ('10', 'id', 'int', null, '10', '1', '1', '1', '0', null);
INSERT INTO `graphql_field` VALUES ('11', 'id', 'int', null, '11', '1', '1', '1', '0', null);
INSERT INTO `graphql_field` VALUES ('12', 'classname', 'varchar', null, '9', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('13', 'name', 'varchar', null, '10', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('14', 'age', 'int', null, '10', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('15', 'aihao', 'varchar', null, '11', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('22', 'id', 'int', null, '12', '1', '1', '1', '1', null);
INSERT INTO `graphql_field` VALUES ('23', 'displayname', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('24', 'name', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('25', 'parentid', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('26', 'type', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('27', 'postion', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('28', 'icon', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('29', 'css', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('30', 'component', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('31', 'oper', 'varchar', null, '12', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('36', 'id', 'int', null, '13', '1', '1', '1', '1', null);
INSERT INTO `graphql_field` VALUES ('37', 'accountnumber', 'varchar', null, '13', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('38', 'password', 'varchar', null, '13', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('39', 'username', 'varchar', null, '13', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('40', 'token', 'varchar', null, '13', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('41', 'id', 'int', null, '14', '1', '1', '1', '1', null);
INSERT INTO `graphql_field` VALUES ('42', 'name', 'varchar', null, '14', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('43', 'id', 'int', null, '15', '1', '1', '1', '1', null);
INSERT INTO `graphql_field` VALUES ('45', 'itable', 'varchar', null, '15', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('46', 'table_update', 'int', null, '15', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('47', 'table_add', 'int', null, '15', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('48', 'table_query', 'int', null, '15', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('49', 'table_delete', 'int', null, '15', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('50', 'tableid', 'int', null, '15', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('51', 'roleid', 'int', null, '15', '0', '1', '0', '1', null);
INSERT INTO `graphql_field` VALUES ('59', 'xs', 'graphqlObj', '1', '9', null, null, null, '1', 'student');
INSERT INTO `graphql_field` VALUES ('60', 'xq', 'graphqlObj', '0', '10', null, null, null, '1', 'info');

-- ----------------------------
-- Table structure for `graphql_table`
-- ----------------------------
DROP TABLE IF EXISTS `graphql_table`;
CREATE TABLE `graphql_table` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `tablename` varchar(128) DEFAULT NULL COMMENT '表名称',
  `descinfo` varchar(128) DEFAULT NULL,
  `userid` int(11) DEFAULT NULL COMMENT '关联用户id',
  `type` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of graphql_table
-- ----------------------------
INSERT INTO `graphql_table` VALUES ('9', 'class', '班级表', null, null);
INSERT INTO `graphql_table` VALUES ('10', 'student', '学生表', null, null);
INSERT INTO `graphql_table` VALUES ('11', 'info', '学生详情表', null, null);
INSERT INTO `graphql_table` VALUES ('12', 'systemmenu', '菜单表', null, null);
INSERT INTO `graphql_table` VALUES ('13', 'user', '用户表', null, null);
INSERT INTO `graphql_table` VALUES ('14', 'userrole', '用户角色表', null, null);
INSERT INTO `graphql_table` VALUES ('15', 'permissions', '权限表', null, null);

-- ----------------------------
-- Table structure for `info`
-- ----------------------------
DROP TABLE IF EXISTS `info`;
CREATE TABLE `info` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `aihao` varchar(128) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of info
-- ----------------------------
INSERT INTO `info` VALUES ('1', null, null, '爬山', '1');
INSERT INTO `info` VALUES ('2', null, null, '打游戏', '2');
INSERT INTO `info` VALUES ('3', null, null, '写代码', '3');
INSERT INTO `info` VALUES ('4', null, null, '篮球', '2');

-- ----------------------------
-- Table structure for `permissions`
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permissions
-- ----------------------------
INSERT INTO `permissions` VALUES ('15', null, null, 'class', '1', '1', '1', '0', '9', '1');
INSERT INTO `permissions` VALUES ('16', null, null, 'student', '1', '1', '1', '0', '10', '1');
INSERT INTO `permissions` VALUES ('17', null, null, 'info', '1', '1', '1', '1', '11', '1');
INSERT INTO `permissions` VALUES ('18', null, null, 'systemmenu', '1', '1', '1', '0', '12', '1');
INSERT INTO `permissions` VALUES ('19', null, null, 'user', '1', '1', '1', '0', '13', '1');
INSERT INTO `permissions` VALUES ('20', null, null, 'userrole', '1', '1', '1', '0', '14', '1');
INSERT INTO `permissions` VALUES ('21', null, null, 'permissions', '1', '1', '1', '0', '15', '1');

-- ----------------------------
-- Table structure for `student`
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of student
-- ----------------------------
INSERT INTO `student` VALUES ('1', null, null, 'fuxuewei', '13', '1', null);
INSERT INTO `student` VALUES ('2', null, null, 'meiyu', '11', '1', null);
INSERT INTO `student` VALUES ('3', null, null, 'xiaohe', '11', '2', null);
INSERT INTO `student` VALUES ('4', null, null, 'cp', '11', '3', null);
INSERT INTO `student` VALUES ('5', null, null, 'wangpeng', '11', '4', null);
INSERT INTO `student` VALUES ('6', null, null, 'ggggg', '11', '1', '1');

-- ----------------------------
-- Table structure for `systemmenu`
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of systemmenu
-- ----------------------------
INSERT INTO `systemmenu` VALUES ('1', null, null, '系统管理', 'systemManger', '0', null, null, null, null, '/system/index', null, null);
INSERT INTO `systemmenu` VALUES ('3', null, null, '菜单管理', 'menuManger', '1', null, null, null, null, '/system/menu', null, null);
INSERT INTO `systemmenu` VALUES ('4', null, null, '用户管理', 'userManger', '1', null, null, null, null, '/system/user', null, null);
INSERT INTO `systemmenu` VALUES ('5', null, null, '创建', 'createMenu', '3', null, null, null, null, null, null, 'g.ds(\"currentRows\"),f.show(\"/dialog/CreateMenu\"),c.ds(\"reload\")');
INSERT INTO `systemmenu` VALUES ('6', null, null, '删除', 'deleteMenu', '3', null, null, null, null, null, null, 'g.ds(\"currentRows\"),f.show(\"/dialog/Delete\"),c.ds(\"reload\")');
INSERT INTO `systemmenu` VALUES ('8', null, null, '222', '22', '2', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', null, 'undefined');
INSERT INTO `systemmenu` VALUES ('9', null, null, '编辑', 'menuUpdate', '3', 'undefined', 'undefined', 'undefined', 'undefined', '', null, 'g.ds(\'currentRows\'),f.show(\'/dialog/CreateMenu\',{type:\'edit\'})');
INSERT INTO `systemmenu` VALUES ('15', null, null, '创建', 'create_uesr', '4', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', null, 'f.show(\"/dialog/CreateUser\"),c.ds(\"reload\")');
INSERT INTO `systemmenu` VALUES ('16', null, null, '表管理', 'table_mannger', '0', 'undefined', 'undefined', 'undefined', 'undefined', '/system/table', null, 'undefined');
INSERT INTO `systemmenu` VALUES ('17', null, null, '表管理', 'table_mannger', '1', 'undefined', 'undefined', 'undefined', 'undefined', '/system/tableAdmin', null, 'undefined');
INSERT INTO `systemmenu` VALUES ('18', null, null, '创建表', 'create_table', '17', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', null, 'f.show(\'/dialog/createTable\')');
INSERT INTO `systemmenu` VALUES ('19', null, null, '创建字段', 'create_field', '17', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', null, 'c.ds(\"currentRows\"),f.show(\"/dialog/createField\")');
INSERT INTO `systemmenu` VALUES ('20', null, null, '编辑表字段', 'update_field', '17', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', null, 'g.ds(\"currentRows\"),f.show(\"/dialog/UpdateField\")');
INSERT INTO `systemmenu` VALUES ('21', null, null, '用户角色', 'user_role', '1', 'undefined', 'undefined', 'undefined', 'undefined', '/system/role', null, 'undefined');
INSERT INTO `systemmenu` VALUES ('22', null, null, '注入权限', 'Injection_permissions', '21', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', null, 'g.ds(\"currentRows\"),f.show(\"/dialog/Injection_permissions\"),c.ds(\"reload\")');
INSERT INTO `systemmenu` VALUES ('23', null, null, '修改', 'user_update', '4', 'undefined', 'undefined', 'undefined', 'undefined', 'undefined', null, 'g.ds(\"currentRows\"),f.show(\"/dialog/CreateUser\",{type:\"edit\"}),c.ds(\"reload\")');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', null, null, 'RecoAdmin@RECO', '0', 'xxxx', '1b62ba34f7d1747f3c85d4b913c6becf', '1');
INSERT INTO `user` VALUES ('3', null, null, 'xiaozhi', '0', '小志', 'undefined', '1');

-- ----------------------------
-- Table structure for `userrole`
-- ----------------------------
DROP TABLE IF EXISTS `userrole`;
CREATE TABLE `userrole` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdAt` date DEFAULT NULL,
  `updatedAt` date DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of userrole
-- ----------------------------
INSERT INTO `userrole` VALUES ('1', null, null, '管理员');
