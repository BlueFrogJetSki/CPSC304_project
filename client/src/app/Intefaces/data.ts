interface Data { }

interface ConsultantData extends Data {
    Id:number;
    Title: string;
    Name: string;
    Education: string;
    Email: string;
}
// update requirement: 
// The application should display the tuples that are available for the relation so the
// user can select which tuple they want to update (based on the key).
interface HealthEntryData extends Data {
    Id: number;
    Date: Date|string;
    Prescription?: string;
    Treatment?: string;
    Notes?: string;
    userId:number;
    consultantId:number;
}
interface SubUserData extends Data {
    Id: number;
    FirstName: string;
    LastName: string;
    Phonenumber: string;
    Email: string;
}
interface UserData extends Data {
    Id:number;
    FirstName: string;
    LastName: string;
    dob: Date;
    consultant_id: number;
}

//Todo Projection requirement:
// The user can choose any number of attributes to view from this relation. Non-
// selected attributes must not appear in the result.
interface VitalsData extends Data {
    deviceId: number;
    userId: number;
    datetime: Date;
    pulseRate: number;
    bloodPressure: string;
}

interface DeviceData extends Data {
    id: number; // Primary Key (PK), NOT NULL
    model: string; // VARCHAR(10), NOT NULL
    deviceType: string; // VARCHAR(20), NOT NULL
    userId: number; // Foreign Key (FK), referencing a user, NOT NULL
}

// Selection requirements
// The user should be allowed to search for tuples using any number of AND/OR
// clauses and combinations of attributes. Conditions can be based on equality or
// more complex operations (e.g., less than).
interface ConditionData extends Data {
    scientificName: string; // Primary Key (PK), VARCHAR(50)
    description: string;    // VARCHAR(200)
    treatment: string;      // VARCHAR(100)
  }

//
  interface ProgramData extends Data {
    id:number;
    name:string;
    description:string;
}
