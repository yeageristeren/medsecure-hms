-- ==========================
-- USERS
-- ==========================
INSERT INTO app_user ( username, password, provider_type)
VALUES
    ( 'mohit@gmail.com', 'password123', 'EMAIL'),
    ( 'rahul@gmail.com', 'password123', 'EMAIL');

-- ==========================
-- INSURANCE
-- ==========================
INSERT INTO insurance (id, policy_number, provider, valid_until, created_at)
VALUES
    (1, 'POL123456', 'Star Health', '2026-12-31', NOW()),
    (2, 'POL654321', 'HDFC Ergo', '2027-06-30', NOW());

-- ==========================
-- PATIENT
-- ==========================
INSERT INTO patient (
    user_id,
    name,
    birth_date,
    email,
    gender,
    created_at,
    blood_group,
    patient_insurance_id
)
VALUES
    (1, 'Mohit Sharma', '2003-03-25', 'mohit@gmail.com', 'Male', NOW(), 'O_POSITIVE', 1),
    (2, 'Rahul Verma', '2002-07-14', 'rahul@gmail.com', 'Male', NOW(), 'A_POSITIVE', 2);
