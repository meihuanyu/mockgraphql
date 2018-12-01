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
        SELECT GROUP_CONCAT(id) INTO sTempChd FROM d_menugrant WHERE FIND_IN_SET(pid,sTempChd)>0;
        END WHILE;
        RETURN sTemp;
        END;`)
    })
    db.query(`DROP FUNCTION IF EXISTS 'nextval';`).then(function(){
        db.query(`DELIMITER //    
        CREATE  FUNCTION 'nextval'(seq_name VARCHAR(50)) RETURNS int(11)    
            DETERMINISTIC     
        BEGIN     
        UPDATE sequence SET current_value = current_value + increment WHERE NAME = seq_name;       
        RETURN currval(seq_name);       
        END//     
        DELIMITER ;
        `)
    })

    db.query(`DROP FUNCTION IF EXISTS 'currval';`).then(function(){
        db.query(`DELIMITER //  
        CREATE  FUNCTION 'currval'(seq_name VARCHAR(50)) RETURNS int(11)  
            READS SQL DATA  
            DETERMINISTIC  
        BEGIN  
        DECLARE VALUE INTEGER;  
        SET VALUE = 0;  
        SELECT current_value INTO VALUE FROM sequence WHERE NAME = seq_name;  
        RETURN VALUE;  
        END//  
        DELIMITER ;
        `)
    })

    
}