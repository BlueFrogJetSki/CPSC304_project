DROP TABLE Users CASCADE CONSTRAINTS;
DROP TABLE Names CASCADE CONSTRAINTS;
DROP TABLE Consultants CASCADE CONSTRAINTS;
DROP TABLE Title CASCADE CONSTRAINTS;
DROP TABLE EmergencyContact CASCADE CONSTRAINTS;
DROP TABLE HealthEntries CASCADE CONSTRAINTS;
DROP TABLE Devices CASCADE CONSTRAINTS;
DROP TABLE WearableDevice CASCADE CONSTRAINTS;
DROP TABLE StationaryDevice CASCADE CONSTRAINTS;
DROP TABLE CanRead CASCADE CONSTRAINTS;
DROP TABLE RegisteredIn CASCADE CONSTRAINTS;
DROP TABLE DiagnosedWith CASCADE CONSTRAINTS;
DROP TABLE DeviceType CASCADE CONSTRAINTS;
DROP TABLE SubUser CASCADE CONSTRAINTS;
DROP TABLE Programs CASCADE CONSTRAINTS;
DROP TABLE Conditions CASCADE CONSTRAINTS;
DROP TABLE Users_Vitals CASCADE CONSTRAINTS;

CREATE TABLE Names (
    firstName VARCHAR2(50) NOT NULL,
    lastName VARCHAR2(50) NOT NULL,
    PRIMARY KEY (firstName, lastName)
);

CREATE TABLE Title (
    education VARCHAR2(50) PRIMARY KEY,
    title VARCHAR2(50)
);

CREATE TABLE Consultants (
    Id NUMBER PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    education VARCHAR2(50),
    email VARCHAR2(50) UNIQUE NOT NULL,
    FOREIGN KEY (education) REFERENCES Title(education) ON DELETE CASCADE
);

CREATE TABLE Users (
    Id NUMBER PRIMARY KEY,
    firstName VARCHAR2(50) NOT NULL,
    lastName VARCHAR2(50) NOT NULL,
    dob DATE,
    consultant_id NUMBER,
    FOREIGN KEY (firstName, lastName) REFERENCES Names(firstName, lastName) ON DELETE CASCADE,
    FOREIGN KEY (consultant_id) REFERENCES Consultants(Id) ON DELETE CASCADE
);

CREATE TABLE EmergencyContact (
    user_id NUMBER,
    phone_number CHAR(10),
    firstName VARCHAR2(50) NOT NULL,
    lastName VARCHAR2(50) NOT NULL,
    PRIMARY KEY (user_id, phone_number),
    FOREIGN KEY (firstName, lastName) REFERENCES Names(firstName, lastName) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE HealthEntries (
    Id NUMBER PRIMARY KEY,
    entryDate DATE NOT NULL,
    prescription VARCHAR2(100),
    treatment VARCHAR2(100),
    notes VARCHAR2(200),
    user_id NUMBER,
    consultant_id NUMBER,
    FOREIGN KEY (user_id) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (consultant_id) REFERENCES Consultants(Id) ON DELETE CASCADE
);

CREATE TABLE DeviceType (
    model VARCHAR2(10) PRIMARY KEY,
    deviceType VARCHAR2(20)
);

CREATE TABLE Devices (
    Id NUMBER PRIMARY KEY,
    model VARCHAR2(10) NOT NULL,
    deviceType VARCHAR2(20) NOT NULL,
    user_id NUMBER,
    FOREIGN KEY (model) REFERENCES DeviceType(model) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE WearableDevice (
    device_id INT PRIMARY KEY,
    FOREIGN KEY (device_id) REFERENCES Devices(Id) ON DELETE CASCADE
);

CREATE TABLE StationaryDevice (
    device_id INT PRIMARY KEY,
    FOREIGN KEY (device_id) REFERENCES Devices(Id) ON DELETE CASCADE
);
CREATE TABLE SubUser (
    Id NUMBER PRIMARY KEY,
    firstName VARCHAR2(50) NOT NULL,
    lastName VARCHAR2(50) NOT NULL,
    phone_number CHAR(10) UNIQUE NOT NULL,
    email VARCHAR2(50) UNIQUE NOT NULL,
    FOREIGN KEY (firstName, lastName) REFERENCES Names(firstName, lastName) ON DELETE CASCADE
);

CREATE TABLE CanRead (
    user_id INT NOT NULL,
    subuser_id INT NOT NULL,
    PRIMARY KEY (user_id, subuser_id),
    FOREIGN KEY (user_id) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (subuser_id) REFERENCES SubUser(Id) ON DELETE CASCADE
);

CREATE TABLE Programs (
    Id NUMBER PRIMARY KEY,
    name VARCHAR2(50) NOT NULL,
    description VARCHAR2(200)
);


CREATE TABLE RegisteredIn (
    program_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (program_id, user_id),
    FOREIGN KEY (program_id) REFERENCES Programs(Id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE Conditions (
    scientific_name VARCHAR2(50) PRIMARY KEY,
    description VARCHAR2(200),
    treatment VARCHAR2(100)
);

CREATE TABLE DiagnosedWith (
    condition_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (condition_id, user_id),
    FOREIGN KEY (condition_id) REFERENCES Conditions(scientific_name) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE Users_Vitals (
    device_id NUMBER,
    user_id NUMBER,
    time_recorded TIMESTAMP,
    pulse_rate NUMBER,
    blood_pressure VARCHAR2(10),
    PRIMARY KEY (device_id, user_id, time_recorded),
    FOREIGN KEY (device_id) REFERENCES Devices(Id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(Id) ON DELETE CASCADE
);

INSERT ALL
    INTO Names (firstName, lastName) VALUES ('John', 'Doe')
    INTO Names (firstName, lastName) VALUES ('Jerry', 'Smith')
    INTO Names (firstName, lastName) VALUES ('LeBron', 'James')
    INTO Names (firstName, lastName) VALUES ('Stephen', 'Curry')
    INTO Names (firstName, lastName) VALUES ('Nikola', 'Jokic')
SELECT * FROM dual;

INSERT ALL
    INTO Title (education, title) VALUES ('PhD', 'Dr')
    INTO Title (education, title) VALUES ('MD', 'Dr')
    INTO Title (education, title) VALUES ('MSc', 'Mr/Mrs/Ms')
    INTO Title (education, title) VALUES ('BSc', 'Mr/Mrs/Ms')
    INTO Title (education, title) VALUES ('MBA', 'Mr/Mrs/Ms')
SELECT * FROM dual;

INSERT ALL
    INTO Consultants (Id, name, education, email) VALUES (1, 'Dr. Martha Stewart', 'PhD', 'martha.stewart@email.com')
    INTO Consultants (Id, name, education, email) VALUES (2, 'Dr. Phil Wright', 'MD', 'phil.wright@email.com')
    INTO Consultants (Id, name, education, email) VALUES (3, 'Dr. Michael Jordan', 'MSc', 'michael.jordan@email.com')
    INTO Consultants (Id, name, education, email) VALUES (4, 'Dr. Ron Artest', 'PhD', 'ron.artest@email.com')
    INTO Consultants (Id, name, education, email) VALUES (5, 'Dr. Emma Black', 'PhD', 'emma.black@email.com')
SELECT * FROM dual;


INSERT ALL
    INTO Users (Id, firstName, lastName, dob, consultant_id) VALUES (1, 'John', 'Doe', TO_DATE('1985-01-15', 'YYYY-MM-DD'), 1)
    INTO Users (Id, firstName, lastName, dob, consultant_id) VALUES (2, 'Jerry', 'Smith', TO_DATE('1990-04-22', 'YYYY-MM-DD'), 2)
    INTO Users (Id, firstName, lastName, dob, consultant_id) VALUES (3, 'LeBron', 'James', TO_DATE('1992-09-10', 'YYYY-MM-DD'), 3)
    INTO Users (Id, firstName, lastName, dob, consultant_id) VALUES (4, 'Stephen', 'Curry', TO_DATE('1987-06-05', 'YYYY-MM-DD'), 4)
    INTO Users (Id, firstName, lastName, dob, consultant_id) VALUES (5, 'Nikola', 'Jokic', TO_DATE('1995-12-01', 'YYYY-MM-DD'), 5)
SELECT * FROM dual;

INSERT ALL
    INTO EmergencyContact (user_id, phone_number, firstName, lastName) 
    VALUES (1, '1234567890', 'John', 'Doe')
    INTO EmergencyContact (user_id, phone_number, firstName, lastName) 
    VALUES (2, '7787787789', 'Jerry', 'Smith')
    INTO EmergencyContact (user_id, phone_number, firstName, lastName) 
    VALUES (3, '6047786034', 'LeBron', 'James')
    INTO EmergencyContact (user_id, phone_number, firstName, lastName) 
    VALUES (4, '4676041234', 'Stephen', 'Curry')
    INTO EmergencyContact (user_id, phone_number, firstName, lastName) 
    VALUES (5, '6056047780', 'Nikola', 'Jokic')
SELECT * FROM dual;


INSERT ALL
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
    VALUES (1, TO_DATE('2005-11-01', 'YYYY-MM-DD'), 'Ibuprofen', 'Sleep', 'Felt a headache after finishing work', 1, 1)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
    VALUES (2, TO_DATE('2012-12-09', 'YYYY-MM-DD'), NULL, 'Rest', 'Felt nauseous while driving home', 2, 2)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
    VALUES (3, TO_DATE('2012-12-09', 'YYYY-MM-DD'), NULL, 'Rest', 'Felt nauseous while studying', 2, 2)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
    VALUES (4, TO_DATE('2012-12-09', 'YYYY-MM-DD'), NULL, 'Rest', 'Felt nauseous while eating', 2, 2)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
    VALUES (5, TO_DATE('2016-05-22', 'YYYY-MM-DD'), 'Ibuprofen', 'No fried food', 'Felt a stomachache after dinner', 3, 3)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
    VALUES (6, TO_DATE('2019-02-11', 'YYYY-MM-DD'), NULL, 'Sleep with a pillow', 'Woke up with a stiff neck', 4, 4)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id) 
    VALUES (7, TO_DATE('2020-12-04', 'YYYY-MM-DD'), 'Ibuprofen', 'Exercise', 'Woke up with severe back pain', 5, 5)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (8, TO_DATE('2020-12-05', 'YYYY-MM-DD'), 'Tylenol', 'Sleep', 'Woke up with severe back pain', 5, 5)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (9, TO_DATE('2020-12-04', 'YYYY-MM-DD'), 'Tylenol', 'Exercise', 'Woke up with moderate chest pain', 4, 4)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (10, TO_DATE('2023-12-08', 'YYYY-MM-DD'), 'Tylenol', 'Rest', 'Woke up with mild ankle pain', 4, 4)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (11, TO_DATE('2021-11-08', 'YYYY-MM-DD'), 'Advil', 'Rest', 'Woke up with mild toe pain', 3, 3)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (12, TO_DATE('2022-10-03', 'YYYY-MM-DD'), 'Advil', 'Rest', 'Woke up with mild foot pain', 3, 3)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (13, TO_DATE('2022-12-01', 'YYYY-MM-DD'), 'Reactine', 'Rest', 'Felt itchy', 4, 4)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (14, TO_DATE('2012-10-01', 'YYYY-MM-DD'), 'Adderall', 'Exercise', 'Felt bored', 4, 4)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (15, TO_DATE('2015-11-10', 'YYYY-MM-DD'), 'Adderall', 'Read books', 'Cant focus', 4, 4)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (16, TO_DATE('2021-12-22', 'YYYY-MM-DD'), 'Adderall', 'Read books', 'Felt tired', 4, 4)
    INTO HealthEntries (Id, entryDate, prescription, treatment, notes, user_id, consultant_id)
    VALUES (17, TO_DATE('2022-08-01', 'YYYY-MM-DD'), 'Adderall', 'Read books', 'Cant get work done', 2, 2)
SELECT * FROM dual;

INSERT ALL
    INTO DeviceType (model, deviceType) 
    VALUES ('AB12345', 'Heart Monitor')
    INTO DeviceType (model, deviceType) 
    VALUES ('BC34567', 'Heart Monitor 2')
    INTO DeviceType (model, deviceType) 
    VALUES ('CD45678', 'PPG')
    INTO DeviceType (model, deviceType) 
    VALUES ('DE56789', 'ECG')
    INTO DeviceType (model, deviceType) 
    VALUES ('EF67890', 'Fitness Tracker')
SELECT * FROM dual;


INSERT ALL
    INTO Devices (Id, model, deviceType, user_id) 
    VALUES (1, 'AB12345', 'Heart Monitor', 1)
    INTO Devices (Id, model, deviceType, user_id) 
    VALUES (2, 'BC34567', 'Heart Monitor 2', 2)
    INTO Devices (Id, model, deviceType, user_id) 
    VALUES (3, 'CD45678', 'PPG', 3)
    INTO Devices (Id, model, deviceType, user_id) 
    VALUES (4, 'DE56789', 'ECG', 4)
    INTO Devices (Id, model, deviceType, user_id) 
    VALUES (5, 'EF67890', 'Fitness Tracker', 5)
SELECT * FROM dual;


INSERT ALL
    INTO WearableDevice (device_id) VALUES (1)
    INTO WearableDevice (device_id) VALUES (2)
    INTO WearableDevice (device_id) VALUES (3)
    INTO WearableDevice (device_id) VALUES (4)
    INTO WearableDevice (device_id) VALUES (5)
SELECT * FROM dual;


INSERT ALL
    INTO StationaryDevice (device_id) VALUES (1)
    INTO StationaryDevice (device_id) VALUES (2)
    INTO StationaryDevice (device_id) VALUES (3)
    INTO StationaryDevice (device_id) VALUES (4)
    INTO StationaryDevice (device_id) VALUES (5)
SELECT * FROM dual;



INSERT ALL
    INTO SubUser (Id, firstName, lastName, phone_number, email) VALUES (1, 'John', 'Doe', '1233214567', 'peter.doe@email.com')
    INTO SubUser (Id, firstName, lastName, phone_number, email) VALUES (2, 'Jerry', 'Smith', '7781238901', 'jr.smith@email.com')
    INTO SubUser (Id, firstName, lastName, phone_number, email) VALUES (3, 'LeBron', 'James', '1234560000', 'savannah.james@email.com')
    INTO SubUser (Id, firstName, lastName, phone_number, email) VALUES (4, 'Stephen', 'Curry', '1203405678', 'seth.curry@email.com')
    INTO SubUser (Id, firstName, lastName, phone_number, email) VALUES (5, 'Nikola', 'Jokic', '1122334455', 'dan.jokic@email.com')
SELECT * FROM dual;

INSERT ALL
    INTO CanRead (user_id, subuser_id) VALUES (1, 1)
    INTO CanRead (user_id, subuser_id) VALUES (2, 2)
    INTO CanRead (user_id, subuser_id) VALUES (3, 3)
    INTO CanRead (user_id, subuser_id) VALUES (4, 4)
    INTO CanRead (user_id, subuser_id) VALUES (5, 5)
SELECT * FROM dual;


INSERT ALL
    INTO Programs (Id, name, description) VALUES (1, 'Strength Training', 'Program designed for building muscle strength and hypertrophy')
    INTO Programs (Id, name, description) VALUES (2, 'Cardiovascular Conditioning', 'Program focused on improving cardiovascular health')
    INTO Programs (Id, name, description) VALUES (3, 'Yoga', 'Program focused on developing the skills of Yoga')
    INTO Programs (Id, name, description) VALUES (4, 'Weight Loss', 'Program designed to help with weight loss challenges.')
    INTO Programs (Id, name, description) VALUES (5, 'Endurance Training', 'Program designed to increase your stamina and conditioning')
SELECT * FROM dual;

INSERT ALL
    INTO RegisteredIn (program_id, user_id) VALUES (1, 1)
    INTO RegisteredIn (program_id, user_id) VALUES (2, 1)
    INTO RegisteredIn (program_id, user_id) VALUES (3, 1)
    INTO RegisteredIn (program_id, user_id) VALUES (4, 1)
    INTO RegisteredIn (program_id, user_id) VALUES (5, 1)
    INTO RegisteredIn (program_id, user_id) VALUES (2, 2)
    INTO RegisteredIn (program_id, user_id) VALUES (3, 3)
    INTO RegisteredIn (program_id, user_id) VALUES (4, 4)
    INTO RegisteredIn (program_id, user_id) VALUES (4, 2)
    INTO RegisteredIn (program_id, user_id) VALUES (5, 3)
    INTO RegisteredIn (program_id, user_id) VALUES (5, 4)
    INTO RegisteredIn (program_id, user_id) VALUES (1, 3)
    INTO RegisteredIn (program_id, user_id) VALUES (2, 3)
    INTO RegisteredIn (program_id, user_id) VALUES (4, 3)
    INTO RegisteredIn (program_id, user_id) VALUES (1, 5)
    INTO RegisteredIn (program_id, user_id) VALUES (2, 5)
    INTO RegisteredIn (program_id, user_id) VALUES (3, 5)
    INTO RegisteredIn (program_id, user_id) VALUES (4, 5)
SELECT * FROM dual;



INSERT ALL
    INTO Conditions (scientific_name, description, treatment) VALUES ('Diabetes', 'High blood sugar level', 'Insulin therapy')
    INTO Conditions (scientific_name, description, treatment) VALUES ('Asthma', 'Inflammation of the airways', 'Inhalers')
    INTO Conditions (scientific_name, description, treatment) VALUES ('Arthritis', 'Inflammation of the joints', 'Physical therapy')
    INTO Conditions (scientific_name, description, treatment) VALUES ('Hypertension', 'High blood pressure', 'Medication and lifestyle changes')
    INTO Conditions (scientific_name, description, treatment) VALUES ('Obesity', 'Excess body fat', 'Diet, exercise')
SELECT * FROM dual;


INSERT ALL
    INTO DiagnosedWith (condition_id, user_id) VALUES ('Diabetes', 1)
    INTO DiagnosedWith (condition_id, user_id) VALUES ('Asthma', 2)
    INTO DiagnosedWith (condition_id, user_id) VALUES ('Arthritis', 3)
    INTO DiagnosedWith (condition_id, user_id) VALUES ('Hypertension', 4)
    INTO DiagnosedWith (condition_id, user_id) VALUES ('Obesity', 5)
SELECT * FROM dual;


INSERT ALL
    INTO Users_Vitals (device_id, user_id, time_recorded, pulse_rate, blood_pressure) VALUES (1, 1, TIMESTAMP '2023-07-15 12:00:00', 90, '120/80')
    INTO Users_Vitals (device_id, user_id, time_recorded, pulse_rate, blood_pressure) VALUES (2, 2, TIMESTAMP '2023-08-20 14:30:00', 85, '125/85')
    INTO Users_Vitals (device_id, user_id, time_recorded, pulse_rate, blood_pressure) VALUES (3, 3, TIMESTAMP '2023-09-25 16:45:00', 88, '118/78')
    INTO Users_Vitals (device_id, user_id, time_recorded, pulse_rate, blood_pressure) VALUES (4, 4, TIMESTAMP '2023-10-10 10:15:00', 92, '122/82')
    INTO Users_Vitals (device_id, user_id, time_recorded, pulse_rate, blood_pressure) VALUES (5, 5, TIMESTAMP '2023-11-05 18:00:00', 87, '115/75')
SELECT * FROM dual;
