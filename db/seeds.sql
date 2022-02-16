INSERT INTO department (names)
VALUES 
('Accountin'),
('Operation');

INSERT INTO roles (title,salary,department_id)
VALUES 
('AccountsR',10000, 1), 
('TeamMember',20000, 2);

 INSERT INTO employee (first_name, last_name, role_id, manager_id)
 VALUES 
 ('marcio', 'ramos', 2, null ),
 ('amdrew', 'yu', 1, null),
 ('jesus', 'gall', 2, null);

