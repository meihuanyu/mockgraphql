import db from '../config/database'

export const initSql = function(){
    //查询tree结构的menu
    db.query(`DROP FUNCTION IF EXISTS queryMenuTree;`).then(function(){
        db.query(`
        CREATE FUNCTION queryMenuTree(areaId INT)
        RETURNS VARCHAR(4000)
        BEGIN
        DECLARE sTemp VARCHAR(4000);
        DECLARE sTempChd VARCHAR(4000);
        
        SET sTemp='$';
        SET sTempChd = CAST(areaId AS CHAR);
        
        WHILE sTempChd IS NOT NULL DO
        SET sTemp= CONCAT(sTemp,',',sTempChd);
        SELECT GROUP_CONCAT(mid) INTO sTempChd FROM d_menugrant WHERE FIND_IN_SET(pid,sTempChd)>0;
        END WHILE;
        RETURN sTemp;
        END;`)
    })
    
}