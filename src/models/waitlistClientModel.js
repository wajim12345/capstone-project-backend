// src/models/waitlistClientModel.js
const connection = require('../configs/db');

function handleDateValue(date) {
  return date && date !== '' ? date : null;
}
const waitlistClientModel = {
  createWaitlistClient: (data, callback) => {
    const query = `
      INSERT INTO waitlistClient (
        datePlaced, dateContact, dateServiceOffered, dateStartedService,
        community, fundingSources, serviceProvidersNeeded, consultHistory, dateConsultationBooked,
        firstName, lastName, gender, birthDate, address, postalCode, province, city, phoneNumber, email,
        diagnosis, school, fscdIdNum, caseWorkerName, serviceType,
        availability, locationOfService, feeDiscussed,
        followUp, referralFrom, previousService, paperworkDeadline, nextMeetingDate,
        concerns, pets, parentName, language, siblings, hasConverted, isArchived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      handleDateValue(data.datePlaced),
      handleDateValue(data.dateContact),
      handleDateValue(data.dateServiceOffered),
      handleDateValue(data.dateStartedService),
      data.community || null,
      data.fundingSources || null,
      data.serviceProvidersNeeded ? data.serviceProvidersNeeded.join(',') : null,
      data.consultationHistory || null,
      handleDateValue(data.dateConsultationBooked),
      data.firstName || null,
      data.lastName || null,
      data.gender || null,
      handleDateValue(data.birthDate),
      data.address || null,
      data.postalCode || null,
      data.province || null,
      data.city || null,
      data.phoneNumber || null,
      data.email || null,
      data.diagnosis || null,
      data.school || null,
      data.fscdIdNum || null,
      data.caseWorkerName || null,
      data.serviceType || null,
      data.availability || null,
      data.locationOfService || null,
      data.feeDiscussed ? 1 : 0,
      data.followUp || null,
      data.referralFrom || null,
      data.previousService || null,
      handleDateValue(data.paperworkDeadline),
      handleDateValue(data.nextMeetingDate),
      data.concerns || null,
      data.pets || null,
      data.parentName || null,
      data.language || null,
      data.siblings || null,
      data.hasConverted ? 1 : 0,
      data.isArchived ? 1 : 0,
    ];

    connection.query(query, values, callback);
  },

  getAllWaitlistClients: (callback) => {
    const query = 'SELECT * FROM waitlistClient';
    connection.query(query, callback);
  },

  getWaitlistClientById: (id, callback) => {
    const query = 'SELECT * FROM waitlistClient WHERE waitlistClientId = ?';
    connection.query(query, [id], callback);
  },

  updateWaitlistClient: (id, data, callback) => {
    const query = `
      UPDATE waitlistClient SET
        datePlaced = ?, dateContact = ?, dateServiceOffered = ?, dateStartedService = ?,
        community = ?, fundingSources = ?, serviceProvidersNeeded = ?, consultHistory = ?, dateConsultationBooked = ?,
        firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, postalCode = ?, province = ?, city = ?,
        phoneNumber = ?, email = ?, diagnosis = ?, school = ?, fscdIdNum = ?, caseWorkerName = ?, serviceType = ?,
        availability = ?, locationOfService = ?, feeDiscussed = ?,
        followUp = ?, referralFrom = ?, previousService = ?, paperworkDeadline = ?, nextMeetingDate = ?,
        concerns = ?, pets = ?, parentName = ?, language = ?, siblings = ?, hasConverted = ?, isArchived = ?
      WHERE waitlistClientId = ?
    `;

    const values = [
      data.datePlaced,
      data.dateContact,
      data.dateServiceOffered,
      data.dateStartedService,
      data.community,
      data.fundingSources,
      data.serviceProvidersNeeded,
      data.consultationHistory, // Changed from data.consultHistory
      data.dateConsultationBooked,
      data.firstName,
      data.lastName,
      data.gender,
      data.birthDate,
      data.address,
      data.postalCode,
      data.province,
      data.city,
      data.phoneNumber,
      data.email,
      data.diagnosis,
      data.school,
      data.fscdIdNum,
      data.caseWorkerName,
      data.serviceType,
      data.availability,
      data.locationOfService,
      data.feeDiscussed, // Corrected from data.feesDiscussed
      data.followUp,
      data.referralFrom,
      data.previousService,
      data.paperworkDeadline,
      data.nextMeetingDate,
      data.concerns,
      data.pets, // Added
      data.parentName, // Added
      data.language, // Added
      data.siblings, // Added
      data.hasConverted, // Added
      data.isArchived,
      id // Added id at the end to match the WHERE clause
    ];

    connection.query(query, values, callback);
  },

  deleteWaitlistClient: (id, callback) => {
    const query = 'DELETE FROM waitlistClient WHERE waitlistClientId = ?';
    connection.query(query, [id], callback);
  },
};

module.exports = waitlistClientModel;
