DROP DATABASE IF EXISTS canvassistant;
DROP USER IF EXISTS 'canvassistantbot';

CREATE DATABASE canvassistant;
CREATE USER 'canvassistantbot'@'%' IDENTIFIED BY 'CHANGE_ME';
GRANT ALL PRIVILEGES ON canvassistant.* TO 'canvassistantbot'@'%';
