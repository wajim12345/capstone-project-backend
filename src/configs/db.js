const mysql = require("mysql2");

const requireSSL = process.env.REQUIRE_SSL === "true";

// Create a connection to the database
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Wait for connections when pool is full
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0,
  ssl: requireSSL ? {} : false, // Enable SSL without specifying the certificate
});

const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      userId INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phoneNumber VARCHAR(20) NOT NULL,
      address VARCHAR(100) NOT NULL,
      postalCode VARCHAR(10) NOT NULL,
      city VARCHAR(50) NOT NULL,
      province VARCHAR(50) NOT NULL,
      SIN VARCHAR(50) NOT NULL,
      rate FLOAT NOT NULL,
      isAdmin TINYINT(1) NOT NULL,
      isOutsideProvider TINYINT(1) NOT NULL,
      agency VARCHAR(50),
      beneficiary VARCHAR(50),
      licencingCollege VARCHAR(50),
      registrationNumber VARCHAR(50),
      contractStartDate DATE NOT NULL,
      contractEndDate DATE NOT NULL,
      resetPasswordToken VARCHAR(255),
      resetPasswordExpires DATETIME,
      captchaCode VARCHAR(6),
      role VARCHAR(50) NOT NULL
    );
    `;

connection.query(createUserTableQuery, (err, results) => {
  if (err) {
    return console.error("Error creating users table:", err);
  }
  console.log("Users table is created.");

  // Create ExistingClient table next
  const createExistingClientTableQuery = `
    CREATE TABLE IF NOT EXISTS ExistingClient (
      clientId INT AUTO_INCREMENT PRIMARY KEY,
      psNote TEXT,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      gender VARCHAR(20) NOT NULL,
      birthDate DATE NOT NULL,
      address VARCHAR(100) NOT NULL,
      city VARCHAR(50) NOT NULL,
      province VARCHAR(50) NOT NULL,
      postalCode VARCHAR(10) NOT NULL,
      school VARCHAR(50),
      age INT,
      fscdIdNum VARCHAR(50),
      currentStatus BOOLEAN,
      phoneNumber VARCHAR(20) NOT NULL,
      email VARCHAR(100) NOT NULL,
      serviceStartDate DATE,
      serviceEndDate DATE,
      grade VARCHAR(10)
    );
  `;

  connection.query(createExistingClientTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating ExistingClient table:", err);
      return;
    }
    console.log("ExistingClient table is created.");

    // Create Files table
    const createFileTableQuery = `
      CREATE TABLE IF NOT EXISTS files (
        fileId INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT NULL,
        userId INT NULL,
        urlId VARCHAR(255) NOT NULL,
        fileName VARCHAR(50),
        filePath VARCHAR(255),
        fileSize INT,
        fileType VARCHAR(50),
        fileCategory TINYINT(1) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
      );
    `;

    connection.query(createFileTableQuery, (err, results) => {
      if (err) {
        console.error("Error creating File table:", err);
        return;
      }
      console.log("File table is created.");
    });

    // Create TeamMember table
    const createTeamMemberTableQuery = `
      CREATE TABLE IF NOT EXISTS TeamMember (
        teamMemberId INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT NOT NULL,
        userId INT,
        outsideProviderId INT,
        startServiceDate DATE,
        endServiceDate DATE,
        FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
        FOREIGN KEY (outsideProviderId) REFERENCES OutsideProvider(outsideProviderId) ON DELETE CASCADE
      );
    `;

    connection.query(createTeamMemberTableQuery, (err, results) => {
      if (err) {
        console.error("Error creating TeamMember table:", err);
        return;
      }
      console.log("TeamMember table is created.");
    });
  });

  const createContractTableQuery = `
  CREATE TABLE IF NOT EXISTS clientContract (
    contractId INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    fileId INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    COOhours INT,
    PBChours INT,
    SLPhours INT,
    OThours INT,
    PThours INT,
    AIDEhours INT,
    COUShours INT,
    CARhours INT,
    FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
    FOREIGN KEY (fileId) REFERENCES Files(fileId) ON DELETE CASCADE
  );
  `;

  connection.query(createContractTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating Contract table:", err);
      return;
    }
    console.log("Contract table is created.");
  });

  // Create consent table after ExistingClient is created
  const createConsentTableQuery = `
    CREATE TABLE IF NOT EXISTS consent (
      consentId INT AUTO_INCREMENT PRIMARY KEY,
      clientId INT NOT NULL,
      permissionNote TEXT NOT NULL,
      receivedDate DATE NOT NULL,
      withdrawDate DATE,
      FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
    );
    `;

  connection.query(createConsentTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating Consent table:", err);
      return;
    }
    console.log("Consent table is created.");
  });

  // Create InsuranceInfo table after ExistingClient is created
  const createInsuranceInfoTableQuery = `
    CREATE TABLE IF NOT EXISTS InsuranceInfo (
      insuranceInfoId INT AUTO_INCREMENT PRIMARY KEY,
      clientId INT NOT NULL,
      insuranceProvider VARCHAR(50) NOT NULL,
      primaryPlanName VARCHAR(50) NOT NULL,
      certificateId VARCHAR(50) NOT NULL,
      coverateDetail TEXT,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
    );
    `;

  connection.query(createInsuranceInfoTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating InsuranceInfo table:", err);
      return;
    }
    console.log("InsuranceInfo table is created.");
  });

  const createDiagnosisTableQuery = `
  CREATE TABLE IF NOT EXISTS Diagnosis (
    diagnosisId INT AUTO_INCREMENT PRIMARY KEY,
    diagnosis VARCHAR(50) NOT NULL,
    aType TINYINT(1) NOT NULL,
    clientId INT NOT NULL,
    FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
  );
  `;

  connection.query(createDiagnosisTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating Diagnosis table:", err);
      return;
    }
    console.log("Diagnosis table is created.");
  });

  // Create waitlistClient table
  const createWaitlistClientTableQuery = `
CREATE TABLE IF NOT EXISTS waitlistClient (
  waitlistClientId INT AUTO_INCREMENT PRIMARY KEY,
  datePlaced DATE NOT NULL, 
  dateContact DATE NOT NULL,
  dateServiceOffered DATE,
  dateStartedService DATE,
  community VARCHAR(100),
  fundingSources VARCHAR(255),
  serviceProvidersNeeded VARCHAR(255),
  consultHistory TEXT,
  dateConsultationBooked DATE,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  gender VARCHAR(20),
  birthDate DATE,
  address VARCHAR(100),
  postalCode VARCHAR(10),
  province VARCHAR(50),
  city VARCHAR(100),
  phoneNumber VARCHAR(20),
  email VARCHAR(100),
  diagnosis VARCHAR(255),
  school VARCHAR(100),
  fscdIdNum VARCHAR(50), 
  caseWorkerName VARCHAR(50),
  serviceType VARCHAR(100),
  availability VARCHAR(255),
  locationOfService VARCHAR(100),
  feeDiscussed BOOLEAN,
  followUp VARCHAR(255),
  referralFrom VARCHAR(255),
  previousService VARCHAR(255),
  paperworkDeadline DATE,
  nextMeetingDate DATE,
  concerns TEXT,
  pets VARCHAR(255),
  parentName VARCHAR(100), -- Added missing field
  language VARCHAR(50), -- Added missing field
  siblings VARCHAR(255), -- Added missing field
  hasConverted BOOLEAN NOT NULL, -- Added missing field
  isArchived BOOLEAN NOT NULL
);
`;

  connection.query(createWaitlistClientTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating waitlistClient table:", err);
      return;
    }
    console.log("waitlistClient table is created.");
  });

  const createPrimaryGuardianTableQuery = `
CREATE TABLE IF NOT EXISTS PrimaryGuardian (
  guardianId INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  custody VARCHAR(100) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  relationship VARCHAR(50),
  phoneNumber VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  address VARCHAR(100),
  city VARCHAR(50),
  province VARCHAR(50),
  postalCode VARCHAR(10),
  FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
);
`;

  connection.query(createPrimaryGuardianTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating PrimaryGuardian table:", err);
      return;
    }
    console.log("PrimaryGuardian table is created.");
  });

  const createOutsideProviderTableQuery = `
  CREATE TABLE IF NOT EXISTS OutsideProvider (
    outsideProviderId INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(20),
    email VARCHAR(100),
    agency VARCHAR(50)
  );
  `;

  connection.query(createOutsideProviderTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating OutsideProvider table:", err);
      return;
    }
    console.log("OutsideProvider table is created.");
  });

  const createStaffContractTableQuery = `
CREATE TABLE IF NOT EXISTS staffContract (
    contractId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    fileId INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId) ON DELETE CASCADE,
    FOREIGN KEY (fileId) REFERENCES Files(fileId) ON DELETE CASCADE
);
    `;

  connection.query(createStaffContractTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating Staff Contract table:", err);
      return;
    }
    console.log("Staff contract table is created.");
  });
});

const createInvoiceTableQuery = `
  CREATE TABLE IF NOT EXISTS Invoice (
    invoiceId INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    month DATE NOT NULL,
    rate FLOAT NOT NULL,
    hours FLOAT NOT NULL,
    isGiven BOOLEAN NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
  );
`;

connection.query(createInvoiceTableQuery, (err, results) => {
  if (err) {
    console.error("Error creating Invoice table:", err);
    return;
  }
  console.log("Invoice table is created.");
});

module.exports = connection;

// const mysql = require("mysql2");
// require("dotenv").config();

// // Create a connection pool to the database
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   charset: "utf8mb4",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// // Helper function to execute queries
// const query = (sql, params = []) =>
//   new Promise((resolve, reject) => {
//     pool.query(sql, params, (err, results) => {
//       if (err) return reject(err);
//       resolve(results);
//     });
//   });

// // Close pool connection (used in tests or app teardown)
// const end = () =>
//   new Promise((resolve, reject) => {
//     pool.end((err) => {
//       if (err) return reject(err);
//       resolve();
//     });
//   });

// // Function to create tables
// const createTables = async () => {
//   try {
//     // Create Users table
//     await query(`
//       CREATE TABLE IF NOT EXISTS users (
//         userId INT AUTO_INCREMENT PRIMARY KEY,
//         firstName VARCHAR(50) NOT NULL,
//         lastName VARCHAR(50) NOT NULL,
//         email VARCHAR(100) NOT NULL UNIQUE,
//         password VARCHAR(255) NOT NULL,
//         phoneNumber VARCHAR(20) NOT NULL,
//         address VARCHAR(100) NOT NULL,
//         postalCode VARCHAR(10) NOT NULL,
//         city VARCHAR(50) NOT NULL,
//         province VARCHAR(50) NOT NULL,
//         SIN VARCHAR(50) NOT NULL,
//         rate FLOAT NOT NULL,
//         isAdmin TINYINT(1) NOT NULL,
//         isOutsideProvider TINYINT(1) NOT NULL,
//         agency VARCHAR(50),
//         beneficiary VARCHAR(50),
//         licencingCollege VARCHAR(50),
//         registrationNumber VARCHAR(50),
//         contractStartDate DATE NOT NULL,
//         contractEndDate DATE NOT NULL,
//         resetPasswordToken VARCHAR(255),
//         resetPasswordExpires DATETIME,
//         captchaCode VARCHAR(6),
//         role VARCHAR(50) NOT NULL
//       );
//     `);
//     console.log("Users table is created.");

//     // Create ExistingClient table
//     await query(`
//       CREATE TABLE IF NOT EXISTS ExistingClient (
//         clientId INT AUTO_INCREMENT PRIMARY KEY,
//         psNote TEXT,
//         firstName VARCHAR(50) NOT NULL,
//         lastName VARCHAR(50) NOT NULL,
//         gender VARCHAR(20) NOT NULL,
//         birthDate DATE NOT NULL,
//         address VARCHAR(100) NOT NULL,
//         city VARCHAR(50) NOT NULL,
//         province VARCHAR(50) NOT NULL,
//         postalCode VARCHAR(10) NOT NULL,
//         school VARCHAR(50),
//         age INT,
//         fscdIdNum VARCHAR(50),
//         currentStatus BOOLEAN,
//         phoneNumber VARCHAR(20) NOT NULL,
//         email VARCHAR(100) NOT NULL,
//         serviceStartDate DATE,
//         serviceEndDate DATE,
//         grade VARCHAR(10)
//       );
//     `);
//     console.log("ExistingClient table is created.");

//     // Create Files table
//     await query(`
//       CREATE TABLE IF NOT EXISTS files (
//         fileId INT AUTO_INCREMENT PRIMARY KEY,
//         clientId INT NULL,
//         userId INT NULL,
//         urlId VARCHAR(255) NOT NULL,
//         fileName VARCHAR(50),
//         filePath VARCHAR(255),
//         fileSize INT,
//         fileType VARCHAR(50),
//         fileCategory TINYINT(1) NOT NULL,
//         createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
//         FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
//       );
//     `);
//     console.log("Files table is created.");

//     // Create TeamMember table
//     await query(`
//       CREATE TABLE IF NOT EXISTS TeamMember (
//         teamMemberId INT AUTO_INCREMENT PRIMARY KEY,
//         clientId INT NOT NULL,
//         userId INT,
//         outsideProviderId INT,
//         startServiceDate DATE,
//         endServiceDate DATE,
//         FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
//         FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
//       );
//     `);
//     console.log("TeamMember table is created.");

//     // Create ClientContract table
//     await query(`
//       CREATE TABLE IF NOT EXISTS clientContract (
//         contractId INT AUTO_INCREMENT PRIMARY KEY,
//         clientId INT NOT NULL,
//         fileId INT NOT NULL,
//         startDate DATE NOT NULL,
//         endDate DATE NOT NULL,
//         COOhours INT,
//         PBChours INT,
//         SLPhours INT,
//         OThours INT,
//         PThours INT,
//         AIDEhours INT,
//         COUShours INT,
//         CARhours INT,
//         FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
//         FOREIGN KEY (fileId) REFERENCES files(fileId) ON DELETE CASCADE
//       );
//     `);
//     console.log("ClientContract table is created.");

//     // Create Consent table
//     await query(`
//       CREATE TABLE IF NOT EXISTS consent (
//         consentId INT AUTO_INCREMENT PRIMARY KEY,
//         clientId INT NOT NULL,
//         permissionNote TEXT NOT NULL,
//         receivedDate DATE NOT NULL,
//         withdrawDate DATE,
//         FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
//       );
//     `);
//     console.log("Consent table is created.");

//     // Create InsuranceInfo table
//     await query(`
//       CREATE TABLE IF NOT EXISTS InsuranceInfo (
//         insuranceInfoId INT AUTO_INCREMENT PRIMARY KEY,
//         clientId INT NOT NULL,
//         insuranceProvider VARCHAR(50) NOT NULL,
//         primaryPlanName VARCHAR(50) NOT NULL,
//         certificateId VARCHAR(50) NOT NULL,
//         coverateDetail TEXT,
//         startDate DATE NOT NULL,
//         endDate DATE NOT NULL,
//         FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
//       );
//     `);
//     console.log("InsuranceInfo table is created.");

//     // Create Diagnosis table
//     await query(`
//       CREATE TABLE IF NOT EXISTS Diagnosis (
//         diagnosisId INT AUTO_INCREMENT PRIMARY KEY,
//         diagnosis VARCHAR(50) NOT NULL,
//         aType TINYINT(1) NOT NULL,
//         clientId INT NOT NULL,
//         FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
//       );
//     `);
//     console.log("Diagnosis table is created.");

//     // Create WaitlistClient table
//     await query(`
//       CREATE TABLE IF NOT EXISTS waitlistClient (
//         waitlistClientId INT AUTO_INCREMENT PRIMARY KEY,
//         datePlaced DATE NOT NULL,
//         dateContact DATE NOT NULL,
//         dateServiceOffered DATE,
//         dateStartedService DATE,
//         community VARCHAR(100),
//         fundingSources VARCHAR(255),
//         serviceProvidersNeeded VARCHAR(255),
//         consultHistory TEXT,
//         dateConsultationBooked DATE,
//         firstName VARCHAR(50) NOT NULL,
//         lastName VARCHAR(50) NOT NULL,
//         gender VARCHAR(20),
//         birthDate DATE,
//         address VARCHAR(100),
//         postalCode VARCHAR(10),
//         province VARCHAR(50),
//         city VARCHAR(100),
//         phoneNumber VARCHAR(20),
//         email VARCHAR(100),
//         diagnosis VARCHAR(255),
//         school VARCHAR(100),
//         fscdIdNum VARCHAR(50),
//         caseWorkerName VARCHAR(50),
//         serviceType VARCHAR(100),
//         availability VARCHAR(255),
//         locationOfService VARCHAR(100),
//         feeDiscussed BOOLEAN,
//         followUp VARCHAR(255),
//         referralFrom VARCHAR(255),
//         previousService VARCHAR(255),
//         paperworkDeadline DATE,
//         nextMeetingDate DATE,
//         concerns TEXT,
//         pets VARCHAR(255),
//         parentName VARCHAR(100),
//         language VARCHAR(50),
//         siblings VARCHAR(255),
//         hasConverted BOOLEAN NOT NULL,
//         isArchived BOOLEAN NOT NULL
//       );
//     `);
//     console.log("WaitlistClient table is created.");

//     // Create Invoice table
//     await query(`
//       CREATE TABLE IF NOT EXISTS Invoice (
//         invoiceId INT AUTO_INCREMENT PRIMARY KEY,
//         userId INT NOT NULL,
//         firstName VARCHAR(50) NOT NULL,
//         lastName VARCHAR(50) NOT NULL,
//         month DATE NOT NULL,
//         rate FLOAT NOT NULL,
//         hours FLOAT NOT NULL,
//         isGiven BOOLEAN NOT NULL,
//         FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
//       );
//     `);
//     console.log("Invoice table is created.");

//     console.log("All tables have been created successfully.");
//   } catch (err) {
//     console.error("Error creating tables:", err);
//   }
// };

// // Initialize tables
// createTables();

// module.exports = {
//   query,
//   end,
// };
